import React from 'react';
import { Link } from 'react-router-dom';

export const ItemList = ({ onRefresh, onNext, children }) => {
  return (
    <div>
      <div
        className="media align-items-center align-content-center px-2"
        onClick={onRefresh}
      >
        刷新
      </div>
      {children}
      <div
        className="media align-items-center align-content-center px-2"
        onClick={onNext}
      >
        下一页
      </div>
    </div>
  );
};

export default ItemList;
