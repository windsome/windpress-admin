import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import Loadable from 'react-loadable';
import isNull from 'lodash/isNull';
import parseUserAgent from 'utils/userAgent';

import Loading from 'components/Loading';
import NotFound from 'components/NotFound';

import { get as getPosition } from 'modules/position';
import { positionSelect } from 'selectors/position';

const AsyncMain = Loadable({
  loader: () => import('./Main'),
  loading: Loading
});

const AsyncSearch = Loadable({
  loader: () => import('./Search'),
  loading: Loading
});

const AsyncMainBak = Loadable({
  loader: () => import('./bak.dp.index'),
  loading: Loading
});

const AsyncDpList = Loadable({
  loader: () => import('./dp.shoplist'),
  loading: Loading
});

const AsyncDpCourseList = Loadable({
  loader: () => import('./dp.productlist'),
  loading: Loading
});

const AsyncProductSeckillList = Loadable({
  loader: () => import('./SeckillList'),
  loading: Loading
});

const AsyncDpShop = Loadable({
  loader: () => import('./dp.shop'),
  loading: Loading
});

const AsyncDpProduct = Loadable({
  loader: () => import('./dp.product'),
  loading: Loading
});

const AsyncDpOrder = Loadable({
  loader: () => import('./dp.order'),
  loading: Loading
});

const AsyncVote = Loadable({
  loader: () => import('./Vote'),
  loading: Loading
});

const AsyncMatch = Loadable({
  loader: () => import('./Match'),
  loading: Loading
});

const AsyncBonusInvite = Loadable({
  loader: () => import('./Bonus/Invite'),
  loading: Loading
});

export class Page extends React.Component {
  constructor() {
    super();
  }

  async initPosition() {
    let { position, getPosition } = this.props;
    this.ua = parseUserAgent(navigator.userAgent);
    this.isWechat = !!this.ua.wechat;
    try {
      let lat = position && position.lat;
      if (isNull(lat)) {
        position = await getPosition(this.isWechat);
      }
      return position;
    } catch (error) {
      console.log('initPosition error: ', error);
      return null;
    }
  }

  render() {
    //let { match } = this.props;
    return (
      <Switch>
        <Route exact path="/app" component={AsyncMain} />
        <Route exact path="/app/search" component={AsyncSearch} />
        <Route path="/app/index2" component={AsyncMainBak} />
        <Route exact path="/app/shoplist" component={AsyncDpList} />
        <Route path="/app/shoplist/:qs" component={AsyncDpList} />
        <Route path="/app/shop/:id" component={AsyncDpShop} />
        <Route exact path="/app/productlist" component={AsyncDpCourseList} />
        <Route path="/app/productlist/:qs" component={AsyncDpCourseList} />
        <Route
          path="/app/seckilllist/:qs"
          component={AsyncProductSeckillList}
        />
        <Route
          exact
          path="/app/seckilllist"
          component={AsyncProductSeckillList}
        />
        <Route path="/app/product/:id" component={AsyncDpProduct} />
        <Route path="/app/order/:id" component={AsyncDpOrder} />
        <Route path="/app/vote/:id" component={AsyncVote} />
        <Route path="/app/match/:id" component={AsyncMatch} />
        <Route path="/app/bonus/invite/:id" component={AsyncBonusInvite} />
        <Route exact path="/app/:action" component={AsyncMain} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    position: positionSelect(state, props)
  };
};

const mapActionsToProps = {
  getPosition
};

export default connect(mapStateToProps, mapActionsToProps)(Page);
