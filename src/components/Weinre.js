import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import cookie from 'react-cookie';

export default class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ip: '192.168.100.101',
      settled: false
    };
  }

  componentDidMount() {}

  injectScript() {
    var ip = this.state.ip || '192.168.100.101';
    const script = document.createElement('script');
    script.src = 'http://' + ip + ':9090/target/target-script-min.js#anonymous';
    script.async = true;
    document.body.appendChild(script);
    this.setState({ settled: true });
  }

  injectScriptIp(ip) {
    const script = document.createElement('script');
    script.src = 'http://' + ip + ':9090/target/target-script-min.js#anonymous';
    script.async = true;
    document.body.appendChild(script);
    this.setState({ settled: true });
  }

  removeCookies() {
    cookie.remove('user', { path: '/' });
    cookie.remove('wxuser', { path: '/' });
  }

  render() {
    var disabled = {};
    if (this.state.settled) disabled = { disabled: 'disabled' };
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-12" style={{ marginTop: 10 }}>
              <div className="input-group">
                <span className="input-group-addon">IP</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="请输入IP。如：192.168.2.109"
                  aria-label="IP"
                  id="ip"
                  onChange={e => {
                    this.setState({ ip: e.target.value });
                  }}
                  value={this.state.ip}
                />
              </div>
            </div>

            <div
              className="col-12"
              style={{ marginTop: 4, textAlign: 'center' }}
            >
              <button
                type="button"
                className="btn btn-lg btn-primary"
                style={{
                  backgroundColor: '#db3652',
                  color: '#fff',
                  borderWidth: 0,
                  width: '100%'
                }}
                onClick={this.injectScript.bind(this)}
                {...disabled}
              >
                开始注入调试
              </button>
            </div>

            <div
              className="col-12"
              style={{ marginTop: 30, textAlign: 'center' }}
            >
              <button
                type="button"
                className="btn btn-lg btn-primary"
                style={{
                  backgroundColor: '#db3652',
                  color: '#fff',
                  borderWidth: 0,
                  width: '100%'
                }}
                onClick={() => this.injectScriptIp('192.168.1.127')}
                {...disabled}
              >
                192.168.1.127
              </button>
            </div>

            <div
              className="col-12"
              style={{ marginTop: 30, textAlign: 'center' }}
            >
              <button
                type="button"
                className="btn btn-lg btn-primary"
                style={{
                  backgroundColor: '#db3652',
                  color: '#fff',
                  borderWidth: 0,
                  width: '100%'
                }}
                onClick={() => this.injectScriptIp('192.168.1.16')}
                {...disabled}
              >
                192.168.1.16
              </button>
            </div>

            <div
              className="col-12"
              style={{ marginTop: 30, textAlign: 'center' }}
            >
              <button
                type="button"
                className="btn btn-lg btn-primary"
                style={{
                  backgroundColor: '#db3652',
                  color: '#fff',
                  borderWidth: 0,
                  width: '100%'
                }}
                onClick={() => this.removeCookies()}
                {...disabled}
              >
                清除cookie
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
