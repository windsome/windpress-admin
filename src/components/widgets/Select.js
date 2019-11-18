import React from 'react';

import './Select.css';

export const Select = ({
  all = [{ name: '无选项', value: '无选项' }],
  value = null,
  onChange = null
}) => {
  let uis =
    all &&
    all.map((item, index) => {
      return (
        <option key={index} value={item.value}>
          {item.name}
        </option>
      );
    });
  return (
    <div className="airbnb-dropdown">
      <div className="content">
        <select className="dropdown" value={value} onChange={onChange}>
          {uis}
        </select>
      </div>
      <span className="indicator">
        <svg
          viewBox="0 0 18 18"
          role="presentation"
          focusable="false"
          style={{
            height: 18,
            width: 18,
            display: 'block',
            fill: '#484848'
          }}
        >
          <path
            fillRule="evenodd"
            d="M16.291 4.295a1 1 0 1 1 1.414 1.415l-8 7.995a1 1 0 0 1-1.414 0l-8-7.995a1 1 0 1 1 1.414-1.415l7.293 7.29 7.293-7.29z"
          />
        </svg>
      </span>
    </div>
  );
};

export const SelectInline = ({
  all = [{ name: '无选项', value: '无选项' }],
  value = null,
  onChange = null
}) => {
  let uis =
    all &&
    all.map((item, index) => {
      return (
        <option key={index} value={item.value}>
          {item.name}
        </option>
      );
    });
  return (
    <div className="airbnb-dropdown-inline">
      <div className="content">
        <select className="dropdown" value={value} onChange={onChange}>
          {uis}
        </select>
      </div>
      <span className="indicator">
        <svg
          viewBox="0 0 18 18"
          role="presentation"
          focusable="false"
          style={{
            height: 18,
            width: 18,
            display: 'block',
            fill: '#484848'
          }}
        >
          <path
            fillRule="evenodd"
            d="M16.291 4.295a1 1 0 1 1 1.414 1.415l-8 7.995a1 1 0 0 1-1.414 0l-8-7.995a1 1 0 1 1 1.414-1.415l7.293 7.29 7.293-7.29z"
          />
        </svg>
      </span>
    </div>
  );
};

export default Select;
