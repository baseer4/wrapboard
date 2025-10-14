import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CollapseButtonProps {
  isCollapsed: boolean;
  onClick: () => void;
  direction: "left" | "right";
  className?: string;
}

export const CollapseButton = ({
  isCollapsed,
  onClick,
  direction,
  className,
}: CollapseButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 bg-primary-black hover:bg-primary-grey-200 rounded-full p-1.5 transition-all",
        direction === "left" ? "-right-4" : "-left-4",
        className
      )}
    >
      {direction === "left" ? (
        isCollapsed ? (
          <ChevronLeft className="h-4 w-4 text-primary-grey-300" />
        ) : (
          <ChevronRight className="h-4 w-4 text-primary-grey-300" />
        )
      ) : isCollapsed ? (
        <ChevronRight className="h-4 w-4 text-primary-grey-300" />
      ) : (
        <ChevronLeft className="h-4 w-4 text-primary-grey-300" />
      )}
    </button>
  );
};