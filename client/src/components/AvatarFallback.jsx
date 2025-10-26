import React from 'react';

// Utility functions for gradient generation
function hash(name) {
  let hash = 0;
  for (var i = 0; i < name.length; i++) {
    var character = name.charCodeAt(i);
    hash = (hash << 5) - hash + character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function getDigit(number, ntn) {
  return Math.floor((number / Math.pow(10, ntn)) % 10);
}

function getUnit(number, range, index) {
  let value = number % range;
  if (index && getDigit(number, index) % 2 === 0) {
    return -value;
  } else return value;
}

function getRandomColor(number, colors, range) {
  return colors[number % range];
}

// Generate seeds once per page load and store them
let pageLoadSeed = null;
let timeSeed = null;

function generateColors(name, colors, size = DEFAULT_SIZE) {
  let numFromName;
  
  if (name === "Assistant") {
    // Assistant always uses the same gradient (no random seed)
    numFromName = hash("Assistant");
  } else {
    // User gets a new gradient on each page load - generate seeds only once
    if (pageLoadSeed === null) {
      pageLoadSeed = Math.floor(Math.random() * 1000000);
      timeSeed = Date.now() % 1000000;
    }
    numFromName = hash("User" + pageLoadSeed + timeSeed);
  }
  
  const range = colors && colors.length;

  // Original logic scaled down proportionally for 32px
  const elementsProperties = Array.from({ length: 3 }, (_, i) => {
    let selectedColor = getRandomColor(numFromName + i, colors, range);
    
    // For user avatars, ensure the base color (first element) is different from Assistant's base color
    if (name !== "Assistant" && i === 0) {
      const assistantBaseColor = getRandomColor(hash("Assistant"), colors, range);
      // If user's base color matches assistant's base color, shift to next color
      if (selectedColor === assistantBaseColor) {
        selectedColor = getRandomColor(numFromName + i + 1, colors, range);
      }
    }
    
    return {
      color: selectedColor,
      // Original translation range scaled down for 32px (was 40/10 = 4, now 32/10 = 3.2)
      translateX: getUnit(numFromName * (i + 1), size / 10, 1),
      translateY: getUnit(numFromName * (i + 1), size / 10, 2),
      // Original scale range scaled down for 32px
      scale: 1.2 + getUnit(numFromName * (i + 1), size / 20) / 10,
      rotate: getUnit(numFromName * (i + 1), 360, 1),
    };
  });

  return elementsProperties;
}

const DEFAULT_SIZE = 40;
const colors = ["#F6C750", "#E63525", "#050D4C", "#D4EBEE"];

export function AvatarFallback({ 
  children, 
  size = DEFAULT_SIZE, 
  className = "" 
}) {
  const titleId = React.useId();
  const properties = generateColors(children, colors, size);
  const maskId = React.useId();
  const filterId = React.useId();

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      role="img"
      aria-describedby={titleId}
      width={size}
      height={size}
      className={className}
    >
      <mask
        id={maskId}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={size}
        height={size}
      >
        <rect width={size} height={size} rx={size * 2} fill="#FFFFFF" />
      </mask>
      <g mask={`url(#${maskId})`}>
        <rect width={size} height={size} fill={properties[0].color} />
        <path
          filter={`url(#${filterId})`}
          d="M32.414 59.35L50.376 70.5H72.5v-71H33.728L26.5 13.381l19.057 27.08L32.414 59.35z"
          fill={properties[1].color}
          transform={`
            translate(${properties[1].translateX} ${properties[1].translateY})
            rotate(${properties[1].rotate} ${size / 2} ${size / 2})
            scale(${properties[1].scale * (size / DEFAULT_SIZE)})
          `}
        />
        <path
          filter={`url(#${filterId})`}
          style={{
            mixBlendMode: "overlay",
          }}
          d="M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z"
          fill={properties[2].color}
          transform={`
            translate(${properties[2].translateX} ${properties[2].translateY})
            rotate(${properties[2].rotate} ${size / 2} ${size / 2})
            scale(${properties[2].scale * (size / DEFAULT_SIZE)})
          `}
        />
      </g>
      <defs>
        <filter
          id={filterId}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation={7} result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  );
}

export default AvatarFallback;
