import React from 'react';
import './Line.css';

/**
 * https://blog.csdn.net/jian_xi/article/details/72572393
 */
export default ({ className, ...props }) => (
  <div className={className + ' divide-line'} {...props} />
);
