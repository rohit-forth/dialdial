import React from "react";
import { cn } from "@/lib/utils";

interface MeteorsProps {
  number?: number;
  className?: string;
}

const Meteors = ({ number = 20, className }: MeteorsProps) => {
  const meteors = Array.from({ length: number }, (_, i) => i);

  return (
    <div
      className={cn(
        "fixed inset-0 overflow-hidden pointer-events-none",
        className
      )}
    >
      {meteors.map((_, idx) => (
        <span
          key={idx}
          className={cn(
            "absolute h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-[9999px] bg-mediumDynamic shadow-[0_0_0_1px_#ffffff10]",
            "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-1/2 before:bg-gradient-to-r before:from-lightFontDynamic before:to-transparent before:content-['']"
          )}
          style={{
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
            animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
            animationDuration: Math.random() * (10 - 2) + 2 + "s",
          }}
        />
      ))}
    </div>
  );
};

export default Meteors;
