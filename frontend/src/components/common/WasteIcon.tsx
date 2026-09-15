import React from 'react';

interface WasteIconProps {
  type: string;
  size?: number;
  className?: string;
}

export default function WasteIcon({ type, size = 16, className = '' }: WasteIconProps) {
  const lower = (type || '').toLowerCase();

  if (lower.includes('plastik')) {
    // Blue bottle icon
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2563EB"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <rect x="9" y="2" width="6" height="3" rx="1" />
        <path d="M10 5v2c-2 1-3 3-3 6v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6c0-3-1-5-3-6V5" />
        <line x1="9" y1="13" x2="15" y2="13" />
      </svg>
    );
  }

  if (lower.includes('kertas') || lower.includes('kardus') || lower.includes('box')) {
    // Amber/brown paper/box icon
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#D97706"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    );
  }

  if (lower.includes('logam') || lower.includes('besi') || lower.includes('aluminium') || lower.includes('kaleng')) {
    // Slate/metal cylinder icon
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#64748B"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
        <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
      </svg>
    );
  }

  if (lower.includes('kaca') || lower.includes('beling')) {
    // Green glass bottle/cup icon
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#059669"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M8 2h8v3l-2 3v12a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8L8 5V2z" />
        <line x1="8" y1="2" x2="16" y2="2" />
      </svg>
    );
  }

  // Default trash/recycling icon
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6B7280"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
