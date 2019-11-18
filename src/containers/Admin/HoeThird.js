// see also http://gohooey.com/demo/sidebar/bootstrapnavigation/hoedemo.html
import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import Loadable from 'react-loadable';
import Loading from 'components/Loading';
import NotFound from 'components/NotFound';
import './HoeThird.css';
// import './HoeNextHeader.css';
// //import './Hoe.scene.color.css';

import { logout } from 'modules/user';
import { meSelect } from 'selectors/user';

export const SearchBar = ({ data }) => {
  return (
    <form method="post" className="hoe-searchbar">
      <input
        type="text"
        placeholder="Search..."
        name="keyword"
        className="form-control"
      />
      <span className="search-icon">
        <i className="fa fa-search" />
      </span>
    </form>
  );
};
export const ProfileBox = () => {
  return (
    <div className="media">
      <img className="rounded-circle avatar" src="/ysj/images/avatar-1.png" />
      <div className="media-body ml-3">
        <h5 className="media-heading">
          Welcome <span>James</span>
        </h5>
        <small>UX Designer</small>
      </div>
    </div>
  );
};

export const Menu = () => {
  return (
    <ul className="menu">
      <li>
        <span className="nav-level">导航</span>
      </li>
      <li className="active">
        <div className="menu-item">
          <i className="fa fa-tachometer mr-2" />
          <span className="menu-text">总览</span>
          <span className="selected" />
        </div>
      </li>
      <li>
        <div className="menu-item">
          <i className="fa fa-bar-chart mr-2" />
          <span className="menu-text">查看个人信息</span>
          <span className="label sul">New</span>
          <span className="selected" />
        </div>
      </li>
      <li className="hoe-has-menu opened">
        <div className="menu-item">
          <i className="fa fa-shopping-cart mr-2" />
          <span className="menu-text">我是买家</span>
          <span className="selected" />
        </div>
        <ul className="hoe-sub-menu">
          <li className="hoe-has-menu opened">
            <div className="menu-item">
              <span className="menu-text">已买到的宝贝</span>
              <span className="selected" />
            </div>
            <ul className="hoe-sub-menu">
              <li className="active">
                <div className="menu-item">
                  <span className="menu-text">我的课程</span>
                  <span className="selected" />
                </div>
              </li>
              <li>
                <div className="menu-item">
                  <span className="menu-text">我的试听课</span>
                  <span className="selected" />
                </div>
              </li>
              <li>
                <div className="menu-item">
                  <span className="menu-text">我的比赛考级</span>
                  <span className="selected" />
                </div>
              </li>
            </ul>
          </li>
          <li>
            <div className="menu-item">
              <span className="menu-text">我的收藏</span>
              <span className="selected" />
            </div>
          </li>
          <li>
            <div className="menu-item">
              <span className="menu-text">我的投票</span>
              <span className="selected" />
            </div>
          </li>
          <li>
            <div className="menu-item">
              <span className="menu-text">评价管理</span>
              <span className="selected" />
            </div>
          </li>
          <li>
            <div className="menu-item">
              <span className="menu-text">我的足迹</span>
              <span className="label sul">有更新</span>
              <span className="selected" />
            </div>
          </li>
        </ul>
      </li>
      <li className="hoe-has-menu">
        <div className="menu-item">
          <i className="fa fa-shopping-bag mr-2" />
          <span className="menu-text">我是卖家</span>
          <span className="selected" />
        </div>
        <ul className="hoe-sub-menu">
          <li className="active">
            <div className="menu-item">
              <span className="menu-text">门店管理</span>
              <span className="selected" />
            </div>
          </li>
          <li>
            <div className="menu-item">
              <span className="menu-text">商品管理</span>
              <span className="selected" />
            </div>
          </li>
          <li>
            <div className="menu-item">
              <span className="menu-text">订单管理</span>
              <span className="label sul">Updated</span>
              <span className="selected" />
            </div>
          </li>
          <li>
            <div className="menu-item">
              <span className="menu-text">评价管理</span>
              <span className="selected" />
            </div>
          </li>
        </ul>
      </li>
      <li className="hoe-has-menu">
        <div className="menu-item">
          <i className="fa fa-graduation-cap  mr-2" />
          <span className="menu-text">我是教师</span>
          <span className="selected" />
        </div>
        <ul className="hoe-sub-menu">
          <li className="active">
            <div className="menu-item">
              <span className="menu-text">销课系统</span>
              <span className="selected" />
            </div>
          </li>
          <li>
            <div className="menu-item">
              <span className="menu-text">签约机构教师</span>
              <span className="selected" />
            </div>
          </li>
          <li>
            <div className="menu-item">
              <span className="menu-text">评价管理</span>
              <span className="label sul">Updated</span>
              <span className="selected" />
            </div>
          </li>
        </ul>
      </li>
      <li className="hoe-has-menu">
        <div className="menu-item">
          <i className="fa fa-users mr-2" />
          <span className="menu-text">我是超级管理员</span>
          <span className="selected" />
        </div>
        <ul className="hoe-sub-menu">
          <li className="active">
            <div className="menu-item">
              <span className="menu-text">会员管理</span>
              <span className="selected" />
            </div>
          </li>
          <li>
            <div className="menu-item">
              <span className="menu-text">商户管理</span>
              <span className="selected" />
            </div>
          </li>
          <li>
            <div className="menu-item">
              <span className="menu-text">商品管理</span>
              <span className="selected" />
            </div>
          </li>
          <li>
            <div className="menu-item">
              <span className="menu-text">销课管理</span>
              <span className="selected" />
            </div>
          </li>
          <li>
            <div className="menu-item">
              <span className="menu-text">教师管理</span>
              <span className="selected" />
            </div>
          </li>
          <li>
            <div className="menu-item">
              <span className="menu-text">投票管理</span>
              <span className="selected" />
            </div>
          </li>
          <li>
            <div className="menu-item">
              <span className="menu-text">评价管理</span>
              <span className="label sul">Updated</span>
              <span className="selected" />
            </div>
          </li>
        </ul>
      </li>
      <li className="hoe-has-menu">
        <div className="menu-item">
          <i className="fa fa-wrench mr-2" />
          <span className="menu-text">系统帮助</span>
          <span className="selected" />
        </div>
        <ul className="hoe-sub-menu">
          <li className="active">
            <div className="menu-item">
              <span className="menu-text">申请成为商户</span>
              <span className="selected" />
            </div>
          </li>
          <li>
            <div className="menu-item">
              <span className="menu-text">申请成为教师</span>
              <span className="selected" />
            </div>
          </li>
          <li>
            <div className="menu-item">
              <span className="menu-text">联系客服</span>
              <span className="label sul">Updated</span>
              <span className="selected" />
            </div>
          </li>
          <li>
            <div className="menu-item">
              <span className="menu-text">我要调试</span>
              <span className="selected" />
            </div>
          </li>
          <li className="hoe-has-menu">
            <div className="menu-item">
              <span className="menu-text">二级菜单</span>
              <span className="selected" />
            </div>
            <ul className="hoe-sub-menu">
              <li className="hoe-has-menu">
                <div className="menu-item">
                  <span className="menu-text">三级菜单</span>
                  <span className="selected" />
                </div>
                <ul className="hoe-sub-menu">
                  <li>
                    <div className="menu-item">
                      <span className="menu-text">四级菜单</span>
                      <span className="selected" />
                    </div>
                  </li>
                  <li>
                    <div className="menu-item">
                      <span className="menu-text">四级菜单</span>
                      <span className="selected" />
                    </div>
                  </li>
                  <li>
                    <div className="menu-item">
                      <span className="menu-text">四级菜单</span>
                      <span className="selected" />
                    </div>
                  </li>
                  <li>
                    <div className="menu-item">
                      <span className="menu-text">四级菜单</span>
                      <span className="selected" />
                    </div>
                  </li>
                </ul>
              </li>
              <li>
                <div className="menu-item">
                  <span className="menu-text">三级菜单</span>
                  <span className="selected" />
                </div>
              </li>
              <li>
                <div className="menu-item">
                  <span className="menu-text">三级菜单</span>
                  <span className="selected" />
                </div>
              </li>
              <li>
                <div className="menu-item">
                  <span className="menu-text">三级菜单</span>
                  <span className="selected" />
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  );
};

