import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';

import parseUserAgent from 'utils/userAgent';
import hasCaps from 'utils/caps';

import Gap, { VerticalGap } from 'components/widgets/Gap';
import { MenuItem } from 'components/widgets/Menu';

import { logout } from 'modules/user';
import { meSelect } from 'selectors/user';

import './Main.css';

export const UserInfo = ({ data, push }) => {
  let { account, desc, extend } = data || {};
  let { name, phone, address } = desc || {};
  let { nickname, headimgurl } = extend || {};
  name = name || nickname || account;
  let avatar = headimgurl || '/ysj/images/avatar-1.png';
  return (
    <div className="user">
      <div
        className="btn btn-warning p-2 m-2 float-right"
        onClick={() => push('/mine/me')}
      >
        <span className="rounded d-block small">个人设置</span>
      </div>
      <div className="user-photo">
        <img className="img-fluid" src={avatar} />
      </div>
      <div className="user-nick media align-items-center">
        <span className="media-body text-truncate mr-2" id="J_myNick">
          {name}
        </span>
        <span className="media-body embed-responsive level level3" />
      </div>
    </div>
  );
};

export const UserBehavior = ({ data }) => {
  data = data || [
    { name: '收藏的宝贝', count: 0, url: '/mine/' },
    { name: '我的分利', count: 0, url: '/mine/bonus' },
    { name: '我的消息', count: 0, url: '/mine/messages' }
  ];
  let uis = data.map((item, index) => {
    return (
      <li className="media-body" key={index}>
        <Link to={item.url}>
          <div>{item.count}</div>
          <div>{item.name}</div>
        </Link>
      </li>
    );
  });
  return <ul className="media align-items-center">{uis}</ul>;
};

export const MyOrder = ({ data }) => {
  return (
    <ul className="media align-items-center align-content-center">
      <li className="media-body">
        <a href="//h5.m.taobao.com/mlapp/olist.html?tabCode=waitPay">
          <div>
            <span className="fa fa-shopping-bag" />
          </div>
          <div className="sub">待付款</div>
        </a>
      </li>
      <li className="media-body">
        <a href="//h5.m.taobao.com/mlapp/olist.html?tabCode=waitSend">
          <div>
            <span className="fa fa-shopping-cart" />
          </div>
          <div className="sub">待发货</div>
        </a>
      </li>
      <li className="media-body">
        <a href="//h5.m.taobao.com/mlapp/olist.html?tabCode=waitConfirm">
          <div>
            <span className="fa fa-shopping-cart" />
          </div>
          <div className="sub">待收货</div>
        </a>
      </li>
      <li className="media-body">
        <a href="//h5.m.taobao.com/mlapp/olist.html?tabCode=waitRate">
          <div>
            <span className="fa fa-shopping-cart" />
          </div>
          <div className="sub">待评价</div>
          <div className="number">4</div>
        </a>
      </li>
      <li className="media-body">
        <a href="//h5.m.taobao.com/awp/mtb/olist.htm?sta=3">
          <div>
            <span className="fa fa-shopping-cart" />
          </div>
          <div className="sub">退款/售后</div>
        </a>
      </li>
    </ul>
  );
};

export class Page extends React.Component {
  constructor(props) {
    super(props);
    let ua = parseUserAgent(navigator.userAgent);
    this.isWechat = !!(ua && ua.wechat);
  }

  componentDidMount() {
    let me = this.props.me;
    if (me && me.id) {
      // load, shoplist...
    }
  }
  componentWillReceiveProps(nextProps) {
    let currMe = this.props.me;
    let nextMe = nextProps.me;
    let currMeId = currMe && currMe.id;
    let nextMeId = nextMe && nextMe.id;
    if (currMeId != nextMeId) {
      // reload, get new shoplist...
    }
  }

  doLogout(e) {
    e.preventDefault();
    let { logout } = this.props;
    logout();
  }

