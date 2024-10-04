"use client"

import React, { useState } from "react";
import SocialMedia from "./social-media";

const SideMenuItems = {
  "Početna": "/",
  "O nama": "/o-nama",
};

export default function SideMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toggleState, setToggleState] = useState(false);

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  const toggleOpen = () => setToggleState(true);
  const toggleClose = () => setToggleState(false);

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <div className="h-full flex">
          <div className="relative flex h-full">
            <button
              data-testid="nav-menu-button"
              className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base"
              onClick={openMenu}
            >
              Meni
            </button>
          </div>

          {menuOpen && (
            <div className="flex flex-col absolute w-full pr-4 sm:pr-0 sm:w-1/3 2xl:w-1/4 sm:min-w-min h-[calc(100vh-1rem)] z-30 inset-x-0 text-sm text-white m-2 backdrop-blur-2xl">
              <div
                data-testid="nav-menu-popup"
                className="flex flex-col h-full bg-[rgba(3,7,18,0.5)] rounded-rounded justify-between p-6"
              >
                <div className="flex justify-end" id="xmark">
                  <button
                    data-testid="close-menu-button"
                    onClick={closeMenu}
                    className="text-white"
                  >
                    X
                  </button>
                </div>
                <ul className="flex flex-col gap-6 items-start justify-start">
                  {Object.entries(SideMenuItems).map(([name, href]) => (
                    <li key={name}>
                      <a
                        href={href}
                        className="text-3xl leading-10 hover:text-links-hover text-white"
                        onClick={closeMenu}
                        data-testid={`${name.toLowerCase()}-link`}
                      >
                        {name}
                      </a>
                    </li>
                  ))}
                </ul>
                <div
                  className="flex flex-col gap-y-6"
                  onMouseEnter={toggleOpen}
                  onMouseLeave={toggleClose}
                >
                  <div className="flex justify-between">
                    <SocialMedia />
                  </div>
                  <p className="flex justify-between txt-compact-small text-white">
                    © {new Date().getFullYear()} Mosaic Memories. All rights
                    reserved.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
