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
        path="/mine/users"
        component={Loadable({
          loader: () => import('./list'),
          loading: Loading
        })}
      />
      <Route
        exact
        path="/mine/users/caps"
        component={Loadable({
          loader: () => import('./CapRequest'),
          loading: Loading
        })}
      />
      <Route
        exact
        path="/mine/users/me"
        component={Loadable({
          loader: () => import('./edit'),
          loading: Loading
        })}
      />
      <Route
        exact
        path="/mine/users/:id"
        component={Loadable({
          loader: () => import('./edit'),
          loading: Loading
        })}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export default AppWraper;
