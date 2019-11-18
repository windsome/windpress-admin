import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';
import _ from 'lodash';

import { meSelect } from 'selectors/user';
import { get as getUser } from 'modules/user';
import { dbSelect as dbUserSelect } from 'selectors/user';
import {
  create as createBonusUser,
  get as getBonusUser
} from 'modules/bonusUser';
import { dbSelect as dbBonusUserSelect } from 'selectors/bonusUser';

import { keyRetrieveResult, keyRetrieveInfo } from 'modules/u_key';

let xdebug = window.myDebug('app:bonus:invite');

export class Page extends React.Component {
  state = {
    errMsg: null
  };
  constructor() {
    super();
    this.initFetchData = this.initFetchData.bind(this);
    this.registBonusUser = this.registBonusUser.bind(this);
  }

  componentDidMount() {
    this.initFetchData(this.props).then(ret => {
      xdebug('initFetchData: ', ret);
    });
  }
  componentWillReceiveProps(nextProps) {
    let currMatch = this.props.match;
    let nextMatch = nextProps.match;

    let currId = currMatch && currMatch.params && currMatch.params.id;
    let nextId = nextMatch && nextMatch.params && nextMatch.params.id;
    if (nextId != currId) {
      this.initFetchData(nextProps).then(ret => {
        xdebug('initFetchData: ', ret);
      });
    }
  }

  async initFetchData(props) {
    let { match, me, dbUser, dbBonusUser, getUser, getBonusUser } = props;
    let id = match.params && match.params.id;
    let meId = me && me.id;
    if (id) {
      // get option.
      let user = dbUser && dbUser[id];
      if (!user) {
        try {
          user = await getUser(id);
        } catch (error) {
          xdebug('error! getUser fail! ', error);
        }
      }
      let bonusUser = dbBonusUser && dbBonusUser[id];
      if (!bonusUser) {
        try {
          bonusUser = await getBonusUser(id);
        } catch (error) {
          xdebug('error! getBonusUser fail!', error);
        }
      }
    }
    if (meId != id) {
      let bonusUserMe = dbBonusUser && dbBonusUser[meId];
      if (!bonusUserMe) {
        try {
          bonusUserMe = await getBonusUser(meId);
        } catch (error) {
          xdebug('error! getBonusUser fail!', error);
        }
      }
    }
    return true;
  }
  async registBonusUser() {
    let { replace, match, createBonusUser } = this.props;
    let id = match.params && match.params.id;
    try {
      let bonusUser = await createBonusUser({ owner: id });
      replace('/app/bonus/invite/' + bonusUser.id);
    } catch (error) {
      xdebug('error! createBonusUser fail!', error);
      this.setState({ errMsg: error.message });
    }
  }

  renderShareMode() {
    let { match, me, dbUser, dbBonusUser } = this.props;
    let id = match.params && match.params.id;
    let bonusUser = dbBonusUser && dbBonusUser[id];
    if (!bonusUser) {
      return (
        <div>
          <div>
            <span>无效页面</span>
          </div>
          <div>
            <span>回到</span>
            <Link to="/app">首页</Link>
          </div>
        </div>
      );
    }

    let user = dbUser && dbUser[id];
    let { account, desc, extend } = user || {};
    let { bonus, ratio } = bonusUser || {};
    let userHeadimgurl =
      (extend && extend.headimgurl) || '/ysj/images/avatar-1.png';
    bonus = (bonus && parseInt(bonus)) || 0;

    return (
      <div className="p-2 m-1 bg-white">
        <div>
          <div>您已经加入分利系统！</div>
          <div>
            <img style={{ width: 64, height: 64 }} src={userHeadimgurl} />
          </div>
          <div>{'帐号：' + account}</div>
          <div className="px-1">{'积分：' + bonus}</div>
          <div className="text-warning">
            请将此页面分享给其他人，您可以获更多利润
          </div>
        </div>
      </div>
    );
  }
  renderRedirectToSelf() {
    let { me, dbBonusUser } = this.props;
    let meId = me && me.id;
    let bonusUserMe = dbBonusUser && dbBonusUser[meId];
    if (bonusUserMe) {
      return (
        <div className="p-2 m-1 bg-white">
          <div>
            <div>您已经是分利营销会员</div>
          </div>
          <div className="text-center p-2">
            <Link to={'/app/bonus/invite/' + meId}>
              <div className="btn bg-success">点击发展自己的会员</div>
            </Link>
          </div>
        </div>
      );
    }
  }
  renderRegistMode() {
    let { match, me, dbUser, dbBonusUser } = this.props;
    let id = match.params && match.params.id;
    let user = dbUser && dbUser[id];
    let bonusUser = dbBonusUser && dbBonusUser[id];
    let { account, desc, extend } = user || {};
    let { bonus, ratio } = bonusUser || {};
    let userHeadimgurl =
      (extend && extend.headimgurl) || '/ysj/images/avatar-1.png';
    bonus = (bonus && parseInt(bonus)) || 0;
    return (
      <div className="p-2 m-1 bg-white">
        <div>
          <div>邀请人信息：</div>
          <div>
            <img style={{ width: 64, height: 64 }} src={userHeadimgurl} />
          </div>
          <div>{'帐号：' + account}</div>
          <div className="px-1">{'积分：' + bonus}</div>
        </div>
        <div className="text-center p-2">
          <div className="btn bg-success" onClick={this.registBonusUser}>
            接收邀请，加入分利营销
          </div>
        </div>
      </div>
    );
  }
  render() {
    let { match, me, dbUser, dbBonusUser } = this.props;
    let id = match.params && match.params.id;
    let meId = me && me.id;
    if (!id) {
      return (
        <div>
          <div>
            <span>错误的邀请页面，缺少参数</span>
          </div>
          <div>
            <span>请访问</span>
            <Link to="/app">首页</Link>
          </div>
        </div>
      );
    }
    if (!meId) {
      return <div>您未登录系统，不能访问！</div>;
    }

    let bonusUserMe = dbBonusUser && dbBonusUser[meId];
    let isShareMode = id == meId;
    let ui = null;
    if (isShareMode) ui = this.renderShareMode();
    else if (bonusUserMe) {
      ui = this.renderRedirectToSelf();
    } else ui = this.renderRegistMode();
    let { errMsg } = this.state;
    return (
      <div>
        {ui}
        <div className="text-danger">{errMsg}</div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  me: meSelect(state, props),
  dbUser: dbUserSelect(state),
  dbBonusUser: dbBonusUserSelect(state)
});
const mapActionsToProps = {
  push,
  replace,
  getUser,
  getBonusUser,
  createBonusUser
};
export default connect(mapStateToProps, mapActionsToProps)(Page);
