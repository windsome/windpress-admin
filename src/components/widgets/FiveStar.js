import React from 'react';
import { Link } from 'react-router-dom';

export const FiveStar = ({ value }) => {
  let width = value + '%';
  let sprite = {
    unicodeBidi: 'bidi-override',
    position: 'relative',
    display: 'inline-block',
    margin: '0 auto',
    padding: 0
  };

  let top = {
    position: 'absolute',
    display: 'inline-block',
    top: 0,
    left: 0,
    color: '#f00',
    padding: 0,
    //zIndex: 1,
    width: width,
    overflow: 'hidden'
  };

  let bottom = {
    display: 'inline-block',
    padding: 0,
    zIndex: 0,
    color: '#777'
  };

  return (
    <div style={sprite}>
      <div style={top}>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
      </div>
      <div style={bottom}>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
      </div>
    </div>
  );
};

export const FiveStarSvg = ({ height = 12, value }) => {
  let clipWidth = (value && parseInt(255 * value / 100)) || 0;
  let width = (height && parseInt(height * 255 / 48)) || 0;
  return (
    <svg
      style={{ width, height }}
      viewBox="0 0 255 48"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g>
        <use xlinkHref="#icon-star-back" x="0" y="0" />
        <use xlinkHref="#icon-star-back" x="51" y="0" />
        <use xlinkHref="#icon-star-back" x="102" y="0" />
        <use xlinkHref="#icon-star-back" x="153" y="0" />
        <use xlinkHref="#icon-star-back" x="204" y="0" />
      </g>
      <g style={{ clipPath: 'url(#clipPath)' }}>
        <use xlinkHref="#icon-star-front" x="0" y="0" />
        <use xlinkHref="#icon-star-front" x="51" y="0" />
        <use xlinkHref="#icon-star-front" x="102" y="0" />
        <use xlinkHref="#icon-star-front" x="153" y="0" />
        <use xlinkHref="#icon-star-front" x="204" y="0" />
      </g>
      <defs>
        <clipPath id="clipPath">
          <rect x="0" y="0" width={clipWidth} height="48" />
        </clipPath>
        <symbol id="icon-star-back">
          <path
            fill="#777"
            stroke="#777"
            d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"
          />
        </symbol>
        <symbol id="icon-star-front">
          <path
            fill="#f00"
            stroke="#f00"
            d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"
          />
        </symbol>
      </defs>
    </svg>
  );
};

export default FiveStar;
