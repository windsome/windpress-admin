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
        path="/mine/votes"
        component={Loadable({
          loader: () => import('./list'),
          loading: Loading
        })}
      />
      <Route
        path="/mine/votes/:voteId/edit"
        component={Loadable({
          loader: () => import('./editVote'),
          loading: Loading
        })}
      />
      <Route
        path="/mine/votes/:voteId/address"
        component={Loadable({
          loader: () => import('./editVote'),
          loading: Loading
        })}
      />
      <Route
        exact
        path="/mine/votes/:voteId/options"
        component={Loadable({
          loader: () => import('./listOption'),
          loading: Loading
        })}
      />
      <Route
        exact
        path="/mine/votes/:voteId/options/:optionId"
        component={Loadable({
          loader: () => import('containers/App/Vote/Actor'),
          loading: Loading
        })}
      />
      <Route
        path="/mine/votes/:voteId/options/:optionId/edit"
        component={Loadable({
          loader: () => import('./editOption'),
          loading: Loading
        })}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export default AppWraper;
