import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import reduxForm from 'redux-form/es/reduxForm';
import Field from 'redux-form/es/Field';

import withTimely from 'components/hoc/withTimely';
// import LoginForm from 'components/wordpress/Login';

import { meSelect, loginSelect } from 'selectors/user';
import { loginNicename, getSmsCode, loginSms } from 'modules/user';
import './LoginPage.css';

const CountDownButton = ({ sendTime, onClick, xTimeCount }) => {
  let currMs = new Date().getTime();
  let sendMs = (sendTime && sendTime.getTime()) || 0;
  let diff = currMs - sendMs;
  diff = parseInt(diff / 1000);
  let remain = 60 - diff;
  if (remain > 0) {
    return (
      <button
        type="button"
        className="btn btn-secondary uppercase"
        disabled="disabled"
      >
        {'倒计时(' + remain + ')'}
      </button>
    );
  }

  return (
    <button
      type="button"
      className="btn btn-success uppercase"
      onClick={onClick}
    >
      获取验证码
    </button>
  );
};
const TimelyCountDownButton = withTimely(1)(CountDownButton);

class Page extends React.Component {
  constructor() {
    super();
    this.sendSms = this.sendSms.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLoginSms = this.handleLoginSms.bind(this);
  }
  state = {
    type: 'nicename', // 'phone'
    username: '',
    password: '',
    phone: '',
    smscode: '',
    smscodeTime: null,
    errMsg: ''
  };

  sendSms(evt) {
    evt.preventDefault();
    let { getSmsCode } = this.props;
    let { phone, smscodeTime } = this.state;
    let currMs = new Date().getTime();
    let lastMs = (smscodeTime && smscodeTime.getTime()) || 0;
    if (currMs - lastMs >= 60000) {
      console.log('has expire! can send smscode!');
    }

    getSmsCode({ phone })
      .then(ret => {
        console.log('after smscode:', ret);
        this.setState({ smscodeTime: new Date(), errMsg: null });
      })
      .catch(error => {
        this.setState({ smscodeTime: null, errMsg: error.message });
        console.log('sendsms fail:', error);
      });
  }
  handleLogin(evt) {
    evt.preventDefault();
    const { loginNicename } = this.props;
    let { username, password } = this.state;

    var userdata = { account: username, password };
    loginNicename(userdata)
      .then(ret => {
        this.setState({ errMsg: '登录成功！' });
      })
      .catch(error => {
        this.setState({ errMsg: error.message });
      });
  }
  handleLoginSms(evt) {
    evt.preventDefault();
    const { loginSms } = this.props;
    let { phone, smscode } = this.state;

    var userdata = { phone, smscode };
    loginSms(userdata)
      .then(ret => {
        this.setState({ errMsg: '登录成功！' });
      })
      .catch(error => {
        this.setState({ errMsg: error.message });
      });
  }
  renderUsernamePage() {
    const { login } = this.props;
    let errMsg = (login && login.error && login.error.message) || '';
    let { username, password } = this.state;
    return (
      <form className="form-signin">
        <h2 className="form-signin-heading">请登录</h2>
        <label htmlFor="username" className="sr-only">
          用户名
        </label>
        <input
          type="text"
          name="username"
          className="form-control"
          placeholder="用户名"
          value={username}
          onChange={evt => this.setState({ username: evt.target.value })}
        />
        <label htmlFor="password" className="sr-only">
          密码
        </label>
        <input
          type="password"
          name="password"
          className="form-control"
          placeholder="密码"
          value={password}
          onChange={evt => this.setState({ password: evt.target.value })}
        />
        <button
          className="btn btn-lg btn-primary btn-block"
          type="submit"
          onClick={this.handleLogin}
        >
          登录
        </button>
        <div className="login-options">
          <h4 onClick={evt => this.setState({ type: 'phone' })}>
            <span className="small">&gt;&gt;</span>使用手机号登录
          </h4>
        </div>
      </form>
    );
  }

  renderSmsPage() {
    const { login } = this.props;
    let { phone, smscode, smscodeTime, errMsg } = this.state;

    return (
      <div className="content">
        <form className="login-form">
          <h3 className="form-title">手机验证码登录</h3>
          <div className="alert alert-danger display-hide">
            <button className="close" data-close="alert" />
            <span> {errMsg} </span>
          </div>
          <div className="form-group">
            <input
              className="form-control form-control-solid placeholder-no-fix"
              type="text"
              autocomplete="off"
              placeholder="手机号码"
              name="phone"
              value={phone}
              onChange={evt => this.setState({ phone: evt.target.value })}
            />
          </div>
          <div className="form-group media align-items-center">
            <div className="pr-1 media-body">
              <input
                className="form-control form-control-solid placeholder-no-fix"
                type="text"
                autocomplete="off"
                placeholder="验证码"
                name="smscode"
                value={smscode}
                onChange={evt => this.setState({ smscode: evt.target.value })}
              />
            </div>
            <div>
              <TimelyCountDownButton
                sendTime={smscodeTime}
                onClick={this.sendSms}
              />
            </div>
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-success uppercase btn-block"
              onClick={this.handleLoginSms}
            >
              登录
            </button>
          </div>
          <div className="login-options">
            <h4 onClick={evt => this.setState({ type: 'nicename' })}>
              <span className="small">&gt;&gt;</span>使用用户名/密码登录
            </h4>
          </div>
        </form>
      </div>
    );
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { me } = this.props;

    console.log('from=', from, ', me=', me);
    if (me && me.id) {
      return <Redirect to={from} />;
    }

    let { type } = this.state;
    let uiContent =
      type == 'phone' ? this.renderSmsPage() : this.renderUsernamePage();
    return (
      <div className="login" style={{ left: 0, top: 0, bottom: 0, right: 0 }}>
        {uiContent}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    me: meSelect(state, props),
    login: loginSelect(state, props)
  };
};

export default connect(mapStateToProps, {
  loginNicename,
  getSmsCode,
  loginSms
})(Page);
