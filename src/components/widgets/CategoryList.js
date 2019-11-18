import React from 'react';
import isArray from 'lodash/isArray';

export const CategoryList = ({
  data,
  changable = false,
  changeValue = null
}) => {
  let uis = (data &&
    isArray(data) &&
    data.map((item, index) => {
      let value = data.slice(0, index);
      //console.log('CategoryList:', value, index);
      if (!changable) {
        return (
          <li key={index} className="breadcrumb-item">
            {item}
          </li>
        );
      } else {
        return (
          <li key={index} className="breadcrumb-item">
            <button
              type="button"
              className="btn btn-link"
              onClick={() => changeValue(value)}
            >
              {item}
            </button>
          </li>
        );
      }
    })) || <li className="breadcrumb-item">{data}</li>;
  return (
    <nav>
      <ol className="breadcrumb">{uis}</ol>
    </nav>
  );
};

export default CategoryList;
