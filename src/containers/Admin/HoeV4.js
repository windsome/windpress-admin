// see also http://gohooey.com/demo/sidebar/bootstrapnavigation/hoedemo.html
import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';
import Loadable from 'react-loadable';
import Loading from 'components/Loading';
import NotFound from 'components/NotFound';
import './HoeThird.css';
import './HoeNextHeader.css';
// //import './Hoe.scene.color.css';

import { logout } from 'modules/user';
import { meSelect } from 'selectors/user';

const origMenu = [
  { name: '导航', isStatic: true },
  { name: '总览', link: '/admin/dashboard', icon: 'fa fa-tachometer' },
  {
    name: '查看个人信息',
    link: '/admin/me',
    icon: 'fa fa-bar-chart',
    isNew: true
  },
  {
    name: '我的消息',
    icon: 'fa fa-envelope-open-o',
    subs: [
      { name: '收件箱', link: '/admin/message/inbox', isNew: true },
      { name: '发件箱', link: '/admin/message/outbox' }
    ]
  },
  {
    name: '我是买家',
    icon: 'fa fa-shopping-cart',
    subs: [
      {
        name: '已买到的宝贝',
        subs: [
          { name: '我的课程', link: '/admin/buy/products?type=课程' },
          { name: '我的试听课', link: '/admin/buy/products?type=试听课' },
          { name: '我的比赛考级', link: '/admin/buy/products?type=比赛' }
        ]
      },
      { name: '我的收藏', link: '/admin/buy/' },
      { name: '我的投票', link: '/admin/buy/votes' },
      { name: '评价管理', link: '/admin/buy/comments' },
      { name: '我的足迹', link: '/admin/buy/footprint', isUpdate: true }
    ]
  },
  {
    name: '我是卖家',
    icon: 'fa fa-shopping-bag',
    subs: [
      { name: '门店管理', link: '/admin/sell/shops' },
      { name: '商品管理', link: '/admin/sell/products', isUpdate: true },
      { name: '订单管理', link: '/admin/sell/orders' },
      { name: '评价管理', link: '/admin/sell/comments' }
    ]
  },
  {
    name: '我是教师',
    icon: 'fa fa-graduation-cap',
    subs: [
      { name: '销课系统', link: '/admin/teacher/courses' },
      { name: '签约机构教师', link: '/admin/teacher/shops' },
      { name: '评价管理', link: '/admin/teacher/comments', isUpdate: true }
    ]
  },
  {
    name: '我是超级管理员',
    icon: 'fa fa-users',
    subs: [
      { name: '会员管理', link: '/admin/root/users' },
      { name: '商户管理', link: '/admin/root/shops' },
      { name: '商品管理', link: '/admin/root/products', isUpdate: true },
      { name: '销课管理', link: '/admin/root/courses', isUpdate: true },
      { name: '教师管理', link: '/admin/root/teachers', isUpdate: true },
      { name: '投票管理', link: '/admin/root/votes', isUpdate: true },
      { name: '评价管理', link: '/admin/root/comments', isUpdate: true }
    ]
  },
  {
    name: '系统设置',
    icon: 'fa fa-wrench',
    subs: [
      { name: '申请成为商户', link: '/admin/system/tobeshop' },
      { name: '申请成为教师', link: '/admin/system/tobeteacher' },
      { name: '联系客服', link: '/admin/system/kefu', isUpdate: true },
      { name: '我要调试', link: '/admin/system/debug', isUpdate: true },
      {
        name: '二级菜单',
        subs: [
          {
            name: '三级菜单',
            subs: [
              { name: '四级菜单', link: '/admin/system/level41' },
              { name: '四级菜单', link: '/admin/system/level42' },
              { name: '四级菜单', link: '/admin/system/level43' },
              { name: '四级菜单', link: '/admin/system/level44' }
            ]
          },
          { name: '三级菜单', link: '/admin/system/level32' },
          { name: '三级菜单', link: '/admin/system/level33' }
        ]
      },
      { name: '二级菜单', link: '/admin/system/level22', isUpdate: true },
      { name: '二级菜单', link: '/admin/system/level23', isUpdate: true }
    ]
  }
];
const initMenu = menu => {
  let setIds = (menus, parent) => {
    for (let i = 0; i < menus.length; i++) {
      let item = menus[i];
      item.ids = [...parent, i];
      if (item.subs) {
        setIds(item.subs, item.ids);
      }
    }
  };
  setIds(menu, []);
  console.log('after setIds:', menu);
  return menu;
};

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
const LeftNavbar = () => (
  <ul className="left-navbar">
    <li className="dropdown">
      <span className="icon-circle">
        <i className="fa fa-envelope-o" />
        <span className="badge badge-danger">5</span>
      </span>
      <ul className="dropdown-menu">
        <li>
          <Link to="/admin/self">
            <i className="fa fa-user" />个人信息
          </Link>
        </li>
        <li>
          <Link to="/admin/message/inbox">
            <i className="fa fa-envelope-open-o" />我的收件箱
            <span className="badge badge-danger"> 3 </span>
          </Link>
        </li>
      </ul>
    </li>
    <li className="dropdown">
      <span className="icon-circle">
        <i className="fa fa-envelope-o" />
        <span className="badge badge-danger">5</span>
      </span>
      <ul className="dropdown-menu">
        <li>
          <Link to="/admin/self">
            <i className="fa fa-user" />个人信息
          </Link>
        </li>
        <li>
          <Link to="/admin/message/inbox">
            <i className="fa fa-envelope-open-o" />我的收件箱
            <span className="badge badge-danger"> 3 </span>
          </Link>
        </li>
        <li>
          <Link to="/admin/message/outbox">
            <i className="fa fa-rocket" />我的任务
            <span className="badge badge-success"> 7 </span>
          </Link>
        </li>
      </ul>
    </li>
    <li>
      <SearchBar />
    </li>
  </ul>
);
const RightNavbar = ({ name, avatar }) => {
  return (
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
            <Link to="/admin/self">
              <i className="fa fa-user" />个人信息
            </Link>
          </li>
          <li>
            <Link to="/admin/message/inbox">
              <i className="fa fa-envelope-open-o" />我的收件箱
              <span className="badge badge-danger"> 3 </span>
            </Link>
          </li>
          <li>
            <Link to="/admin/message/outbox">
              <i className="fa fa-rocket" />我的任务
              <span className="badge badge-success"> 7 </span>
            </Link>
          </li>
          <li>
            <a onClick={this.logout}>
              <i className="fa fa-power-off" />退出
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
  );
};

