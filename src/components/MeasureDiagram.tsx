// Small line-art figure with the part being measured highlighted, shown next to
// each field in the size form. Drawn as inline SVG so it needs no image files,
// scales cleanly and picks up the site colors. Decorative: the hint text beside
// it carries the same instruction for screen readers.

export type MeasureKind = "chest" | "waist" | "hips" | "inseam" | "neck" | "sleeve" | "shoulder";

const MeasureDiagram = ({ kind }: { kind: string }) => (
  <svg
    viewBox="0 0 100 160"
    aria-hidden="true"
    focusable="false"
    className="h-24 w-16 shrink-0 border border-border bg-surface"
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
    <g className="text-highlight" stroke="currentColor" strokeWidth="2.4" strokeDasharray="4 3">
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

export default MeasureDiagram;
