import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Link } from 'react-router-dom';
import Loadable from 'react-loadable';
import Loading from 'components/Loading';
import NotFound from 'components/NotFound';

const AppWraper = () => (
  <div>
    <div>
      <div>
        <Link to="/">回到主页</Link>
      </div>
      <div>
        <Link to="/test">主测</Link>
      </div>
      <div>
        <Link to="/test/editor">编辑器</Link>
      </div>
      <div>
        <Link to="/test/qcloud">腾讯云上传</Link>
      </div>
      <div>
        <Link to="/test/cropper">图片剪切</Link>
      </div>
      <div>
        <Link to="/test/imgbrowser">图片上传浏览</Link>
      </div>
      <div>
        <Link to="/test/amap">地图</Link>
      </div>
      <div>
        <Link to="/test/pagedata">pagedata</Link>
      </div>
      <div>
        <Link to="/test/wmap">测试版地图</Link>
      </div>
      <div>
        <Link to="/test/withmodules">
          测试withModules,加载数据表RESTFUL模块
        </Link>
      </div>
      <div>
        <Link to="/test/about">About</Link>
      </div>
    </div>
    <Switch>
      <Route
        exact
        path="/test"
        component={Loadable({
          loader: () => import('./Main'),
          loading: Loading
        })}
      />
      <Route
        exact
        path="/test/editor"
        component={Loadable({
          loader: () => import('./NewsEditor'),
          loading: Loading
        })}
      />
      <Route
        path="/test/qcloud"
        component={Loadable({
          loader: () => import('./Qcloud'),
          loading: Loading
        })}
      />
      <Route
        path="/test/pagedata"
        component={Loadable({
          loader: () => import('./Pagedata'),
          loading: Loading
        })}
      />
      <Route
        path="/test/withmodules"
        component={Loadable({
          loader: () => import('./TestWithModules'),
          loading: Loading
        })}
      />
      <Route
        path="/test/about"
        component={Loadable({
          loader: () => import('./About'),
          loading: Loading
        })}
      />
      <Route
        exact
        path="/test/cropper"
        component={Loadable({
          loader: () => import('components/cropper/test/CropperDemo'),
          loading: Loading
        })}
      />
      <Route
        exact
        path="/test/imgbrowser"
        component={Loadable({
          loader: () => import('components/ResBrowser'),
          loading: Loading
        })}
      />
      <Route
        exact
        path="/test/amap"
        component={Loadable({
          loader: () => import('./Amap'),
          loading: Loading
        })}
      />
      <Route
        exact
        path="/test/wmap"
        component={Loadable({
          loader: () => import('./AmapWindsome'),
          loading: Loading
        })}
      />
    </Switch>
  </div>
);

export default AppWraper;
