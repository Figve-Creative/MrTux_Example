import { useState } from "react";
import { Info } from "lucide-react";

// Line-art figure with the part being measured marked in red. Drawn as inline SVG
// so it needs no image files, scales cleanly and costs nothing to load.
// Decorative: the hint text under the field carries the same instruction for
// screen readers.

export type MeasureKind = "chest" | "waist" | "hips" | "inseam" | "outseam" | "neck" | "sleeve" | "shoulder";

export const MeasureDiagram = ({ kind, className = "h-36 w-24" }: { kind: string; className?: string }) => (
  <svg
    viewBox="0 0 100 160"
    aria-hidden="true"
    focusable="false"
    className={`shrink-0 ${className}`}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Body outline */}
    <g className="text-muted-foreground" stroke="currentColor" strokeWidth="1.6">
      <circle cx="50" cy="14" r="9" />
      <path d="M45 23 L45 31 M55 23 L55 31" />
      <path d="M30 36 Q50 28 70 36 L67 100 L33 100 Z" />
      <path d="M30 36 L20 92 L26 94 L33 52" />
      <path d="M70 36 L80 92 L74 94 L67 52" />
      <path d="M34 100 L36 152 L46 152 L50 104" />
      <path d="M66 100 L64 152 L54 152 L50 104" />
    </g>

    {/* The measurement */}
    <g className="text-red-600" stroke="currentColor" strokeWidth="2.6" strokeDasharray="4 3">
      {kind === "chest" && <path d="M28 52 L72 52" />}
      {kind === "waist" && <path d="M33 76 L67 76" />}
      {kind === "hips" && <path d="M32 94 L68 94" />}
      {kind === "inseam" && <path d="M51 106 L51 150" />}
      {kind === "outseam" && <path d="M33 78 L36 150" />}
      {kind === "neck" && <ellipse cx="50" cy="27" rx="9" ry="3.5" />}
      {kind === "sleeve" && <path d="M50 29 L30 37 L21 92" />}
      {kind === "shoulder" && <path d="M30 36 Q50 29 70 36" />}
    </g>
  </svg>
);

// Small (i) button next to a field label. The diagram pops up on hover or keyboard
// focus; tapping the button toggles it on touch screens.
const MeasureHelp = ({ kind, label }: { kind: string; label: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        aria-label={`How to measure: ${label}`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className="text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground"
      >
        <Info size={15} />
      </button>
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-0 top-full z-30 mt-2 w-32 border border-border bg-card p-2 shadow-md ${
          open ? "block" : "hidden"
        } group-hover:block group-focus-within:block`}
      >
        <MeasureDiagram kind={kind} className="mx-auto h-36 w-24" />
        <span className="mt-1 block text-center text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
      </span>
    </span>
  );
};

export default MeasureHelp;
