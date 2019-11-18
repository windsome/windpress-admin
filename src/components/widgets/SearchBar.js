import React from 'react';
import './SearchBar.css';

export default ({ value, placeholder, onChange, onSubmit }) => {
  return (
    <div className="media-body input-group">
      <div className="searchbar">
        <div className="search-btn" onClick={onSubmit}>
          <i className="fa fa-search" />
        </div>
        <input
          className="search-text"
          placeholder={placeholder}
          role="combobox"
          type="input"
          value={value || ''}
          onChange={onChange}
          onKeyPress={e => {
            if (e.key === 'Enter') onSubmit && onSubmit();
          }}
        />
      </div>
    </div>
  );
};
