"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { getShapeInfo } from "@/lib/utils";
import { CollapseButton } from "./ui/collapse-button";
import { cn } from "@/lib/utils";

const LeftSidebar = ({ allShapes }: { allShapes: Array<any> }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const memoizedShapes = useMemo(
    () => (
      <section className={cn(
        "flex flex-col border-t border-primary-grey-200 bg-primary-black text-primary-grey-300 sticky left-0 h-full max-sm:hidden select-none overflow-y-auto pb-20 transition-all duration-300",
        isCollapsed ? "w-0 opacity-0 invisible" : "min-w-[227px] w-[227px] opacity-100 visible"
      )}>
        <h3 className="border border-primary-grey-200 px-5 py-4 text-xs uppercase">Layers</h3>
        <div className="flex flex-col">
          {allShapes?.map((shape: any) => {
            const info = getShapeInfo(shape[1]?.type);

            return (
              <div
                key={shape[1]?.objectId}
                className="group my-1 flex items-center gap-2 px-5 py-2.5 hover:cursor-pointer hover:bg-primary-green hover:text-primary-black"
              >
                <Image
                  src={info?.icon}
                  alt='Layer'
                  width={16}
                  height={16}
                  className='group-hover:invert'
                />
                <h3 className='text-sm font-semibold capitalize'>{info.name}</h3>
              </div>
            );
          })}
        </div>
      </section>
    ),
    [allShapes?.length, isCollapsed]
  );

  return (
    <div className="relative flex">
      {memoizedShapes}
      <CollapseButton
        isCollapsed={isCollapsed}
        onClick={() => setIsCollapsed(!isCollapsed)}
        direction="left"
        className="z-50"
      />
    </div>
  );
};

export default LeftSidebar;
