import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Base64 } from 'js-base64';

export const SvgWithSize = ({ width, height }) => {
  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 720 160"
      preserveAspectRatio="none"
    >
      <g>
        <rect width={720} height={160} fill="#777" />
        <g>
          <text
            x={20}
            y={44}
            style={{ fill: 'rgba(255,255,255,.75)', fontSize: 44 }}
          >
            {width + 'x' + height}
          </text>
          <text
            x={700}
            y={120}
            style={{
              fill: 'rgba(255,255,255,.75)',
              fontSize: 44,
              textAnchor: 'end'
            }}
          >
            {width + 'x' + height}
          </text>
        </g>
      </g>
    </svg>
  );
};

export const dataUrlSvgWithSize = (width, height, charset = 'base64') => {
  let svg = ReactDOMServer.renderToString(
    <SvgWithSize width={width} height={height} />
  );
  if (charset === 'utf8' || charset === 'utf-8' || charset === 'UTF-8') {
    return 'data:image/svg+xml;charset=UTF-8,' + svg;
  } else {
    let svgBase64 = Base64.encode(svg);
    return 'data:image/svg+xml;base64,' + svgBase64;
  }
};

export default SvgWithSize;