export class Page extends React.Component {
  state = {
    deviceType: 'desktop', //'desktop','phone'
    minimizedMenu: false
  };
  constructor() {
    super();
    this.toggleLeftPanel = this.toggleLeftPanel.bind(this);
    this.logout = this.logout.bind(this);
  }

  logout() {
    let { logout } = this.props;
    logout();
  }
  toggleLeftPanel(evt) {
    evt.preventDefault();
    this.setState({ minimizedMenu: !this.state.minimizedMenu });
  }

  calculateStatus() {}

  render() {
    let { me } = this.props;
    let { account, phone, desc, extend } = me || {};
    let { name, address } = desc || {};
    let { nickname, headimgurl } = extend || {};
    name = name || nickname || account;
    let avatar = headimgurl || '/ysj/images/avatar-1.png';

    let { deviceType, minimizedMenu } = this.state;
    // hide, minimize, normal
    let minimizedMenuClass = '';
    let hideLpanelClass = '';
    if (deviceType == 'phone') {
      if (minimizedMenu) hideLpanelClass = 'hoe-hide-lpanel';
    } else {
      if (minimizedMenu) minimizedMenuClass = 'hoe-minimized-lpanel';
    }
    return (
      <div
        id="hoeapp-wrapper"
        className={hideLpanelClass}
        data-hoe-device-type={deviceType}
      >
        <Helmet>
          <meta charSet="utf-8" />
          <title>{process.env.REACT_APP_TITLE + '管理后台'}</title>
        </Helmet>
        <header
          id="hoe-header"
          data-hoe-lpanel-effect="shrink"
          className={minimizedMenuClass}
        >
          <div className="hoe-left-header text-center text-nowrap">
            <Link to="/">
              <i className="fa fa-graduation-cap ml-2" />
              <span>{process.env.REACT_APP_TITLE + '管理后台'}</span>
            </Link>
            <span className="hoe-sidebar-toggle">
              <a href="#" onClick={this.toggleLeftPanel} />
            </span>
          </div>
          <div className="hoe-right-header">
            <span className="hoe-sidebar-toggle">
              <a href="#" onClick={this.toggleLeftPanel} />
            </span>
            <ul className="left-navbar">
              <li>
                <span className="icon-circle">
                  <i className="fa fa-envelope-o" />
                  <span className="badge badge-danger">5</span>
                </span>
              </li>
              <li>
                <span className="icon-circle">
                  <i className="fa fa-envelope-o" />
                  <span className="badge badge-danger">5</span>
                </span>
              </li>
              <li>
                <SearchBar />
              </li>
            </ul>
            <ul className="right-navbar">
              <li className="dropdown">
                <a className="dropdown-toggle">
                  <span>
                    <img className="rounded-circle avatar" src={avatar} />
                  </span>
                  <span className="ml-2 mr-2">{name}</span>
                  <i className=" fa fa-angle-down" />
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a href="#">
                      <i className="fa fa-user" />My Profile
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa fa-calendar" />My Calendar
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa fa-envelope" />My Inbox
                      <span className="badge badge-danger"> 3 </span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa fa-rocket" />My Tasks
                      <span className="badge badge-success"> 7 </span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa fa-lock" />Lock Screen
                    </a>
                  </li>
                  <li>
                    <a onClick={this.logout}>
                      <i className="fa fa-power-off" />Logout
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <span className="icon-circle">
                  <i className="fa fa-ellipsis-h" />
                </span>
              </li>
            </ul>
          </div>
        </header>

        <div
          id="hoeapp-container"
          className={minimizedMenuClass}
          style={{ overflow: 'scroll' }}
        >
          <aside id="hoe-left-panel">
            <div className="profile-box">
              <div className="media">
                <a
                  className="pull-left"
                  href="http://gohooey.com/demo/sidebar/bootstrapnavigation/user-profile.html"
                >
                  <img className="rounded-circle" src={avatar} />
                </a>
                <div className="media-body">
                  <h5 className="media-heading">
                    Welcome <span>{name}</span>
                  </h5>
                  <small>UX Designer</small>
                </div>
              </div>
            </div>
            <Menu />
          </aside>
          <section id="main-content">
            <Switch>
              <Route
                exact
                path="/admin/mine"
                component={Loadable({
                  loader: () => import('../Mine/Main'),
                  loading: Loading
                })}
              />
              <Route
                exact
                path="/admin/mine/me"
                component={Loadable({
                  loader: () => import('../Mine/Users/edit'),
                  loading: Loading
                })}
              />
            </Switch>
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  me: meSelect(state, props)
});

const mapActionsToProps = {
  logout
};

export default connect(mapStateToProps, mapActionsToProps)(Page);
