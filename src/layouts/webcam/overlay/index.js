import React from 'react';

const createOverlay = (figure) => ({
  width, height, top, left, bottom, right, style,
}) => {
  const Path = (function () {
    if (figure === 'none') {
      return () => null;
    }

    const fwidth = right - left;
    const fheight = bottom - top;

    switch (figure) {
      case 'ellips': {
        const r = fwidth / 2;
        return () => (
          <>
            <g fillRule="evenodd" fill="var(--main-txt-color)" opacity="0.5" stroke="black" strokeWidth="3">

              <path
                d={`M0,0  h${width}  v${height} h-${width} z
                M${left}, ${top + r}
                  v${fheight - (2 * r)}
                  C ${left} ${bottom - r} ${left} ${bottom} ${left + r} ${bottom}
                  h${fwidth - (2 * r)}
                  C ${right} ${bottom} ${right} ${bottom - r} ${right} ${bottom - r}
                  v-${fheight - (2 * r)}
                  C ${right} ${top + r} ${right} ${top} ${right - r} ${top}
                  h-${fwidth - (2 * r)}
                  C ${left} ${top} ${left} ${top + r} ${left} ${top + r}
                  z`}
              />
            </g>
            <path
              fill="none"
              stroke="var(--main-input-active-border)"
              strokeWidth="10px"
              strokeLinecap="round"
              d={`M${left}, ${top + r}
                  v${fheight - (2 * r)}
                  C ${left} ${bottom - r} ${left} ${bottom} ${left + r} ${bottom}
                  h${fwidth - (2 * r)}
                  C ${right} ${bottom} ${right} ${bottom - r} ${right} ${bottom - r}
                  v-${fheight - (2 * r)}
                  C ${right} ${top + r} ${right} ${top} ${right - r} ${top}
                  h-${fwidth - (2 * r)}
                  C ${left} ${top} ${left} ${top + r} ${left} ${top + r}
                  z`}

            />
          </>
        );
      }
      default: {
        const r = 70;
        return () => (
          <>
            <g fillRule="evenodd" fill="var(--main-txt-color)" opacity="0.5" stroke="black" strokeWidth="3">

              <path
                d={`M0,0  h${width}  v${height} h-${width} z
                M${left}, ${top + r}
                  v${fheight - (2 * r)}
                  C ${left} ${bottom} ${left} ${bottom} ${left + r} ${bottom}
                  h${fwidth - (2 * r)}
                  C ${right} ${bottom} ${right} ${bottom} ${right} ${bottom - r}
                  v-${fheight - (2 * r)}
                  C ${right} ${top} ${right} ${top} ${right - r} ${top}
                  h-${fwidth - (2 * r)}
                  C ${left} ${top} ${left} ${top} ${left} ${top + r}
                  z`}
              />
            </g>
            <path
              fill="none"
              stroke="var(--main-input-active-border)"
              strokeWidth="10px"
              strokeLinecap="round"
              d={`M${left}, ${top + r}
                  v${fheight - (2 * r)}
                  C ${left} ${bottom} ${left} ${bottom} ${left + r} ${bottom}
                  h${fwidth - (2 * r)}
                  C ${right} ${bottom} ${right} ${bottom} ${right} ${bottom - r}
                  v-${fheight - (2 * r)}
                  C ${right} ${top} ${right} ${top} ${right - r} ${top}
                  h-${fwidth - (2 * r)}
                  C ${left} ${top} ${left} ${top} ${left} ${top + r}
                  z`}

            />
          </>
        );
      }
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
      <Path />

    </svg>
  );
};

export default createOverlay;
