import React from 'react';

const createOverlay = (figure, status = 'active', styles) => ({
  width, height, top, left, bottom, right, style,
}) => {
  if (!width || !height) {
    return null;
  }
  const createPath = () => {
    if (figure === 'none') {
      return () => null;
    }
    const stroke = (styles && styles['accent-color'] && status === 'active') ? 'var(--main-accent-color)' : `var(--main-${status}-border)`;
    console.log(styles && styles['accent-color'] && status === 'active', stroke);

    const fwidth = right - left;
    const fheight = bottom - top;

    switch (figure) {
      case 'ellips': {
        return () => (
          <>
            <g fillRule="evenodd" fill="var(--main-txt-color)" opacity="0.5" stroke="black" strokeWidth="3">

              <path
                d={`M0,0  h${width}  v${height} h-${width} z
                M ${width / 2}, ${top} a ${fwidth / 2},${fheight / 2} 0 1,0 1,0 z`}
              />
            </g>
            <path
              fill="none"
              stroke={stroke}
              strokeWidth={`${Math.round(width * 0.01)}px`}
              strokeLinecap="round"
              d={`M ${width / 2}, ${top} a ${fwidth / 2},${fheight / 2} 0 1,0 1,0 z
              
            `}

            />
          </>
        );
      }
      default: {
        const r = Math.round(width * 0.05);
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
              stroke={stroke}
              strokeWidth={`${`${Math.round(width * 0.01)}px`}`}
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
  };
  const Path = createPath();

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
