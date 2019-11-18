import React from 'react';

export const Gap = ({ width = 10, color = '#eee' }) => {
  return (
    <div style={{ width: '100%', height: width, backgroundColor: color }} />
  );
};
export const GapVertical = ({ width = 1, color = '#eee' }) => {
  return (
    <div style={{ width: width, height: '100%', backgroundColor: color }} />
  );
};

export default Gap;
