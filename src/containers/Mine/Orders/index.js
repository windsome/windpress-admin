import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Loadable from 'react-loadable';
import Loading from 'components/Loading';
import NotFound from 'components/NotFound';

const AppWraper = ({ match }) => {
  return (
    <Switch>
      <Route
        exact
        path="/mine/orders"
        component={Loadable({
          loader: () => import('./list'),
          loading: Loading
        })}
      />
      <Route
        exact
        path="/mine/orders/query/:qs"
        component={Loadable({
          loader: () => import('./list'),
          loading: Loading
        })}
      />
      <Route
        exact
        path="/mine/orders/:id"
        component={Loadable({
          loader: () => import('../../App/dp.order'),
          loading: Loading
        })}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export default AppWraper;