const ProfileBox = ({
  avatar = '/ysj/images/avatar-1.png',
  name,
  title = 'UX Designer'
}) => {
  return (
    <div className="media">
      <img className="rounded-circle avatar" src={avatar} />
      <div className="media-body ml-3">
        <h5 className="media-heading">
          Welcome <span>{name}</span>
        </h5>
        <small>{title}</small>
      </div>
    </div>
  );
};

const MenuItemInner = ({ to, setOpen, ...props }) => {
  if (to) {
    return <Link {...props} to={to} />;
  } else {
    return <div {...props} onClick={setOpen} />;
  }
};

export const Menu = ({ menu, current, opened, setOpen }) => {
  menu = cloneDeep(menu);

  let getActive = (menus, url) => {
    for (let i = 0; i < menus.length; i++) {
      let item = menus[i];
      if (item.link == url) {
        return [i];
      }
      if (item.subs) {
        let subOpen = getActive(item.subs, url);
        if (subOpen) {
          return [i, ...subOpen];
        }
      }
    }
  };
  let active = getActive(menu, current);
  if (active) {
    let currentMenus = menu;
    for (let i = 0; i < active.length; i++) {
      let index = active[i];
      currentMenus[index].isOpen = true;
      if (i == active.length - 1) {
        currentMenus[index].isActive = true;
      }
      currentMenus = currentMenus[index].subs;
    }
  }
  if (opened) {
    let currentMenus = menu;
    for (let i = 0; i < opened.length; i++) {
      let index = opened[i];
      currentMenus[index].isOpen = true;
      currentMenus = currentMenus[index].subs;
    }
  }
  console.log('active:', active, ', opened:', opened, ', menu:', menu);

  let renderItem = data => {
    if (data.isStatic) {
      return (
        <li>
          <span className="nav-level">{data.name}</span>
        </li>
      );
    }
    let itemClass = '';
    let uiSubMenu = null;
    if (data.subs) {
      itemClass = 'hoe-has-menu';
      uiSubMenu = data.subs.map(item => renderItem(item));
    }
    if (data.isOpen) {
      itemClass += ' opened';
    }
    if (data.isActive) {
      itemClass += ' active';
    }

    return (
      <li className={itemClass}>
        <MenuItemInner
          className="menu-item"
          to={data.link}
          setOpen={evt => setOpen(data.ids)}
        >
          {data.icon && <i className={data.icon + ' mr-2'} />}
          <span className="menu-text">{data.name}</span>
          <span className="selected" />
        </MenuItemInner>
        <ul className="hoe-sub-menu">{uiSubMenu}</ul>
      </li>
    );
  };

  let uiMenus = menu.map(item => renderItem(item));
  return <ul className="menu"> {uiMenus} </ul>;
};

export class Page extends React.Component {
  state = {
    deviceType: 'desktop', //'desktop','phone'
    minimizedMenu: false,
    opened: null
  };
  constructor() {
    super();
    this.toggleLeftPanel = this.toggleLeftPanel.bind(this);
    this.logout = this.logout.bind(this);
    this.menu = initMenu(origMenu);
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
    let { me, match, location } = this.props;
    let { account, phone, desc, extend } = me || {};
    let { name, address } = desc || {};
    let { nickname, headimgurl } = extend || {};
    name = name || nickname || account;
    let avatar = headimgurl || '/ysj/images/avatar-1.png';

    console.log('match:', match, ', location:', location);
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
            <LeftNavbar />
            <RightNavbar avatar={avatar} name={name} />
          </div>
        </header>

        <div
          id="hoeapp-container"
          className={minimizedMenuClass}
          style={{ overflow: 'scroll' }}
        >
          <aside id="hoe-left-panel">
            <div className="profile-box">
              <ProfileBox avatar={avatar} name={name} title="UX Designer" />
            </div>
            <Menu
              menu={this.menu}
              current={location.pathname}
              opened={this.state.opened}
              setOpen={opened => this.setState({ opened })}
            />
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
                path="/admin/me"
                component={Loadable({
                  loader: () => import('../Mine/Users/edit'),
                  loading: Loading
                })}
              />
              <Route
                path="/admin/sell/shops"
                component={Loadable({
                  loader: () => import('../Mine/Shops/list'),
                  loading: Loading
                })}
              />
              <Route
                path="/admin/sell/products"
                component={Loadable({
                  loader: () => import('../Mine/Products'),
                  loading: Loading
                })}
              />
              <Route
                path="/admin/sell/orders"
                component={Loadable({
                  loader: () => import('../Mine/Orders'),
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
