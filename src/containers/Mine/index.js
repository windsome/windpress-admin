import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace, goBack } from 'react-router-redux';

import Loadable from 'react-loadable';
import Loading from 'components/Loading';
import NotFound from 'components/NotFound';
import Weinre from 'components/Weinre';
import { MenuItem, GoBackItem } from 'components/widgets/Menu';

const AppWraper = () => (
  <Switch>
    <Route
      exact
      path="/mine"
      component={Loadable({
        loader: () => import('./Main'),
        loading: Loading
      })}
    />
    <Route
      exact
      path="/mine/me"
      component={Loadable({
        loader: () => import('./Users/edit'),
        loading: Loading
      })}
    />
    <Route
      path="/mine/orders"
      component={Loadable({
        loader: () => import('./Orders'),
        loading: Loading
      })}
    />
    <Route
      path="/mine/shops"
      component={Loadable({
        loader: () => import('./Shops'),
        loading: Loading
      })}
    />
    <Route
      path="/mine/products"
      component={Loadable({
        loader: () => import('./Products'),
        loading: Loading
      })}
    />
    <Route
      path="/mine/users"
      component={Loadable({
        loader: () => import('./Users'),
        loading: Loading
      })}
    />
    <Route
      path="/mine/votes"
      component={Loadable({
        loader: () => import('./Votes'),
        loading: Loading
      })}
    />
    <Route
      path="/mine/messages"
      component={Loadable({
        loader: () => import('./Messages'),
        loading: Loading
      })}
    />
    <Route
      path="/mine/bonus"
      component={Loadable({
        loader: () => import('./Bonus'),
        loading: Loading
      })}
    />
    <Route
      path="/mine/root"
      component={Loadable({
        loader: () => import('./routesRoot'),
        loading: Loading
      })}
    />
    <Route exact path="/mine/weinre" component={Weinre} />
    <Route component={NotFound} />
  </Switch>
);

export default AppWraper;
