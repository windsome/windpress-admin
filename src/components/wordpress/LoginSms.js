import React from 'react';
import reduxForm from 'redux-form/es/reduxForm';
import Field from 'redux-form/es/Field';

import './Login.css';

const LoginForm = ({ handleSubmit, pristine, reset, submitting }) => {
  return (
    <form className="form-signin" onSubmit={handleSubmit}>
      <h2 className="form-signin-heading">短信验证码登录</h2>
      <label htmlFor="phone" className="sr-only">
        手机号码
      </label>
      <Field
        component="input"
        type="text"
        name="phone"
        className="form-control"
        placeholder="手机号码"
      />
      <label htmlFor="code" className="sr-only">
        验证码
      </label>
      <Field
        component="input"
        type="text"
        name="code"
        className="form-control"
        placeholder="验证码"
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
  form: 'loginsms' // a unique name for this form
})(LoginForm);
