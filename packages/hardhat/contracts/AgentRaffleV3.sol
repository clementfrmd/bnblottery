// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract AgentRaffleV3 is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Raffle {
        address organizer;
        address paymentToken;
        uint256 ticketPrice;
        uint256 maxTickets;
        uint256 totalTickets;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        bool isDrawn;
        bool isCancelled;
        address winner;
        uint256 winningTicket;
        uint256 totalPrize;
    }

    uint256 public constant MAX_TOTAL_FEE_BPS = 1000; // 10% hard cap
    uint256 public constant TIMELOCK_DELAY = 2 days;
    uint256 public constant ORGANIZER_STAKE = 1e6; // 1 token in 6-decimal format (USDT/USDC)
    uint256 public constant ORGANIZER_STAKE_18 = 1e18; // 1 token in 18-decimal format (USDm)

    uint256 public raffleCounter;
    bool public agentPaused;
    address public treasury;
    uint256 public platformFeeBps = 300; // 3%
    uint256 public organizerFeeBps = 200; // 2%

    // Timelock for admin changes
    struct PendingChange {
        bytes32 changeType;
        bytes data;
        uint256 executeAfter;
        bool exists;
    }
    uint256 public pendingChangeCount;
    mapping(uint256 => PendingChange) public pendingChanges;

    mapping(uint256 => Raffle) private raffles;
    mapping(uint256 => mapping(uint256 => address)) private ticketOwners;
    mapping(uint256 => mapping(address => uint256)) private participantTickets;
    mapping(uint256 => bytes32) private vrfRequestIds;
    mapping(uint256 => bool) private vrfRequested;
    mapping(uint256 => bytes32) public vrfHashes;
    mapping(address => bool) public allowedTokens;
    mapping(address => uint8) public tokenDecimals; // decimals per allowed token
    mapping(address => bool) public allowedOrganizers;
    // Per-organizer per-token stakes: organizer => token => amount
    mapping(address => mapping(address => uint256)) public organizerStakes;
    mapping(uint256 => uint256) private refundedTickets;

    event RaffleCreated(uint256 indexed raffleId, address indexed organizer, address paymentToken, uint256 ticketPrice, uint256 maxTickets, uint256 endTime);
    event TicketPurchased(uint256 indexed raffleId, address indexed participant, uint256 ticketCount, uint256 amountPaid);
    event WinnerSelected(uint256 indexed raffleId, address indexed winner, uint256 winningTicket, bytes32 vrfHash);
    event RaffleCancelled(uint256 indexed raffleId, string reason);
    event FeesUpdated(uint256 platformFeeBps, uint256 organizerFeeBps);
    event TreasuryUpdated(address newTreasury);
    event TokenAllowed(address token, bool allowed, uint8 decimals);
    event OrganizerAllowed(address organizer, bool allowed);
    event OrganizerRegistered(address organizer, address token, uint256 stake);
    event OrganizerUnregistered(address organizer, address token, uint256 stakeReturned);
    event OrganizerSlashed(address organizer, address token, uint256 amount, string reason);
    event ChangeQueued(uint256 indexed changeId, bytes32 changeType, uint256 executeAfter);
    event ChangeExecuted(uint256 indexed changeId, bytes32 changeType);
    event ChangeCancelled(uint256 indexed changeId);

    constructor(address _treasury) Ownable(msg.sender) {
        require(_treasury != address(0), "Invalid treasury");
        treasury = _treasury;
        allowedOrganizers[msg.sender] = true;
    }

    /// @notice Get the stake amount for a token based on its decimals
    function getStakeAmount(address _token) public view returns (uint256) {
        uint8 dec = tokenDecimals[_token];
        return 10 ** uint256(dec); // 1 full token
    }

    // --- Organizer registration (per token) ---

    /// @notice Stake 1 token to register as organizer for that token's raffles
    function registerAsOrganizer(address _token) external nonReentrant {
        require(allowedTokens[_token], "Token not allowed");
        require(organizerStakes[msg.sender][_token] == 0, "Already staked for this token");

        uint256 stakeAmount = getStakeAmount(_token);
        IERC20(_token).safeTransferFrom(msg.sender, address(this), stakeAmount);

        organizerStakes[msg.sender][_token] = stakeAmount;
        if (!allowedOrganizers[msg.sender]) {
            allowedOrganizers[msg.sender] = true;
        }

        emit OrganizerRegistered(msg.sender, _token, stakeAmount);
    }

    /// @notice Unregister and get stake back for a specific token (only if no active raffles with that token)
    function unregisterAsOrganizer(address _token) external nonReentrant {
        uint256 stake = organizerStakes[msg.sender][_token];
        require(stake > 0, "No stake for this token");

        // Check no active raffles with this token
        for (uint256 i = 0; i < raffleCounter; i++) {
            Raffle storage r = raffles[i];
            if (r.organizer == msg.sender && r.paymentToken == _token && r.isActive && !r.isDrawn && !r.isCancelled) {
                revert("Cannot unregister with active raffles for this token");
            }
        }

        organizerStakes[msg.sender][_token] = 0;

        // Check if organizer has any remaining stakes
        // (we don't revoke allowedOrganizers here — they can still have stakes in other tokens)

        IERC20(_token).safeTransfer(msg.sender, stake);
        emit OrganizerUnregistered(msg.sender, _token, stake);
    }

    // --- Raffle lifecycle ---

    function createRaffle(
        address _paymentToken,
        uint256 _ticketPrice,
        uint256 _maxTickets,
        uint256 _duration
    ) external returns (uint256) {
        require(!agentPaused, "Agent is paused");
        require(allowedOrganizers[msg.sender], "Not an allowed organizer");
        require(allowedTokens[_paymentToken], "Token not allowed");
        require(organizerStakes[msg.sender][_paymentToken] > 0, "Must stake in this token first");
        require(_ticketPrice > 0, "Price must be > 0");
        require(_maxTickets > 0, "Max tickets must be > 0");
        require(_duration > 0, "Duration must be > 0");

        uint256 raffleId = raffleCounter++;
        uint256 endTime = block.timestamp + _duration;

        raffles[raffleId] = Raffle({
            organizer: msg.sender,
            paymentToken: _paymentToken,
            ticketPrice: _ticketPrice,
            maxTickets: _maxTickets,
            totalTickets: 0,
            startTime: block.timestamp,
            endTime: endTime,
            isActive: true,
            isDrawn: false,
            isCancelled: false,
            winner: address(0),
            winningTicket: 0,
            totalPrize: 0
        });

        emit RaffleCreated(raffleId, msg.sender, _paymentToken, _ticketPrice, _maxTickets, endTime);
        return raffleId;
    }

    function purchaseTickets(uint256 _raffleId, uint256 _ticketCount) external nonReentrant {
        Raffle storage raffle = raffles[_raffleId];
        require(raffle.isActive, "Raffle not active");
        require(!raffle.isCancelled, "Raffle cancelled");
        require(block.timestamp < raffle.endTime, "Raffle ended");
        require(_ticketCount > 0, "Must buy > 0 tickets");
        require(_ticketCount <= 100, "Max 100 tickets per tx");
        require(raffle.totalTickets + _ticketCount <= raffle.maxTickets, "Exceeds max tickets");

        uint256 totalCost = raffle.ticketPrice * _ticketCount;

        // Effects before interactions (CEI pattern)
        uint256 startTicket = raffle.totalTickets;
        for (uint256 i = 0; i < _ticketCount; i++) {
            ticketOwners[_raffleId][startTicket + i] = msg.sender;
        }

        raffle.totalTickets += _ticketCount;
        raffle.totalPrize += totalCost;
        participantTickets[_raffleId][msg.sender] += _ticketCount;

        emit TicketPurchased(_raffleId, msg.sender, _ticketCount, totalCost);

        IERC20(raffle.paymentToken).safeTransferFrom(msg.sender, address(this), totalCost);
    }

    function drawWinner(uint256 _raffleId, uint256 _randomNumber, bytes32 _vrfHash) external nonReentrant {
        Raffle storage raffle = raffles[_raffleId];
        require(raffle.isActive, "Raffle not active");
        require(!raffle.isDrawn, "Already drawn");
        require(!raffle.isCancelled, "Cancelled");
        require(block.timestamp >= raffle.endTime || raffle.totalTickets == raffle.maxTickets, "Not ended yet");
        require(raffle.totalTickets > 0, "No tickets sold");
        require(msg.sender == raffle.organizer || msg.sender == owner(), "Not authorized");

        uint256 winningTicket = _randomNumber % raffle.totalTickets;

        raffle.winner = ticketOwners[_raffleId][winningTicket];
        raffle.winningTicket = winningTicket;
        raffle.isDrawn = true;
        raffle.isActive = false;

        vrfHashes[_raffleId] = _vrfHash;
        vrfRequestIds[_raffleId] = _vrfHash;
        vrfRequested[_raffleId] = true;

        // Fee splitting
        uint256 platformFee = (raffle.totalPrize * platformFeeBps) / 10000;
        uint256 orgFee = (raffle.totalPrize * organizerFeeBps) / 10000;
        uint256 winnerPrize = raffle.totalPrize - platformFee - orgFee;

        IERC20(raffle.paymentToken).safeTransfer(treasury, platformFee);
        IERC20(raffle.paymentToken).safeTransfer(raffle.organizer, orgFee);
        IERC20(raffle.paymentToken).safeTransfer(raffle.winner, winnerPrize);

        emit WinnerSelected(_raffleId, raffle.winner, winningTicket, _vrfHash);
    }

    /// @notice Organizer can only cancel if no tickets sold. After that, only owner can cancel.
    function cancelRaffle(uint256 _raffleId, string calldata _reason) external {
        Raffle storage raffle = raffles[_raffleId];
        require(!raffle.isDrawn, "Already drawn");
        require(!raffle.isCancelled, "Already cancelled");

        if (msg.sender == raffle.organizer) {
            require(raffle.totalTickets == 0, "Cannot cancel: tickets already sold");
        } else {
            require(msg.sender == owner(), "Not authorized");
        }

        raffle.isCancelled = true;
        raffle.isActive = false;

        emit RaffleCancelled(_raffleId, _reason);
    }

    function emergencyRefund(uint256 _raffleId) external nonReentrant {
        Raffle storage raffle = raffles[_raffleId];
        require(raffle.isCancelled, "Not cancelled");
        uint256 tickets = participantTickets[_raffleId][msg.sender];
        require(tickets > 0, "No tickets");

        participantTickets[_raffleId][msg.sender] = 0;
        refundedTickets[_raffleId] += tickets;
        uint256 refund = raffle.ticketPrice * tickets;
        IERC20(raffle.paymentToken).safeTransfer(msg.sender, refund);
    }

    // --- View functions ---

    function getRaffle(uint256 _raffleId) external view returns (Raffle memory) {
        return raffles[_raffleId];
    }

    function getParticipantTickets(uint256 _raffleId, address _participant) external view returns (uint256) {
        return participantTickets[_raffleId][_participant];
    }

    function getTicketOwner(uint256 _raffleId, uint256 _ticketNumber) external view returns (address) {
        return ticketOwners[_raffleId][_ticketNumber];
    }

    function getVRFRequestStatus(uint256 _raffleId) external view returns (bytes32 requestId, bool requested) {
        return (vrfRequestIds[_raffleId], vrfRequested[_raffleId]);
    }

    function getActiveRaffles() external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < raffleCounter; i++) {
            if (raffles[i].isActive) count++;
        }
        uint256[] memory activeIds = new uint256[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < raffleCounter; i++) {
            if (raffles[i].isActive) {
                activeIds[idx++] = i;
            }
        }
        return activeIds;
    }

    function getRafflesByOrganizer(address _organizer) external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < raffleCounter; i++) {
            if (raffles[i].organizer == _organizer) count++;
        }
        uint256[] memory ids = new uint256[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < raffleCounter; i++) {
            if (raffles[i].organizer == _organizer) {
                ids[idx++] = i;
            }
        }
        return ids;
    }

    // --- Admin functions ---

    /// @notice Owner can slash a bad organizer's stake for a specific token
    function slashOrganizer(address _organizer, address _token, string calldata _reason) external onlyOwner nonReentrant {
        uint256 stake = organizerStakes[_organizer][_token];
        require(stake > 0, "No stake to slash");
        organizerStakes[_organizer][_token] = 0;
        IERC20(_token).safeTransfer(treasury, stake);
        emit OrganizerSlashed(_organizer, _token, stake, _reason);
    }

    // --- Timelocked admin functions ---

    function queueSetFees(uint256 _platformFeeBps, uint256 _organizerFeeBps) external onlyOwner {
        require(_platformFeeBps + _organizerFeeBps <= MAX_TOTAL_FEE_BPS, "Fees exceed 10% cap");
        uint256 changeId = pendingChangeCount++;
        pendingChanges[changeId] = PendingChange({
            changeType: keccak256("SET_FEES"),
            data: abi.encode(_platformFeeBps, _organizerFeeBps),
            executeAfter: block.timestamp + TIMELOCK_DELAY,
            exists: true
        });
        emit ChangeQueued(changeId, keccak256("SET_FEES"), block.timestamp + TIMELOCK_DELAY);
    }

    function queueSetTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury");
        uint256 changeId = pendingChangeCount++;
        pendingChanges[changeId] = PendingChange({
            changeType: keccak256("SET_TREASURY"),
            data: abi.encode(_treasury),
            executeAfter: block.timestamp + TIMELOCK_DELAY,
            exists: true
        });
        emit ChangeQueued(changeId, keccak256("SET_TREASURY"), block.timestamp + TIMELOCK_DELAY);
    }

    function executeChange(uint256 _changeId) external onlyOwner {
        PendingChange storage change = pendingChanges[_changeId];
        require(change.exists, "Change does not exist");
        require(block.timestamp >= change.executeAfter, "Timelock not expired");

        if (change.changeType == keccak256("SET_FEES")) {
            (uint256 pFee, uint256 oFee) = abi.decode(change.data, (uint256, uint256));
            platformFeeBps = pFee;
            organizerFeeBps = oFee;
            emit FeesUpdated(pFee, oFee);
        } else if (change.changeType == keccak256("SET_TREASURY")) {
            address newTreasury = abi.decode(change.data, (address));
            treasury = newTreasury;
            emit TreasuryUpdated(newTreasury);
        }

        delete pendingChanges[_changeId];
        emit ChangeExecuted(_changeId, change.changeType);
    }

    function cancelChange(uint256 _changeId) external onlyOwner {
        require(pendingChanges[_changeId].exists, "Change does not exist");
        delete pendingChanges[_changeId];
        emit ChangeCancelled(_changeId);
    }

    // --- Immediate admin functions ---

    function setAgentPaused(bool _paused) external onlyOwner {
        agentPaused = _paused;
    }

    function setAllowedToken(address _token, bool _allowed, uint8 _decimals) external onlyOwner {
        require(_token != address(0), "Invalid token");
        allowedTokens[_token] = _allowed;
        if (_allowed) {
            tokenDecimals[_token] = _decimals;
        }
        emit TokenAllowed(_token, _allowed, _decimals);
    }

    function setAllowedOrganizer(address _organizer, bool _allowed) external onlyOwner {
        require(_organizer != address(0), "Invalid organizer");
        allowedOrganizers[_organizer] = _allowed;
        emit OrganizerAllowed(_organizer, _allowed);
    }

    /// @notice Force-cancel an expired raffle that was never drawn, enabling refunds
    function forceExpireRaffle(uint256 _raffleId) external {
        Raffle storage raffle = raffles[_raffleId];
        require(!raffle.isDrawn, "Already drawn");
        require(!raffle.isCancelled, "Already cancelled");
        require(raffle.totalTickets > 0, "No tickets to refund");
        require(block.timestamp >= raffle.endTime + 7 days, "Grace period not over");

        raffle.isCancelled = true;
        raffle.isActive = false;

        emit RaffleCancelled(_raffleId, "Force-expired: not drawn within grace period");
    }

    /// @notice Owner-only emergency withdraw for tokens stuck outside of active raffles
    function emergencyWithdraw(address _token, uint256 _amount) external onlyOwner nonReentrant {
        require(_token != address(0), "Invalid token");

        uint256 lockedFunds = 0;
        for (uint256 i = 0; i < raffleCounter; i++) {
            Raffle storage r = raffles[i];
            if (r.paymentToken == _token && !r.isDrawn && r.totalTickets > 0) {
                uint256 unrefunded = r.totalTickets - refundedTickets[i];
                lockedFunds += r.ticketPrice * unrefunded;
            }
        }

        uint256 balance = IERC20(_token).balanceOf(address(this));
        uint256 withdrawable = balance > lockedFunds ? balance - lockedFunds : 0;
        require(_amount <= withdrawable, "Amount exceeds withdrawable balance");

        IERC20(_token).safeTransfer(owner(), _amount);
    }
}
