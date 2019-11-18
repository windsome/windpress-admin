import React from 'react';
import { Link } from 'react-router-dom';
import './Bar.css';

export const FixedBottomButton = ({ title = '确定', onClick = null }) => {
  return (
    <nav className="navbar navbar-default fixed-bottom">
      <div
        className="container fixed-bottom-bar justify-content-center"
        onClick={onClick}
      >
        <span>{title}</span>
      </div>
    </nav>
  );
};

export const BigButton = ({ title = '确定', onClick = null }) => {
  return (
    <nav className="navbar navbar-default">
      <div
        className="container fixed-bottom-bar justify-content-center"
        onClick={onClick}
      >
        <span>{title}</span>
      </div>
    </nav>
  );
};
