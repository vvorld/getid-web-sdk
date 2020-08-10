import React from 'react';

const createOverlay = (figure, containerRation) => ({ width, height, style }) => {
  const Path = (function () {
    if (figure === 'none') {
      return () => null;
    }
    const streamRatio = width / height;
    const [fwidth, fheight] = streamRatio < containerRation
      ? [width * 0.9, width * 0.9 / containerRation]
      : [(height * 0.9) * containerRation, height * 0.9];
    switch (figure) {
      case 'ellips':
        return () => (
          <path
            fillRule="evenodd"
            d={`M0,0  h${width}  v${height} h-${width} z
                M ${width / 2} ${(height - fheight) / 2}
                A 90 100,
                0,
                0
                0,
                ${width / 2} ${height - (height - fheight) / 2}
                A 90 100,
                0,
                0
                0,
                ${width / 2} ${(height - fheight) / 2}
                z`}
          />
        );
      default:
        return () => (
          <path
            fillRule="evenodd"
            d={`M0,0  h${width}  v${height} h-${width} z
                M${(width - fwidth) / 2},${(height - fheight) / 2} v${fheight} h${fwidth} v-${fheight} z`}
          />
        );
    }
  }());

  return (
    <svg
      style={({
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        ...style || {},
      })}
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
    >
      <g fillRule="evenodd" fill="#FFF8" stroke="black" strokeWidth="3">
        <Path />
      </g>
    </svg>
  );
};

export default createOverlay;
