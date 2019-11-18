import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace, goBack } from 'react-router-redux';

import Loadable from 'react-loadable';
import Loading from 'components/Loading';
import NotFound from 'components/NotFound';

const AppWraper = ({ match }) => {
  return (
    <Switch>
      <Route
        exact
        path="/mine/products"
        component={Loadable({
          loader: () => import('./list'),
          loading: Loading
        })}
      />
      <Route
        exact
        path="/mine/products/byqs/:qs"
        component={Loadable({
          loader: () => import('./list'),
          loading: Loading
        })}
      />
      <Route
        exact
        path="/mine/products/create"
        component={Loadable({
          loader: () => import('./create'),
          loading: Loading
        })}
      />
      {/* <Route
        exact
        path="/mine/products/create/byshop/:shopId"
        component={Loadable({
          loader: () => import('./create'),
          loading: Loading
        })}
      /> */}
      <Route
        exact
        path="/mine/products/edit/:id"
        component={Loadable({
          loader: () => import('./edit'),
          loading: Loading
        })}
      />
      <Route
        exact
        path="/mine/products/edit/:id/seckill"
        component={Loadable({
          loader: () => import('./seckill'),
          loading: Loading
        })}
      />
      <Route
        exact
        path="/mine/products/class/:id/:action"
        component={Loadable({
          loader: () => import('containers/App/dp.product'),
          loading: Loading
        })}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export default AppWraper;
