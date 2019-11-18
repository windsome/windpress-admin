import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';

import { MenuItem } from 'components/widgets/Menu';
import FileInput from 'components/widgets/FileInput';

import './step0.css';

export const Step0Part1 = ({ next = '/mine/shops/create/step1' }) => {
  return (
    <div>
      <h5 className="d-block">
        <strong>成为艺术加商户，让你在电视上免费做广告</strong>
      </h5>
      <small className="d-block">
        开启艺术教育培训的高效之旅，通过电视传播你的课程，让更多人认识您。
      </small>
      <br />
      <div>
        <Link to={next} className="btn btn-primary btn-large">
          开始吧
        </Link>
      </div>
    </div>
  );
};

export const Step0Part2 = () => {
  return (
    <div className="step0part2">
      <div className="mt-1 mb-1">
        <small className="d-block text-center mb-3">
          成为商家需要准备哪些资料？
        </small>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <span className="border-warning rounded-circle number">1</span>
            <span className="ml-2">（必要）营业执照清晰照片</span>
          </div>
          <div className="col-12 col-sm-3">
            <img
              className="img-fluid"
              src="https://a0.muscache.com/airbnb/static/slash_host/never_a_stranger-91db63c401ad8301408ec3f24fd0f113.jpg"
            />
          </div>
          <div className="col-12 col-sm-9">
            <div className="small text-para">
              您将需要填写房源描述、拍摄及上传照片，并决定住宿价格。房源页面能够让房客对您的空间有一个大致的了解。
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12">
            <span className="border-warning rounded-circle number">2</span>
            <span className="ml-2">（必要）营业场所照片至少1张</span>
          </div>
          <div className="col-12 col-sm-3">
            <img
              className="img-fluid"
              src="https://a0.muscache.com/airbnb/static/slash_host/never_a_stranger-91db63c401ad8301408ec3f24fd0f113.jpg"
            />
          </div>
          <div className="col-12 col-sm-9">
            <div className="small text-para">
              您可以为房源设置可订状态和制定《房屋守则》。出租控制条件和日历设置可以帮助您更轻松地出租。
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12">
            <span className="border-warning rounded-circle number">3</span>
            <span className="ml-2">（可选）广告视频或图片若干</span>
          </div>
          <div className="col-12 col-sm-3">
            <img
              className="img-fluid"
              src="https://a0.muscache.com/airbnb/static/slash_host/never_a_stranger-91db63c401ad8301408ec3f24fd0f113.jpg"
            />
          </div>
          <div className="col-12 col-sm-9">
            <div className="small text-para">
              您可以为房源设置可订状态和制定《房屋守则》。出租控制条件和日历设置可以帮助您更轻松地出租。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Page = ({ match }) => {
  return (
    <div>
      <div className="container-fluid jumbotron-fluid">
        <div className="row no-gutters">
          <div className="col-12">
            <div className="header__photo" />
            <div className="col-sm-12 col-md-6 col-lg-5 bg-babu pt-3 pb-3 m-0 m-sm-2">
              <Step0Part1 next={`${match.url}/step1`} />
            </div>
          </div>
          <div className="col-12 mt-5">
            <Step0Part2 />
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(null, { push })(Page);
