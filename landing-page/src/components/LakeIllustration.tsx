/**
 * A calm Finnish lake at golden hour: hazy hills, a forest line, a low sun mirrored in the water,
 * islands, a small red cottage with a jetty and rowing boat, pines and a birch on the near shore.
 * Muted colours so text and phones stay the focus. Drawn once, no images needed.
 */

// A row of small pines with slightly varied heights (deterministic, so the drawing never changes).
function pineRow(x0: number, x1: number, base: number, minH: number, maxH: number, step: number) {
  let d = '';
  for (let x = x0, i = 0; x <= x1; x += step, i++) {
    const h = minH + (((i * 37) % 17) / 16) * (maxH - minH);
    const w = h * 0.26;
    d += `M${x - w} ${base} L${x + w} ${base} L${x} ${base - h} Z `;
  }
  return d;
}

// A tall pine drawn as four stacked tiers, with a short trunk.
function tallPine(x: number, base: number, h: number) {
  let d = `M${x - h * 0.02} ${base} V${base - h * 0.2} H${x + h * 0.02} V${base} Z `;
  for (let t = 0; t < 4; t++) {
    const tierBase = base - h * 0.14 - t * h * 0.2;
    const half = h * 0.17 * (1 - t * 0.2);
    d += `M${x - half} ${tierBase} L${x + half} ${tierBase} L${x} ${tierBase - h * 0.34} Z `;
  }
  return d;
}

