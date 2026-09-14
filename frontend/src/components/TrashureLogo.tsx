import React from "react";

interface TrashureLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function TrashureLogo({
  className = "",
  size = "md",
}: TrashureLogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* 4-Leaf Sprout Icon */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <svg
          className={
            size === "sm"
              ? "w-8 h-8"
              : size === "lg"
              ? "w-12 h-12"
              : "w-10 h-10"
          }
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Stem */}
          <path
            d="M24 44C24 33 24 22 24 10"
            stroke="#167e41"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Top Left Leaf */}
          <path
            d="M24 18C16 18 10 13 11 6C18 6 23 11 24 18Z"
            fill="#167e41"
          />
          {/* Top Right Leaf */}
          <path
            d="M24 12C31 12 37 8 36 2C29 2 25 7 24 12Z"
            fill="#1da457"
          />
          {/* Bottom Left Leaf */}
          <path
            d="M24 30C15 30 9 24 10 17C18 17 23 23 24 30Z"
            fill="#1da457"
          />
          {/* Bottom Right Leaf */}
          <path
            d="M24 25C33 25 39 20 38 13C30 13 25 19 24 25Z"
            fill="#167e41"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <span
          className={`font-extrabold tracking-tight text-[#167e41] leading-none ${
            size === "sm"
              ? "text-lg"
              : size === "lg"
              ? "text-2xl"
              : "text-[22px]"
          }`}
        >
          TRASHURE
        </span>
        <span
          className={`font-medium text-gray-500 leading-tight mt-1 ${
            size === "sm" ? "text-[11px]" : "text-[13px]"
          }`}
        >
          Kelola Sampah, Raih Manfaat
        </span>
      </div>
    </div>
  );
}
