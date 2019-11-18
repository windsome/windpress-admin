import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace, goBack } from 'react-router-redux';

import Loadable from 'react-loadable';
import { MenuItem, GoBackItem } from 'components/widgets/Menu';
import Loading from 'components/Loading';
import NotFound from 'components/NotFound';
import Gap, { VerticalGap } from 'components/widgets/Gap';

const RootMenu = ({ goBack }) => {
  return (
    <div>
      <GoBackItem onClick={goBack} title="超级管理" />
      <Gap width={10} />
      <div>
        <MenuItem
          icon="fa fa-users"
          title="用户管理"
          subtitle="管理所有用户注销/开启"
          arrow={true}
          link="/mine/root/users"
        />
        {/*<Gap width={10} />
          <MenuItem
            icon="fa fa-file-text-o"
            title="商户管理"
            subtitle="商家入驻审查"
            arrow={true}
            link="/mine/root/shops"
          />*/}
        <Gap width={10} />
        <MenuItem
          icon="fa fa-list-ol"
          title="商品类型维护"
          subtitle="增加删除商品类型"
          arrow={true}
          link="/mine/root/categories"
        />
        <MenuItem
          icon="fa fa-tags"
          title="商户标签管理"
          subtitle="增加删除商户标签"
          arrow={true}
          link="/mine/root/tags"
        />
        <MenuItem
          icon="fa fa-home"
          title="首页管理"
          subtitle="设置首页内容"
          arrow={true}
          link="/app/edit"
        />
      </div>
    </div>
  );
};
const RootMenuPage = connect(null, { goBack })(RootMenu);

const AppWraper = ({ goBack, match }) => {
  return (
    <Switch>
      <Route exact path="/mine/root" component={RootMenuPage} />
      <Route
        exact
        path="/mine/root/users"
        component={Loadable({
          loader: () => import('./Users/list'),
          loading: Loading
        })}
      />
      {/*<Route
        exact
        path="/mine/root/shops"
        component={Loadable({
          loader: () => import('./Users/list'),
          loading: Loading
        })}
      />*/}
      <Route
        exact
        path="/mine/root/categories"
        component={Loadable({
          loader: () => import('./Settings/edit.category'),
          loading: Loading
        })}
      />
      <Route
        exact
        path="/mine/root/tags"
        component={Loadable({
          loader: () => import('./Settings/edit.tag'),
          loading: Loading
        })}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export default connect(null, { goBack })(AppWraper);

//export default AppWraper;
