import React from "react";

export default function BankSampahIllustration({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`relative select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 520 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-sm"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="skyGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#eaf5ee" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#dcefe2" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#dbe8df" />
            <stop offset="100%" stopColor="#c5d8cb" />
          </linearGradient>

          <linearGradient id="roofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#417b57" />
            <stop offset="100%" stopColor="#2c5c3e" />
          </linearGradient>

          <linearGradient id="sackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3ca265" />
            <stop offset="50%" stopColor="#2c7d4d" />
            <stop offset="100%" stopColor="#1e5f38" />
          </linearGradient>

          <linearGradient id="greenBin" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#279659" />
            <stop offset="100%" stopColor="#1c7544" />
          </linearGradient>

          <linearGradient id="yellowBin" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          <linearGradient id="blueBin" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2e86de" />
            <stop offset="100%" stopColor="#1e6ab5" />
          </linearGradient>

          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* ================= BACKGROUND FOLIAGE & HILLS ================= */}
        <g opacity="0.85">
          {/* Back distant tree hills */}
          <path
            d="M-20 280 C20 220 80 230 120 250 C160 210 230 220 270 260 C300 240 360 250 400 300 L400 420 L-20 420 Z"
            fill="#bddbc5"
          />
          <circle cx="60" cy="240" r="50" fill="#a4cdae" />
          <circle cx="120" cy="230" r="60" fill="#92bf9d" />
          <circle cx="190" cy="240" r="55" fill="#a0caa9" />
          <circle cx="260" cy="260" r="45" fill="#88b894" />
          <circle cx="10" cy="270" r="40" fill="#a7cfb1" />
        </g>

        {/* Middle Trees Left & Behind Building */}
        <g>
          <ellipse cx="40" cy="290" rx="45" ry="50" fill="#75a881" />
          <ellipse cx="90" cy="300" rx="40" ry="40" fill="#679b73" />
          <ellipse cx="230" cy="300" rx="50" ry="55" fill="#6ba077" />
          <ellipse cx="280" cy="320" rx="45" ry="45" fill="#7ba884" />
        </g>

        {/* ================= BANK SAMPAH BUILDING ================= */}
        <g filter="url(#softShadow)">
          {/* Base Wall */}
          <path
            d="M20 220 L195 235 L195 330 L20 330 Z"
            fill="url(#wallGrad)"
          />

          {/* Roof Overhang */}
          <polygon
            points="10,215 205,230 200,245 5,230"
            fill="url(#roofGrad)"
          />
          {/* Roof Top Trim */}
          <polygon
            points="10,215 205,230 205,233 10,218"
            fill="#75b38d"
          />

          {/* Door Entrance */}
          <rect
            x="85"
            y="245"
            width="50"
            height="85"
            rx="2"
            fill="#6d947b"
          />
          {/* Door Glass Panes */}
          <rect x="90" y="252" width="18" height="70" rx="1" fill="#a8d3b8" opacity="0.8" />
          <rect x="112" y="252" width="18" height="70" rx="1" fill="#a8d3b8" opacity="0.8" />
          {/* Door Handles */}
          <rect x="106" y="285" width="2" height="12" fill="#ffffff" />
          <rect x="112" y="285" width="2" height="12" fill="#ffffff" />

          {/* Window Left */}
          <rect
            x="35"
            y="252"
            width="34"
            height="40"
            rx="2"
            fill="#ffffff"
          />
          <rect
            x="38"
            y="255"
            width="28"
            height="34"
            rx="1"
            fill="#8ebdc0"
          />
          {/* Window Glass Reflection & Divider */}
          <line x1="52" y1="255" x2="52" y2="289" stroke="#ffffff" strokeWidth="2" />
          <line x1="38" y1="272" x2="66" y2="272" stroke="#ffffff" strokeWidth="2" />

          {/* Sign Board "BANK SAMPAH" */}
          <rect
            x="60"
            y="233"
            width="100"
            height="20"
            rx="3"
            fill="#36744f"
            stroke="#4e996c"
            strokeWidth="1.5"
          />
          <text
            x="110"
            y="247"
            fill="#ffffff"
            fontSize="10.5"
            fontWeight="bold"
            letterSpacing="0.8"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
          >
            BANK SAMPAH
          </text>

          {/* Building Steps / Porch */}
          <path
            d="M75 330 L145 330 L155 340 L65 340 Z"
            fill="#c4d8cc"
          />
          <path
            d="M60 340 L160 340 L170 350 L50 350 Z"
            fill="#b5cdbe"
          />
        </g>

        {/* Foreground Bushes */}
        <g>
          <ellipse cx="25" cy="340" rx="30" ry="25" fill="#588d66" />
          <ellipse cx="195" cy="345" rx="35" ry="30" fill="#538861" />
          <ellipse cx="230" cy="360" rx="25" ry="20" fill="#649971" />
        </g>

        {/* Ground Floor / Road Path */}
        <ellipse
          cx="170"
          cy="385"
          rx="180"
          ry="30"
          fill="#d5e5db"
          opacity="0.7"
        />

        {/* ================= GREEN RECYCLE SACK (BAG) ================= */}
        <g filter="url(#softShadow)">
          {/* Sack Top Ruffle / Tie Knot */}
          <path
            d="M190 265 C185 255 195 248 200 252 C205 248 215 255 210 265 Z"
            fill="#236e40"
          />
          <ellipse cx="200" cy="265" rx="10" ry="4" fill="#1b5a33" />

          {/* Sack Body */}
          <path
            d="M190 265 C170 275 145 305 145 345 C145 380 175 390 200 390 C225 390 255 380 255 345 C255 305 230 275 210 265 Z"
            fill="url(#sackGrad)"
          />

          {/* Recycle Symbol ♻️ inside White Badge on Sack */}
          <circle cx="200" cy="335" r="22" fill="#ffffff" />
          {/* Sharp 3-Arrow Recycle Symbol in Green */}
          <g transform="translate(186, 321) scale(0.95)">
            <path
              d="M15 3 L19 8 L16 8 C16 11 14 14 11 16 L9.5 14 C12 12.5 13.5 10 13.5 8 L11 8 Z"
              fill="#1b8744"
            />
            <path
              d="M26 19 L21 21 L22.5 18.5 C20.5 16.5 17.5 15.5 14.5 16.5 L14 14 C18 12.5 22 13.5 24.5 16.5 L26 14.5 Z"
              fill="#1b8744"
            />
            <path
              d="M5 21 L7 16 L8.5 18.5 C11 17.5 14 18 16 20.5 L14.5 22.5 C13 20.5 10.5 20 8.5 21 L10 23.5 Z"
              fill="#1b8744"
            />
          </g>
        </g>

        {/* ================= 3 TRASH BINS (ORGANIK, ANORGANIK, KERTAS) ================= */}

        {/* 1. GREEN BIN (ORGANIK) */}
        <g transform="translate(55, 305)" filter="url(#softShadow)">
          {/* Bin Wheels */}
          <circle cx="8" cy="88" r="7" fill="#374151" />
          <circle cx="8" cy="88" r="3" fill="#9ca3af" />
          <circle cx="48" cy="88" r="7" fill="#374151" />
          <circle cx="48" cy="88" r="3" fill="#9ca3af" />

          {/* Bin Body */}
          <polygon points="4,20 52,20 46,85 10,85" fill="url(#greenBin)" />
          {/* Lid */}
          <rect x="0" y="10" width="56" height="12" rx="3" fill="#2eb86c" />
          <rect x="18" y="5" width="20" height="6" rx="2" fill="#239656" />

          {/* Icon Badge: Leaf */}
          <circle cx="28" cy="45" r="12" fill="#ffffff" opacity="0.95" />
          <path
            d="M28 39 C24 39 21 43 23 48 C28 48 31 45 31 39 Z"
            fill="#1b8744"
          />
          <path
            d="M28 39 C29 44 26 48 23 48"
            stroke="#ffffff"
            strokeWidth="0.8"
          />

          {/* Text Label "ORGANIK" */}
          <text
            x="28"
            y="72"
            fill="#ffffff"
            fontSize="6.5"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.4"
          >
            ORGANIK
          </text>
        </g>

        {/* 2. YELLOW / ORANGE BIN (ANORGANIK) */}
        <g transform="translate(125, 305)" filter="url(#softShadow)">
          {/* Bin Wheels */}
          <circle cx="8" cy="88" r="7" fill="#374151" />
          <circle cx="8" cy="88" r="3" fill="#9ca3af" />
          <circle cx="48" cy="88" r="7" fill="#374151" />
          <circle cx="48" cy="88" r="3" fill="#9ca3af" />

          {/* Bin Body */}
          <polygon points="4,20 52,20 46,85 10,85" fill="url(#yellowBin)" />
          {/* Lid */}
          <rect x="0" y="10" width="56" height="12" rx="3" fill="#fbbf24" />
          <rect x="18" y="5" width="20" height="6" rx="2" fill="#d97706" />

          {/* Icon Badge: Bottle */}
          <circle cx="28" cy="45" r="12" fill="#ffffff" opacity="0.95" />
          {/* Bottle Icon */}
          <rect x="25" y="38" width="6" height="3" rx="1" fill="#d97706" />
          <path
            d="M24 41 L32 41 L33 44 L33 51 C33 52 32 53 31 53 L25 53 C24 53 23 52 23 51 L23 44 Z"
            fill="#d97706"
          />

          {/* Text Label "ANORGANIK" */}
          <text
            x="28"
            y="72"
            fill="#ffffff"
            fontSize="5.8"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.2"
          >
            ANORGANIK
          </text>
        </g>

        {/* 3. BLUE BIN (KERTAS) */}
        <g transform="translate(195, 305)" filter="url(#softShadow)">
          {/* Bin Wheels */}
          <circle cx="8" cy="88" r="7" fill="#374151" />
          <circle cx="8" cy="88" r="3" fill="#9ca3af" />
          <circle cx="48" cy="88" r="7" fill="#374151" />
          <circle cx="48" cy="88" r="3" fill="#9ca3af" />

          {/* Bin Body */}
          <polygon points="4,20 52,20 46,85 10,85" fill="url(#blueBin)" />
          {/* Lid */}
          <rect x="0" y="10" width="56" height="12" rx="3" fill="#60a5fa" />
          <rect x="18" y="5" width="20" height="6" rx="2" fill="#2563eb" />

          {/* Icon Badge: Paper / Document */}
          <circle cx="28" cy="45" r="12" fill="#ffffff" opacity="0.95" />
          {/* Document Icon */}
          <path
            d="M23 39 L30 39 L33 42 L33 51 C33 52 32 53 31 53 L25 53 C24 53 23 52 23 51 Z"
            fill="#1d629b"
          />
          <polygon points="30,39 30,42 33,42" fill="#ffffff" />
          <line x1="25" y1="45" x2="31" y2="45" stroke="#ffffff" strokeWidth="1" />
          <line x1="25" y1="48" x2="29" y2="48" stroke="#ffffff" strokeWidth="1" />

          {/* Text Label "KERTAS" */}
          <text
            x="28"
            y="72"
            fill="#ffffff"
            fontSize="6.5"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.4"
          >
            KERTAS
          </text>
        </g>
      </svg>
    </div>
  );
}