  render() {
    let { me, dataShopRetrieve, schools, courses, push } = this.props;
    // shops表示我拥有几间商铺
    // schools表示我作为教师签约了哪几个机构
    // courses表示我作为教师的课程有哪几门
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
    let uiManaged =
      me.shopsManage &&
      me.shopsManage.map(shopId => {
        let link = '/mine/products/byqs/shop=' + shopId;
        let name = '管理门店' + shopId;
        return (
          <MenuItem
            key={shopId}
            icon="fa fa-list"
            title={name}
            subtitle="商品管理/上传/修改"
            arrow={true}
            link={link}
          />
        );
      });

    return (
      <div className="container-fluid jumbotron-fluid text-left">
        <div className="row no-gutters">
          <div className="col-12">
            <UserInfo data={me} push={push} />
            <section className="user-behavior">
              <UserBehavior />
            </section>
            {/*<section className="order-act">
              <MyOrder />
            </section>*/}
            <MenuItem
              icon="fa fa-shopping-cart"
              title="全部订单"
              subtitle="查看全部订单"
              arrow={true}
              link="/mine/orders"
            />
            <MenuItem
              icon="fa fa-video-camera"
              title="我的课程"
              subtitle=""
              arrow={true}
              href="http://www.ysjclass.com/user/myCourse"
            />
            <MenuItem
              icon="fa fa-trophy"
              title="我的比赛"
              subtitle=""
              arrow={true}
              href="http://www.ysjclass.com/user/myMatch"
            />
            <MenuItem
              icon="fa fa-star"
              title="我的考级"
              subtitle=""
              arrow={true}
              href="http://www.ysjclass.com/user/myGrading"
            />
            {capShop && (
              <div>
                <Gap width={10} />
                <MenuItem
                  icon="fa fa-address-book-o"
                  title="商户管理"
                  subtitle="商家入驻/门店管理"
                  arrow={true}
                  link="/mine/shops"
                />
                <MenuItem
                  icon="fa fa-list"
                  title="商品管理"
                  subtitle="商品上传/商品管理"
                  arrow={true}
                  link="/mine/products"
                />
                {false && (
                  <MenuItem
                    icon="fa fa-newspaper-o"
                    title="新闻管理"
                    subtitle="新闻管理（软文管理/推送）"
                    arrow={true}
                    link="/mine/products"
                  />
                )}
                {false && (
                  <MenuItem
                    icon="fa fa-comments"
                    title="评论管理"
                    subtitle="最新点评/评论管理/申请删除错误评论"
                    arrow={true}
                    link="/mine/shops"
                  />
                )}
              </div>
            )}
            {uiManaged && (
              <div>
                <Gap width={10} />
                {uiManaged}
              </div>
            )}
            {capTeacher && (
              <div>
                <Gap width={10} />
                <MenuItem
                  icon="fa fa-edit"
                  title="签约机构"
                  subtitle="申请成为机构教师/离开机构"
                  arrow={true}
                  link="/mine/shops"
                />
                <MenuItem
                  icon="fa fa-tasks"
                  title="课程管理"
                  subtitle="销课系统"
                  arrow={true}
                  link="/mine/shops"
                />
              </div>
            )}
            {capVote && (
              <div>
                <Gap width={10} />
                <MenuItem
                  icon="fa fa-hand-pointer-o"
                  title="投票管理"
                  subtitle="发起投票/管理投票"
                  arrow={true}
                  link="/mine/votes"
                />
              </div>
            )}
            {isRoot && (
              <div>
                <Gap width={10} />
                <MenuItem
                  icon="fa fa-lock"
                  title="超级管理"
                  subtitle="商家审核/用户权限管理/商品类型维护/商户标签维护/商户属性维护"
                  arrow={true}
                  link="/mine/root"
                />
              </div>
            )}

            <div>
              <Gap width={10} />
              <MenuItem
                icon="fa fa-edit"
                title="申请新功能"
                subtitle="商家/投票/教师"
                arrow={true}
                link="/mine/users/caps"
              />
            </div>
            {capDebug && (
              <div>
                <Gap width={10} />
                <MenuItem
                  icon="fa fa-bug"
                  title="Weinre"
                  subtitle="调试模式"
                  arrow={true}
                  link="/mine/weinre"
                />
              </div>
            )}
            <div className="clearfix" />
            <Gap width={10} />
          </div>
        </div>
        <div className="row no-gutters">
          <div className="col-12">
            <footer className="row no-gutters mine-footer">
              <div className="col-3 text-truncate">
                <span className="nick">{me.account}</span>
              </div>
              <div className="col-3 text-truncate">
                {!this.isWechat && (
                  <div>
                    <Link onClick={this.doLogout.bind(this)} to="/app/">
                      <span>退出</span>
                    </Link>
                  </div>
                )}
              </div>
              {!this.isWechat && (
                <div className="col-3 text-truncate">
                  <Link to="/admin">
                    <span>管理中心(PC版)</span>
                  </Link>
                </div>
              )}
              <div className="col-3 text-truncate">
                <Link to="/">
                  <span>首页</span>
                </Link>
              </div>
            </footer>
          </div>
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
  logout
})(Page);