export function LakeIllustration({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" aria-hidden focusable="false">
      <defs>
        <linearGradient id="lake-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B4C9DE" />
          <stop offset="0.3" stopColor="#D3DDE5" />
          <stop offset="0.47" stopColor="#EDE1CF" />
          <stop offset="0.59" stopColor="#F6D5AA" />
        </linearGradient>
        <linearGradient id="lake-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EED5B6" />
          <stop offset="0.12" stopColor="#D6D4C8" />
          <stop offset="0.38" stopColor="#BACBD2" />
          <stop offset="0.72" stopColor="#A0B9C7" />
          <stop offset="1" stopColor="#8CA8BB" />
        </linearGradient>
        <radialGradient id="lake-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF6E2" stopOpacity="1" />
          <stop offset="0.3" stopColor="#FFEBC8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFEBC8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* sky and low sun */}
      <rect width="1440" height="800" fill="url(#lake-sky)" />
      <circle cx="1040" cy="452" r="420" fill="url(#lake-sun)" />
      <circle cx="1040" cy="456" r="40" fill="#FFF0CF" />
      <circle cx="1040" cy="456" r="31" fill="#FFF8EA" />

      {/* long, thin evening clouds */}
      <g fill="#FFF3E2" opacity="0.6">
        <ellipse cx="250" cy="168" rx="210" ry="9" />
        <ellipse cx="330" cy="186" rx="120" ry="6" />
        <ellipse cx="880" cy="126" rx="250" ry="10" />
        <ellipse cx="960" cy="145" rx="150" ry="6" />
        <ellipse cx="1250" cy="232" rx="170" ry="8" />
        <ellipse cx="1185" cy="249" rx="90" ry="5" />
      </g>

      {/* birds */}
      <g fill="none" stroke="#56606E" strokeWidth="2.2" strokeLinecap="round" opacity="0.7">
        <path d="M792 262 q8 -7 16 0 q8 -7 16 0" />
        <path d="M836 238 q6 -5 12 0 q6 -5 12 0" />
      </g>

      {/* hazy far hills, then the forest line */}
      <path d="M0 418 C140 392 260 386 380 402 S620 380 760 398 S1000 384 1140 400 S1340 386 1440 396 L1440 470 L0 470 Z" fill="#B8C8CB" opacity="0.8" />
      <path d="M0 440 C180 420 320 430 460 434 S760 414 920 432 S1200 420 1330 436 S1420 430 1440 432 L1440 471 L0 471 Z" fill="#9BB1B1" />
      <path d={pineRow(4, 1440, 471, 16, 34, 19)} fill="#83A09A" />

      {/* water */}
      <rect y="468" width="1440" height="332" fill="url(#lake-water)" />
      <rect y="468" width="1440" height="2" fill="#FFFFFF" opacity="0.55" />
      <path d="M0 471 H1440 V486 C1250 490 1060 482 880 488 S480 482 260 489 S60 484 0 488 Z" fill="#A6BBB8" opacity="0.5" />

      {/* the sun's path on the water */}
      <g fill="#FFF3D9">
        <rect x="965" y="482" width="150" height="3" rx="1.5" opacity="0.9" />
        <rect x="980" y="497" width="120" height="3" rx="1.5" opacity="0.8" />
        <rect x="992" y="514" width="96" height="3" rx="1.5" opacity="0.7" />
        <rect x="1003" y="534" width="74" height="3" rx="1.5" opacity="0.6" />
        <rect x="1012" y="558" width="56" height="2.5" rx="1.25" opacity="0.5" />
        <rect x="1019" y="586" width="42" height="2.5" rx="1.25" opacity="0.45" />
        <rect x="1025" y="620" width="30" height="2" rx="1" opacity="0.4" />
        <rect x="1030" y="660" width="20" height="2" rx="1" opacity="0.35" />
      </g>

      {/* soft ripples */}
      <g stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round">
        <path d="M140 560 h80 M320 622 h60 M520 584 h90 M700 664 h70 M1120 604 h80 M960 708 h60 M1330 566 h50" />
      </g>

      {/* island in the middle of the lake, with its reflection */}
      <path d="M600 486 C660 500 760 504 868 486 Z" fill="#6E8E86" opacity="0.4" />
      <path d="M596 484 C650 468 730 462 800 468 C836 471 860 477 872 484 Z" fill="#5F8073" />
      <path d={pineRow(616, 850, 478, 28, 56, 24)} fill="#4F7064" />

      {/* right island: red cottage, jetty and rowing boat */}
      <path d="M1236 494 C1290 476 1370 472 1440 478 L1440 496 Z" fill="#5F8073" />
      <path d={pineRow(1352, 1440, 482, 40, 72, 17)} fill="#4F7064" />
      <rect x="1288" y="496" width="40" height="10" fill="#A64B3C" opacity="0.22" />
      <g>
        <rect x="1316" y="456" width="4" height="10" fill="#3F3A3A" />
        <path d="M1283 471 L1308 455 L1333 471 Z" fill="#3F3A3A" />
        <rect x="1288" y="470" width="40" height="17" fill="#A64B3C" />
        <rect x="1288" y="470" width="2.5" height="17" fill="#F4EEE6" />
        <rect x="1325.5" y="470" width="2.5" height="17" fill="#F4EEE6" />
        <rect x="1295" y="476" width="7" height="11" fill="#F4EEE6" />
        <rect x="1296.4" y="477.4" width="4.2" height="9.6" fill="#7A3A2F" />
        <rect x="1309" y="474" width="10" height="7.5" fill="#FBE3AE" stroke="#F4EEE6" strokeWidth="1.5" />
      </g>
      <rect x="1200" y="492" width="96" height="3.5" fill="#7A6252" />
      <g fill="#6A5244">
        <rect x="1206" y="495" width="2" height="8" />
        <rect x="1230" y="495" width="2" height="8" />
        <rect x="1254" y="495" width="2" height="8" />
      </g>
      <path d="M1160 505 L1218 505 L1209 515 L1170 515 Z" fill="#7D4B3D" />
      <path d="M1170 517 L1209 517 L1205 521 L1174 521 Z" fill="#7D4B3D" opacity="0.25" />

      {/* near shore on the right: tall pines and a birch */}
      <path d="M1440 800 V600 C1390 606 1340 628 1300 660 C1262 692 1232 744 1206 800 Z" fill="#3F5E4E" />
      <path d={tallPine(1300, 690, 190) + tallPine(1352, 660, 230) + tallPine(1404, 640, 250) + tallPine(1446, 630, 210)} fill="#2E4A3C" />
      <path d="M1262 736 C1259 690 1264 640 1258 584" fill="none" stroke="#EDEBE4" strokeWidth="6" strokeLinecap="round" />
      <g stroke="#2B2B2B" strokeWidth="2.4" strokeLinecap="round">
        <path d="M1258 712 h5 M1261 686 h5 M1258 660 h4 M1262 634 h5 M1259 608 h4" />
      </g>
      <g fill="#93AE6B" opacity="0.92">
        <ellipse cx="1258" cy="586" rx="26" ry="20" />
        <ellipse cx="1242" cy="606" rx="20" ry="15" />
        <ellipse cx="1276" cy="604" rx="20" ry="16" />
        <ellipse cx="1262" cy="566" rx="16" ry="13" />
      </g>

      {/* low, soft shore on the left (mostly under the light wash) */}
      <path d="M0 800 V660 C90 664 180 690 250 730 C280 750 300 776 312 800 Z" fill="#4E6C5C" opacity="0.55" />
    </svg>
  );
}
