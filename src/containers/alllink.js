import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';

export default class App extends Component {
  render() {
    let menus = [
      { name: '首页', link: '/' },
      { name: '测试关于页面', link: '/about-us' },
      { name: '测试async方法', link: '/test' },
      { name: 'widgets测试页面', link: '/widgets' },
      { name: '应用主页', link: '/app' },
      { name: '店铺列表', link: '/app/shoplist' },
      { name: '店铺详情', link: '/app/shop' },
      { name: '个人中心', link: '/mine' },
      { name: '超级管理中心', link: '/admin' }
    ];
    let uis = menus.map((item, index) => {
      return (
        <div className="col-12" key={index}>
          <Link to={item.link}>{item.name}</Link>
        </div>
      );
    });
    return (
      <div>
        <div>
          <h2>所有测试链接：</h2>
        </div>
        <div className="container">
          <div className="row">{uis}</div>
        </div>
      </div>
    );
  }
}
