1. 五星评价SVG描述
```
<svg style="width: 200px; height: 40px;" viewBox="0 0 100 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g>
    <use xlink:href="#icon-star-full" x="0" y="0" />
    <use xlink:href="#icon-star-full" x="20" y="0" />
    <use xlink:href="#icon-star-full" x="40" y="0" />
    <use xlink:href="#icon-star-full" x="60" y="0" />
    <use xlink:href="#icon-star-full" x="80" y="0" />
  </g>
  <g style="clip-path: url(#clipPath); ">
    <use xlink:href="#icon-star-half" x="0" y="0" />
    <use xlink:href="#icon-star-half" x="20" y="0" />
    <use xlink:href="#icon-star-half" x="40" y="0" />
    <use xlink:href="#icon-star-half" x="60" y="0" />
    <use xlink:href="#icon-star-half" x="80" y="0" />
  </g>
  <defs>
    <clipPath id="clipPath">
        <rect x="0" y="0" width="40" height="20" />
    </clipPath>
  <symbol id="icon-star-full">
    <path fill="#f63" d="M9.5 14.191l-4.403 2.434 0.841-5.156-3.563-3.651 4.923-0.752 2.202-4.691z"></path>
    <path fill="#f63" d="M9.5 14.191l4.403 2.434-0.841-5.156 3.563-3.651-4.923-0.752-2.202-4.691z"></path>
  </symbol>
  <symbol id="icon-star-half">
    <path fill="#12A99C" d="M9.5 14.191l-4.403 2.434 0.841-5.156-3.563-3.651 4.923-0.752 2.202-4.691z"></path>
    <path fill="#12A99C" d="M9.5 14.191l4.403 2.434-0.841-5.156 3.563-3.651-4.923-0.752-2.202-4.691z"></path>
  </symbol>
  </defs>
</svg>
```

2. 写法2
```
<svg style="width: 200px; height: 40px;" viewBox="0 0 255 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g>
    <use xlink:href="#icon-star-back" x="0" y="0" />
    <use xlink:href="#icon-star-back" x="51" y="0" />
    <use xlink:href="#icon-star-back" x="102" y="0" />
    <use xlink:href="#icon-star-back" x="153" y="0" />
    <use xlink:href="#icon-star-back" x="204" y="0" />
  </g>
  <g style="clip-path: url(#clipPath); ">
    <use xlink:href="#icon-star-front" x="0" y="0" />
    <use xlink:href="#icon-star-front" x="51" y="0" />
    <use xlink:href="#icon-star-front" x="102" y="0" />
    <use xlink:href="#icon-star-front" x="153" y="0" />
    <use xlink:href="#icon-star-front" x="204" y="0" />
  </g>
  <defs>
    <clipPath id="clipPath">
        <rect x="0" y="0" width="70" height="48" />
    </clipPath>
  <symbol id="icon-star-back">
	<path fill="#999" stroke="#000" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
  </symbol>
  <symbol id="icon-star-front">
	<path fill="#f63" stroke="#000" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
  </symbol>
  </defs>
</svg>
```
