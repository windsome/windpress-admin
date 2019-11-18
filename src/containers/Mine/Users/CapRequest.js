import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace, goBack } from 'react-router-redux';

import hasCaps from 'utils/caps';
import { MenuItem, GoBackItem } from 'components/widgets/Menu';
import { meSelect } from 'selectors/user';

export class Page extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { me, push, goBack } = this.props;
    if (!me) {
      return (
        <div>
          <span>您还未登录！请先</span>
          <Link to="/login">登录</Link>
        </div>
      );
    }
    let isRoot = hasCaps(me, 'root');
    // 权限列表：商家权限 SHOP，教师权限 TEACHER，调试权限 DEBUG
    //let isRoot = true;
    let capShop = hasCaps(me, 'shop');
    let capTeacher = hasCaps(me, 'teacher');
    let capDebug = hasCaps(me, 'debug');
    let capVote = hasCaps(me, 'vote');

    return (
      <div>
        <div>
          <GoBackItem onClick={goBack} title="申请新功能" />
        </div>
        <div>
          {!capShop && (
            <MenuItem
              icon="fa fa-file-text-o"
              title="申请商家功能"
              subtitle="可以创建门店，发布商品"
              arrow={true}
              link="/mine/messages/action/capshop"
            />
          )}
          {!capTeacher && (
            <MenuItem
              icon="fa fa-file-text-o"
              title="申请教师功能"
              subtitle="可以申请成为机构教师"
              arrow={true}
              link="/mine/shops"
            />
          )}
          {!capVote && (
            <MenuItem
              icon="fa fa-file-text-o"
              title="申请投票功能"
              subtitle="可以发起投票"
              arrow={true}
              link="/mine/votes"
            />
          )}
          {!capDebug && (
            <MenuItem
              icon="fa fa-file-text-o"
              title="申请调试功能"
              subtitle="成为网站调试人员"
              arrow={true}
              link="/mine/shops"
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    me: meSelect(state, props)
  };
};

export default connect(mapStateToProps, {
  push,
  goBack
})(Page);
