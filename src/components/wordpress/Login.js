import React from 'react';
import reduxForm from 'redux-form/es/reduxForm';
import Field from 'redux-form/es/Field';

import './Login.css';

const LoginForm = ({ handleSubmit, pristine, reset, submitting }) => {
  return (
    <form className="form-signin" onSubmit={handleSubmit}>
      <h2 className="form-signin-heading">请登录</h2>
      <label htmlFor="username" className="sr-only">
        用户名
      </label>
      <Field
        component="input"
        type="text"
        name="username"
        className="form-control"
        placeholder="用户名"
      />
      <label htmlFor="password" className="sr-only">
        密码
      </label>
      <Field
        component="input"
        type="password"
        name="password"
        className="form-control"
        placeholder="密码"
      />
      <div className="checkbox">
        <label>
          <Field
            component="input"
            type="checkbox"
            name="remember"
            value="remember-me"
          />{' '}
          记住我
        </label>
      </div>
      <button
        className="btn btn-lg btn-primary btn-block"
        type="submit"
        disabled={submitting}
      >
        登录
      </button>
    </form>
  );
};

export default reduxForm({
  form: 'login' // a unique name for this form
})(LoginForm);
