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

      {/* Wrench */}
      <g className="wrench" fill="currentColor">
        <path d="M42,85 C32,85 32,100 42,100 L48,100 L48,97 L42,97 C37,97 37,88 42,88 L48,88 L48,85 Z" />
        <path d="M78,85 C88,85 88,100 78,100 L72,100 L72,97 L78,97 C83,97 83,88 78,88 L72,88 L72,85 Z" />
        <rect x="48" y="90" width="24" height="5" rx="1" />
      </g>
    </svg>
  );
}
