type LogoProps = {
  variant?: "light" | "dark";
  className?: string;
  /** Alto en px del logo completo (el ancho se ajusta proporcionalmente). */
  height?: number;
  animate?: boolean;
};

/**
 * Logo MomEat: isotipo vectorizado a partir del arte real (no una
 * reconstrucción aproximada) + wordmark tipeado en Poppins para que
 * quede nítido a cualquier tamaño.
 *
 * variant="light": "Mom" en carbón, para fondos claros (crema/blanco).
 * variant="dark": "Mom" en crema, para fondos oscuros. El isotipo y "Eat"
 * usan terracota en ambas variantes — así es el logo real en las dos
 * versiones que se compartieron.
 */
export function Logo({
  variant = "light",
  className,
  height = 40,
  animate = false,
}: LogoProps) {
  const momColor = variant === "dark" ? "#FBF3E7" : "#2B2118";
  const eatColor = "#C7642B";
  const markColor = "#C7642B";

  return (
    <svg
      viewBox="0 0 1060 300"
      height={height}
      width={(height * 1060) / 300}
      className={className}
      role="img"
      aria-label="MomEat"
      xmlns="http://www.w3.org/2000/svg"
    >
      {animate && (
        <style>
          {`
            .momeat-logo-mark { animation: momeat-mark-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
            .momeat-logo-smile { animation: momeat-smile-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both; }
            .momeat-logo-word { animation: momeat-word-in 0.5s ease-out 0.5s both; }
            @keyframes momeat-mark-in {
              from { opacity: 0; transform: scale(0.85); }
              to { opacity: 1; transform: scale(1); }
            }
            @keyframes momeat-smile-in {
              from { opacity: 0; transform: scale(0.6); }
              to { opacity: 1; transform: scale(1); }
            }
            @keyframes momeat-word-in {
              from { opacity: 0; transform: translateX(-6px); }
              to { opacity: 1; transform: translateX(0); }
            }
          `}
        </style>
      )}

      {/* Isotipo — vectorizado desde el arte original, con margen uniforme
          (el trazo crudo tocaba los 3 bordes sin espacio) */}
      <g
        className={animate ? "momeat-logo-mark" : undefined}
        style={{ transformOrigin: "167px 150px" }}
      >
        <g transform="translate(40,40) scale(0.7358)">
          <g
            transform="translate(-20.791911,318.144577) scale(0.1,-0.1)"
            fill={markColor}
          >
            <path d="M715 3164 c-96 -23 -213 -86 -285 -152 -69 -63 -134 -145 -123 -156 3 -3 2 -6 -4 -6 -13 0 -66 -126 -82 -195 -8 -35 -12 -304 -13 -920 -1 -863 -1 -871 21 -950 76 -282 274 -488 550 -572 84 -26 2033 -32 2156 -8 322 66 565 340 605 685 8 64 10 360 8 910 l-3 815 -26 82 c-92 294 -345 483 -643 483 -214 -1 -388 -85 -557 -271 -152 -169 -256 -287 -344 -392 -49 -59 -92 -107 -95 -106 -3 0 -25 24 -50 53 -178 206 -462 516 -512 557 -164 136 -399 192 -603 143z m317 -362 c78 -38 162 -123 497 -498 257 -287 260 -290 311 -304 64 -17 116 2 171 63 26 29 124 140 220 247 445 501 474 525 644 525 151 0 255 -66 317 -201 l23 -49 3 -810 c2 -547 -1 -831 -8 -875 -33 -197 -188 -343 -395 -370 -142 -19 -1889 -8 -1946 12 -155 54 -257 151 -312 296 l-22 57 0 840 0 840 22 55 c75 185 290 263 475 172z" />
          </g>
          <g
            className={animate ? "momeat-logo-smile" : undefined}
            fill={markColor}
            style={{ transformOrigin: "167px 150px" }}
          >
            <g transform="translate(-20.791911,318.144577) scale(0.1,-0.1)">
              <path d="M1025 1811 c-78 -47 -112 -132 -81 -204 17 -41 274 -325 410 -455 234 -221 570 -267 875 -120 96 46 113 59 221 166 161 162 350 371 361 399 41 108 -30 221 -145 231 -71 6 -113 -15 -173 -86 -26 -32 -93 -106 -148 -166 -55 -61 -104 -119 -110 -129 -5 -11 -14 -20 -20 -20 -5 1 -24 -12 -42 -28 -155 -136 -395 -145 -558 -21 -27 20 -132 125 -232 232 -101 107 -193 200 -205 207 -35 19 -118 16 -153 -6z" />
            </g>
          </g>
        </g>
      </g>

      {/* Wordmark — texto real en Poppins, no trazado */}
      <text
        x={370}
        y={205}
        fontFamily="var(--font-heading), Poppins, sans-serif"
        fontWeight={700}
        fontSize={140}
        className={animate ? "momeat-logo-word" : undefined}
      >
        <tspan fill={momColor}>Mom</tspan>
        <tspan fill={eatColor}>Eat</tspan>
      </text>
    </svg>
  );
}
