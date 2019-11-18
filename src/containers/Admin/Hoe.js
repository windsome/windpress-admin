// see also http://gohooey.com/demo/sidebar/bootstrapnavigation/hoedemo.html
import React from 'react';
import './Hoe.css';
import './Hoe.scene.color.css';
import { Link } from 'react-router-dom';

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
export const Header = ({ data }) => {
  return (
    <header className="hoe-header">
      <div className="hoe-left-header text-center text-nowrap">
        <Link to="/">
          <i className="fa fa-graduation-cap ml-2" />
          <span>HOE Navigation Menu</span>
        </Link>
        <span className="hoe-sidebar-toggle">
          <a href="#" />
        </span>
      </div>
      <div className="hoe-right-header">
        <i className="fa fa-list-ul hoe-sidebar-toggle" aria-hidden="true" />
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
          <li>
            <span>
              <img
                className="rounded-circle avatar"
                src="/ysj/images/avatar-1.png"
              />
            </span>
            <span className="ml-2 mr-2">windsome.feng</span>
            <i className=" fa fa-angle-down" />
          </li>
          <li>
            <span className="icon-circle">
              <i className="fa fa-ellipsis-h" />
            </span>
          </li>
        </ul>
      </div>
    </header>
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
        <span className="nav-level">Navigation</span>
      </li>
      <li>
        <div className="menu-item active">
          <i className="fa fa-tachometer mr-2" />
          <span className="menu-text">Dashboard</span>
          <span className="selected" />
        </div>
      </li>
      <li>
        <div className="menu-item">
          <i className="fa fa-bar-chart mr-2" />
          <span className="menu-text">Graphs</span>
          <span className="label sul">New</span>
          <span className="selected" />
        </div>
      </li>
      <li>
        <div className="menu-item hoe-has-menu opened">
          <i className="fa fa-files-o mr-2" />
          <span className="menu-text">Other Pages</span>
          <span className="selected" />
        </div>
        <ul className="hoe-sub-menu" style={{ display: 'block' }}>
          <li className="active">
            <div className="menu-item">
              <span className="menu-text">Blank Page</span>
              <span className="selected" />
            </div>
          </li>
          <li>
            <div className="menu-item">
              <span className="menu-text">Login</span>
              <span className="selected" />
            </div>
          </li>
          <li>
            <div className="menu-item">
              <span className="menu-text">User Profile</span>
              <span className="label sul">Updated</span>
              <span className="selected" />
            </div>
          </li>
          <li>
            <div className="menu-item">
              <span className="menu-text">Team Member</span>
              <span className="selected" />
            </div>
          </li>
          <li>
            <div className="menu-item hoe-has-menu">
              <span className="menu-text">level 2</span>
              <span className="selected" />
            </div>
            <ul className="hoe-sub-menu" style={{ display: 'block' }}>
              <li className="">
                <div className="menu-item hoe-has-menu">
                  <span className="menu-text">level 3</span>
                  <span className="selected" />
                </div>
                <ul className="hoe-sub-menu" style={{ display: 'block' }}>
                  <li>
                    <div className="menu-item">
                      <span className="menu-text">level 4</span>
                      <span className="selected" />
                    </div>
                  </li>
                  <li>
                    <div className="menu-item">
                      <span className="menu-text">level 4</span>
                      <span className="selected" />
                    </div>
                  </li>
                </ul>
              </li>
              <li>
                <div className="menu-item">
                  <span className="menu-text">level 3</span>
                  <span className="selected" />
                </div>
              </li>
              <li>
                <div className="menu-item">
                  <span className="menu-text">level 3</span>
                  <span className="selected" />
                </div>
              </li>
              <li>
                <div className="menu-item">
                  <span className="menu-text">level 3</span>
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

export const AppContainer = ({ data }) => {
  return (
    <div className="media hoeapp-container">
      <aside className="hoe-left-panel">
        <div className="inner-scrollable">
          <div className="profile-box">
            <ProfileBox />
          </div>
          <Menu />
        </div>
      </aside>
      <section className="media-body main-content" />
    </div>
  );
};

export default () => {
  return (
    <div className="hoeapp-wrapper">
      <Header />
      <AppContainer />
    </div>
  );
};
