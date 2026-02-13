"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { House, Ticket, Letter, Lantern, Paw } from "~~/components/icons/ACIcons";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  { label: "Home", href: "/", icon: <House size={18} /> },
  { label: "Raffles", href: "/raffles", icon: <Ticket size={18} /> },
  { label: "Docs", href: "/docs", icon: <Letter size={18} /> },
  { label: "Agents", href: "/agents", icon: <Paw size={18} /> },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive
                  ? "bg-base-100/90 text-base-content shadow-sm"
                  : "text-primary-content hover:bg-base-100/50"
              } py-2 px-4 text-sm rounded-full gap-2 grid grid-flow-col font-bold transition-all duration-300`}
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

export const Header = () => {
  const burgerMenuRef = useRef<HTMLDetailsElement>(null);
  useOutsideClick(burgerMenuRef, () => {
    burgerMenuRef?.current?.removeAttribute("open");
  });

  return (
    <div className="sticky lg:static top-0 navbar min-h-0 shrink-0 justify-between z-20 px-0 sm:px-2 bg-primary border-b-2 border-base-100/50"
      style={{ boxShadow: "0 4px 20px rgba(196, 30, 58, 0.3)" }}
    >
      <div className="navbar-start w-auto lg:w-1/2">
        <details className="dropdown" ref={burgerMenuRef}>
          <summary className="ml-1 btn btn-ghost lg:hidden hover:bg-base-100/30 text-primary-content">
            <Bars3Icon className="h-1/2" />
          </summary>
          <ul
            className="menu menu-compact dropdown-content mt-3 p-2 shadow-lg rounded-2xl w-52"
            style={{ background: "var(--color-primary)", border: "2px solid rgba(255,215,0,0.3)" }}
            onClick={() => {
              burgerMenuRef?.current?.removeAttribute("open");
            }}
          >
            <HeaderMenuLinks />
          </ul>
        </details>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <House size={36} />
          <div className="flex flex-col">
            <span className="font-extrabold leading-tight text-primary-content" style={{ fontFamily: "'Ma Shan Zheng', 'Nunito', sans-serif", fontSize: "1.2rem" }}>
              BNB Lucky Draw
                        </span>
            <span className="text-xs text-primary-content/60 font-semibold flex items-center gap-1">Fortune Raffle on BNB <Lantern size={14} /></span>
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="navbar-end grow mr-4 flex items-center gap-2">
        <SwitchTheme />
        <RainbowKitCustomConnectButton />
      </div>
    </div>
  );
};
