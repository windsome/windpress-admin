import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace, goBack } from 'react-router-redux';
import Loadable from 'react-loadable';

import Loading from 'components/Loading';
import NotFound from 'components/NotFound';
import { GoBackItem } from 'components/widgets/Menu';

const LoadableShopInfo = Loadable({
  loader: () => import('../../App/dp.shop'),
  loading: Loading,
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  }
});

const LoadableShopInfoWrapper = props => (
  <div>
    <GoBackItem onClick={props.goBack} title="商户信息" />
    <LoadableShopInfo {...props} />
  </div>
);
const LoadableShopInfoContainer = connect(null, { goBack })(
  LoadableShopInfoWrapper
);

const AppWraper = ({ match }) => {
  return (
    <Switch>
      <Route
        exact
        path="/mine/shops"
        component={Loadable({
          loader: () => import('./list'),
          loading: Loading
        })}
      />
      <Route
        exact
        path="/mine/shops/create"
        component={Loadable({
          loader: () => import('./create'),
          loading: Loading
        })}
      />
      <Route
        path="/mine/shops/edit/:id"
        component={Loadable({
          loader: () => import('./edit'),
          loading: Loading
        })}
      />
      <Route
        path="/mine/shops/editManager/:id"
        component={Loadable({
          loader: () => import('./editManager'),
          loading: Loading
        })}
      />
      <Route
        exact
        path="/mine/shops/:id"
        component={LoadableShopInfoContainer}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export default AppWraper;
