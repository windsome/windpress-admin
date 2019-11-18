import React from 'react';
import { Link } from 'react-router-dom';
import Carousel, { VerticalCarousel } from 'components/widgets/Carousel';
import { dataUrlSvgWithSize } from 'components/widgets/_SvgWithSize';
import './bak.dp.index.css';

export const MainMenu = ({ items }) => {
  items = [
    { name: '免费试听', icon: 'fa fa-heart-o', to: '/coin/shop' },
    { name: '比赛', icon: 'fa fa-jpy', to: '/coin/shop' },
    { name: '考级', icon: 'fa fa-user-o', to: '/coin/shop' },
    { name: '艺教资讯', icon: 'fa fa-heart-o', to: '/coin/shop' },
    { name: '家长课堂', icon: 'fa fa-heart-o', to: '/coin/shop' },
    { name: '精品课程', icon: 'fa fa-heart-o', to: '/coin/shop' },
    { name: '优选活动', icon: 'fa fa-heart-o', to: '/coin/shop' },
    { name: '艺术商城', icon: 'fa fa-heart-o', to: '/coin/shop' }
  ];

  let uis =
    items &&
    items.map((item, index) => {
      return (
        <div className="menu-item" key={index}>
          <Link to={item.to} className="menu-active">
            <div>
              <span className={'menu-icon ' + item.icon} />
            </div>
            <div className="menu-text">{item.name}</div>
          </Link>
        </div>
      );
    });
  return <div className="container">{uis}</div>;
};

export const Advertise1 = ({ item }) => {
  item = {
    //img: svgDataUrl(genSvgWithSize(720, 160)),
    img: dataUrlSvgWithSize(720, 160),
    to: '/coin/1'
  };
  return (
    <Link to={item.to}>
      <img src={item.img} className="img-fluid" alt="Responsive image" />
    </Link>
  );
};

export const Advertise3 = ({ item1, item2, item3 }) => {
  return (
    <div
      className="vc-flexbox"
      style={{ backgroundColor: 'rgb(204, 232, 207)' }}
    >
      <div className="ad3-left vc-flexbox vc-flexbox-vertical vc-align-items-center">
        <div className="ad-nolive-title">厌学拯救者</div>
        <div className="ad-nolive-subtitle vc-flexbox vc-align-items-center">
          全场0.1元起
        </div>
        <div className="ad3-nolive-pic">
          <img src="/ysj/test/160x160-1.png" className="img-fluid" />
        </div>
      </div>
      <div className="ad3-right vc-flexbox vc-flexbox-vertical">
        <div className="operation2 vc-flexbox">
          <div className="operation2-left vc-flex-1">
            <div className="operation2-left-title ">跳槽充电宝</div>
            <div className="operation2-left-subtitle ">求职最惠必杀技</div>
          </div>
          <div className="operation2-right ">
            <img src="/ysj/test/160x160-2.png" className="img-fluid" />
          </div>
        </div>
        <div className="operation3 vc-flexbox vc-tline-d7">
          <div className="operation3-left vc-flex-1">
            <div className="operation3-left-title ">抢VR眼镜</div>
            <div className="operation3-left-subtitle ">洞察精彩世界</div>
          </div>
          <div className="operation3-right ">
            <img src="/ysj/test/160x160-3.png" className="img-fluid" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12" style={{ overflow: 'hidden' }}>
          <div className="bd-example">
            <Carousel />
          </div>
        </div>
        <div className="col-12" style={{ overflow: 'hidden' }}>
          <MainMenu />
        </div>
        <div
          className="col-12"
          style={{ overflow: 'hidden', height: '1.5rem' }}
        >
          <VerticalCarousel />
        </div>
        <div className="col-12">
          <Advertise1 />
        </div>
        <div className="col-12">
          <Advertise3 />
        </div>
      </div>
    </div>
  );
};
