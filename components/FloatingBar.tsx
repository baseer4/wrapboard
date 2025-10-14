"use client";

import Image from "next/image";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { navElements } from "@/constants";
import { ActiveElement, NavbarProps } from "@/types/type";
import ShapesMenu from "./ShapesMenu";

const FloatingBar = ({ activeElement, imageInputRef, handleImageUpload, handleActiveElement }: NavbarProps) => {
  const isActive = (value: string | Array<ActiveElement>) =>
    (activeElement && activeElement.value === value) ||
    (Array.isArray(value) && value.some((val) => val?.value === activeElement?.value));

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-primary-black/90 border border-primary-grey-200 shadow-2xl backdrop-blur-sm">
        <ul className="flex items-center gap-1">
          {navElements.map((item: ActiveElement | any) => (
            <li
              key={item.name}
              onClick={() => {
                if (Array.isArray(item.value)) return;
                handleActiveElement(item);
              }}
              className={cn(
                "p-2.5 rounded-lg flex justify-center items-center transition-all duration-200 cursor-pointer",
                isActive(item.value) 
                  ? "bg-primary-green/20" 
                  : "hover:bg-primary-grey-100/30"
              )}
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
                <div className="relative w-5 h-5">
                  <Image
                    src={item.icon}
                    alt={item.name}
                    fill
                    className={cn(
                      "transition-all duration-200",
                      isActive(item.value) ? "invert brightness-0" : ""
                    )}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default memo(FloatingBar, (prevProps, nextProps) => prevProps.activeElement === nextProps.activeElement);