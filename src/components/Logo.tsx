import { cn } from "@/lib/utils";
import React from "react";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      className={cn(className)}
      {...props}
    >
      <g transform="scale(0.85) translate(9, -5)">
        <g className="gauge" fill="currentColor">
          {/* Gauge Ticks */}
          {Array.from({ length: 8 }).map((_, i) => (
            <rect
              key={`tick-black-${i}`}
              x="57"
              y="12"
              width="6"
              height="10"
              rx="1"
              transform={`rotate(${-120 + i * 18}, 60, 60)`}
            />
          ))}
        </g>
        <g className="gauge-red" fill="hsl(var(--destructive))">
          {Array.from({ length: 3 }).map((_, i) => (
            <rect
              key={`tick-red-${i}`}
              x="57"
              y="12"
              width="6"
              height="10"
              rx="1"
              transform={`rotate(${30 + i * 18}, 60, 60)`}
            />
          ))}
        </g>

        {/* Dashboard background */}
        <circle cx="60" cy="60" r="35" fill="transparent" />

        {/* Needle */}
        <g transform="rotate(45 60 60)" fill="hsl(var(--destructive))">
          <polygon points="60,25 59,60 61,60" />
          <circle cx="60" cy="60" r="3" />
        </g>
      </g>
    </svg>
  );
}
