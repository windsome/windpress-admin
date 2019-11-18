import React from 'react';
import './LoginForm.css';

export default () => {
  return (
    <form>
      <div className="form-group form-group-lg">
        <label for="email" className="control-label">
          Email
        </label>
        <input value="" id="email" className="form-control" type="email" />
      </div>
      <div className="form-group form-group-lg">
        <label htmlFor="password" className="control-label">
          Password
        </label>
        <input
          value=""
          id="password"
          className="form-control"
          type="password"
        />
      </div>
      <div className="form-group form-group-lg">
        <label for="confirmPassword" className="control-label">
          Confirm Password
        </label>
        <input
          value=""
          id="confirmPassword"
          className="form-control"
          type="password"
        />
      </div>
      <button
        disabled=""
        type="submit"
        className="LoaderButton  btn btn-lg btn-default btn-block"
      />
    </form>
  );
};
