import React from "react";

// This SVG is the base wheel graphic from Figma, with the embedded text paths removed.
// We will overlay dynamic text on top of this.
const SpinWheelBackgroundSVG = ({ rotation }) => (
  <svg
    width="593"
    height="613"
    viewBox="0 0 593 613"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute inset-0 w-full h-full transition-transform duration-5000 ease-out z-10"
    style={{ transform: `rotate(${rotation}deg)` }}
  >
    <circle cx="296.529" cy="296.529" r="234.529" fill="#CE3816" />
    <g clipPath="url(#clip0_17929_6521)">
      <path
        d="M409.727 113.637C441.831 133.509 468.139 161.481 486.006 194.742C503.874 228.004 512.671 265.382 511.514 303.121L296.522 296.529L409.727 113.637Z"
        fill="#1F77B4"
      />
      <path
        d="M511.514 303.121C510.357 340.860 499.287 377.630 479.415 409.734C459.543 441.838 431.571 468.146 398.310 486.013L296.523 296.529L511.514 303.121Z"
        fill="#AEC7E8"
      />
      <path
        d="M398.311 486.014C365.049 503.881 327.670 512.678 289.931 511.521C252.193 510.364 215.423 499.293 183.319 479.422L296.523 296.529L398.311 486.014Z"
        fill="#FF7F0E"
      />
      <path
        d="M183.325 479.424C151.221 459.552 124.913 431.580 107.046 398.319C89.1784 365.057 80.3812 327.679 81.5383 289.940L296.530 296.532L183.325 479.424Z"
        fill="#FFBB78"
      />
      <path
        d="M81.5326 289.937C82.6898 252.198 93.7605 215.429 113.632 183.325C133.504 151.220 161.476 124.912 194.737 107.045L296.524 296.529L81.5326 289.937Z"
        fill="#2CA02C"
      />
      <path
        d="M194.741 107.047C228.003 89.1801 265.382 80.3828 303.120 81.540C340.859 82.6971 377.629 93.7678 409.733 113.639L296.528 296.532L194.741 107.047Z"
        fill="#98DF8A"
      />
      {/* The paths that previously contained the fixed text have been removed from here */}
    </g>
    <circle cx="296.526" cy="73.6614" r="6.4787" fill="white" />
    <circle cx="405.369" cy="102.168" r="6.4787" fill="white" />
    <circle cx="488.291" cy="186.391" r="6.4787" fill="white" />
    <circle cx="518.096" cy="303.007" r="6.4787" fill="white" />
    <circle cx="483.112" cy="415.737" r="6.4787" fill="white" />
    <circle cx="405.369" cy="490.890" r="6.4787" fill="white" />
    <circle cx="185.088" cy="490.890" r="6.4787" fill="white" />
    <circle cx="106.049" cy="415.737" r="6.4787" fill="white" />
    <circle cx="72.3615" cy="303.007" r="6.4787" fill="white" />
    <circle cx="100.869" cy="186.391" r="6.4787" fill="white" />
    <circle cx="185.088" cy="102.168" r="6.4787" fill="white" />
    <g filter="url(#filter0_d_17929_6521)">
      <path
        d="M289.575 496.073C292.568 490.890 300.049 490.890 303.041 496.073L340.072 560.212C343.064 565.395 339.324 571.873 333.339 571.873H259.278C253.293 571.873 249.552 565.395 252.545 560.212L289.575 496.073Z"
        fill="#2F911E"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_17929_6521"
        x="224.992"
        y="479.685"
        width="142.633"
        height="132.688"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="14" />
        <feGaussianBlur stdDeviation="13.25" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.184314 0 0 0 0 0.568627 0 0 0 0 0.117647 0 0 0 0.5 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_17929_6521"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_17929_6521"
          result="shape"
        />
      </filter>
      <clipPath id="clip0_17929_6521">
        <rect
          width="430.185"
          height="430.185"
          fill="white"
          transform="translate(226.836 0.431824) rotate(31.7562)"
        />
      </clipPath>
    </defs>
  </svg>
);
