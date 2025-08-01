"use client";

import Image from "next/image";
import { memo } from "react";

import { navElements } from "@/constants";
import { ActiveElement, NavbarProps } from "@/types/type";

import { Button } from "./ui/button";
import ShapesMenu from "./ShapesMenu";
import ActiveUsers from "./users/ActiveUsers";

const Navbar = ({ activeElement, imageInputRef, handleImageUpload, handleActiveElement }: NavbarProps) => {
  const isActive = (value: string | Array<ActiveElement>) =>
    (activeElement && activeElement.value === value) ||
    (Array.isArray(value) && value.some((val) => val?.value === activeElement?.value));

  return (
   <nav className="flex select-none items-center justify-between gap-4 bg-primary-black px-5 text-white">
  <div className="flex items-center">
  <Image src="/assets/logo.png" alt="Logo" width={64} height={80} />
  <h1 className="-ml-2.5 text-xl font-semibold leading-tight">Wrapboard</h1>
</div>


  <ul className="flex flex-row">
    {navElements.map((item: ActiveElement | any) => (
      <li
        key={item.name}
        onClick={() => {
          if (Array.isArray(item.value)) return;
          handleActiveElement(item);
        }}
        className={`group px-2.5 py-5 flex justify-center items-center
          ${isActive(item.value) ? "" : "hover:bg-primary-grey-200"}
        `}
      >
        {Array.isArray(item.value) ? (
          <ShapesMenu
            item={item}
            activeElement={activeElement}
            imageInputRef={imageInputRef}
            handleActiveElement={handleActiveElement}
            handleImageUpload={handleImageUpload}
          />
        ) : (
          <Button className="relative w-5 h-5 object-contain">
            <Image
              src={item.icon}
              alt={item.name}
              fill
              className={isActive(item.value) ? "invert" : ""}
            />
          </Button>
        )}
      </li>
    ))}
  </ul>

  <ActiveUsers />
</nav>

  );
};

export default memo(Navbar, (prevProps, nextProps) => prevProps.activeElement === nextProps.activeElement)
