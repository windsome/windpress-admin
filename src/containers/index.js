import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route, Link, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import isNull from 'lodash/isNull';

import Loadable from 'react-loadable';
import Loading from 'components/Loading';
import NotFound from 'components/NotFound';
import PrivateRoute from 'components/PrivateRoute';

import LoginPage from './LoginPage';
import { loginCookie } from 'modules/user';
import { meSelect } from 'selectors/user';
import { getSignPkgByUrl } from 'modules/jssdk';
import { originalPkgSelect, jssdkSelect } from 'selectors/jssdk';
import { get as getPosition } from 'modules/position';
import { positionSelect } from 'selectors/position';
import { get as getPointUser } from 'modules/pointUser';
import { dbSelect as dbPointUserSelect } from 'selectors/pointUser';
import parseUserAgent from 'utils/userAgent';
import { wxConfig } from 'utils/jssdk';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import './index.css';

//import App from './App';
import AllLink from './alllink';
//import About from './about'

class AppWraper extends Component {
  constructor() {
    super();
    this.ua = parseUserAgent(navigator.userAgent);
    this.isWechat = !!this.ua.wechat;
  }
  componentDidMount() {
    console.log('componentDidMount AppWraper, do signAndConfigJssdk');
    let { loginCookie } = this.props;
    loginCookie && loginCookie();
    //setTimeout(this.initPosition.bind(this), 0);
    setTimeout(this.initWechat.bind(this), 0);
  }
  componentWillReceiveProps(nextProps) {
    //console.log('componentWillReceiveProps: ', nextProps);
    let { location: oLocation, me: oMe } = this.props;
    let { location: nLocation, me: nMe } = nextProps;
    let nextLocationKey = nLocation && nLocation.key;
    let currLocationKey = oLocation && oLocation.key;
    if (nextLocationKey !== currLocationKey) {
      // not 100% sure about using `locatoin.key` to distinguish between routes
      console.log(
        'location about to changed! current=' +
          currLocationKey +
          ', next=' +
          nextLocationKey +
          ', href=' +
          window.location.href +
          ', match=',
        nextProps.match,
        ', location=',
        nLocation
      );
      setTimeout(this.initWechat.bind(this), 200);
    }
    if (oMe !== nMe) {
      console.log('user change! need refresh PointUser');
      let { dbPointUser, getPointUser } = nextProps;
      if (nMe && nMe.id && getPointUser) getPointUser(nMe.id);
    }
  }

  async initPosition() {
    let { jssdk, orgPkg, position, getSignPkgByUrl, getPosition } = this.props;
    try {
      await this.initWechat();
      let lat = position && position.lat;
      if (isNull(lat)) {
        position = await getPosition(this.isWechat);
      }
      return position;
    } catch (error) {
      console.log('initWechat error: ', error);
      return null;
    }
  }

  async initWechat() {
    let { jssdk, orgPkg, position, getSignPkgByUrl, getPosition } = this.props;
    try {
      if (this.isWechat) {
        let url = window.location.href.split('#')[0];
        let pkg = jssdk[url];
        if (!pkg) {
          pkg = await getSignPkgByUrl();
          let cfg = await wxConfig(pkg);
          //if (this.props.orgPkg) await wxConfig(pkg);
        }
      }
    } catch (error) {
      console.log('initWechat error: ', error);
      return null;
    }
  }

  render() {
    const { me, jssdk, position } = this.props;
    console.log('ROOT:', jssdk, position, window.location);
    let authed = !!(me && me.id);
    return (
      <Switch>
        {/*<Route exact path="/" component={App} />*/}
        <Route
          exact
          path="/"
          component={() => <Redirect to={{ pathname: '/app' }} />}
        />
        <Route exact path="/login" component={LoginPage} />
        <Route
          path="/test"
          component={Loadable({
            loader: () => import('./Test'),
            loading: Loading
          })}
        />
        <Route
          exact
          path="/widgets"
          component={Loadable({
            loader: () => import('components/widgets/index'),
            loading: Loading
          })}
        />
        <Route
          exact
          path="/widgetlist"
          component={Loadable({
            loader: () => import('components/lists'),
            loading: Loading
          })}
        />
        <Route
          path="/app"
          component={Loadable({
            loader: () => import('./App'),
            loading: Loading
          })}
        />
        <PrivateRoute
          authed={authed}
          path="/mine"
          component={Loadable({
            loader: () => import('./Mine'),
            loading: Loading
          })}
        />
        <PrivateRoute
          authed={authed}
          path="/admin"
          component={Loadable({
            loader: () => import('./Admin'),
            loading: Loading
          })}
        />
        <Route component={AllLink} />
      </Switch>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    me: meSelect(state, props),
    jssdk: jssdkSelect(state),
    orgPkg: originalPkgSelect(state),
    position: positionSelect(state, props),
    dbPointUser: dbPointUserSelect(state)
  };
};

const mapActionsToProps = {
  getSignPkgByUrl,
  loginCookie,
  getPosition,
  getPointUser
};

export default withRouter(
  connect(mapStateToProps, mapActionsToProps)(AppWraper)
);
