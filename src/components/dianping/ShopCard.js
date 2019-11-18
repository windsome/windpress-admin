import React from 'react';
import { Link } from 'react-router-dom';
import isNull from 'lodash/isNull';
import toPairs from 'lodash/toPairs';
import cx from 'classnames';

import { FiveStarSvg } from 'components/widgets/FiveStar';
import Gap from 'components/widgets/Gap';
import FlagArrow from './FlagArrow';
import { gpsDistance, strDistance } from 'utils/gps';
import './ShopCard.css';

export const Album = ({ data }) => {
  let defImg =
    'http://p0.meituan.net/education/20f03800a7a235166d38fdf2ff3c9a7489816.jpg%40160w_100h_1e_1c_1l%7Cwatermark%3D0';
  let defUrl =
    'http://h5.dianping.com/app/gfe-app-education-video-list-c/videolist.html?shopId=4057474&amp;source=dianping';
  let defaultData = [
    {
      img: defImg,
      url: defUrl,
      isVideo: true
    },
    {
      img: defImg,
      url: defUrl
    },
    {
      img: defImg,
      url: defUrl
    },
    {
      img: defImg,
      url: defUrl
    },
    {
      img: defImg,
      url: defUrl
    },
    {
      img: defImg,
      url: defUrl
    }
  ];

  //data = data || defaultData;
  let uis =
    data &&
    data.map((item, index) => {
      let isVideo = item && item.isVideo;
      return (
        <li key={index} className="itemwrap">
          <Link to={item.url} className={cx({ item: true, video: isVideo })}>
            <img className="image" src={item.img} />
            {isVideo && <i className="fa fa-play-circle-o icon-shop" />}
          </Link>
        </li>
      );
    });
  return <ul className="album2">{uis}</ul>;
};

export const ShopCard = ({ data, ops }) => {
  let {
    id,
    status,
    name = '未命名店铺',
    address = '未填写地址',
    lng,
    lat,
    tags,
    desc,
    extend,
    owner,
    managers,

    province,
    city,
    district,
    business,
    avg,
    bookingCount = 0,
    ratingCount = 0,
    ratingScore = 0,
    ratingDetail,
    refund,
    authed,
    deposit
  } =
    data || {};
  let { phone = '未填电话', content = '未填内容', license, region } =
    desc || {};
  let { images, videos, ads } = extend || {};

  ratingDetail = ratingDetail || { 效果: 8.7, 师资: 8.8, 环境: 8.8 };
  business = business || region || ['南京东路', '人民广场'];
  refund = refund || ['过期退', '随时退'];
  let dataImages =
    (images &&
      images.map(item => {
        return {
          img: item.url,
          url: '/app/shop/res/' + id
        };
      })) ||
    [];
  let dataVideos =
    (videos &&
      videos.map(item => {
        return {
          img: item.url,
          url: '/app/shop/res/' + id,
          isVideo: true
        };
      })) ||
    [];
  let dataResource = [...dataImages, ...dataVideos];
  let ratingDetailArr = toPairs(ratingDetail);
  let uiRatingDetail =
    ratingDetailArr &&
    ratingDetailArr.map((item, index) => {
      return (
        <span key={index} className="comment mr-1">
          {item[0] + ':' + item[1]}
        </span>
      );
    });
  let uiBusiness =
    business &&
    business.map((item, index) => {
      return (
        <span key={index} className="comment mr-1">
          {item}
        </span>
      );
    });

  let uiTags =
    tags &&
    tags.map((item, index) => {
      return (
        <span key={index} className="border border-primary tag">
          {item}
        </span>
      );
    });

  let uiRefund =
    refund &&
    refund.map((item, index) => {
      return (
        <span key={index}>
          <i className="fa fa-check" />
          {item}
        </span>
      );
    });

  return (
    <div>
      <div className="intro">
        <div className="shop-name">{name}</div>
        <div className="shop-info">
          <FiveStarSvg value={ratingScore} />
          <span className="comment">{ratingCount + '条'}</span>
          {authed > 0 && (
            <div className="verify">
              <i />
              <span>认证</span>
            </div>
          )}
          <span className="booking">{bookingCount + '人已预约'}</span>
        </div>
        <div className="shop-info">{uiRatingDetail}</div>
        {/*<a href="javascript:;" className="mod-link" />*/}
      </div>
      <div className="clearfix">
        <Album data={dataResource} />
      </div>
      <Gap width={1} />
      <div className="location">
        <i className="fa fa-map-marker" />
        <div className="address">
          <span className="main-address">{address}</span>
          <span className="second-address">{uiBusiness}</span>
        </div>
        <i className="fa fa-angle-right" aria-hidden="true" />
      </div>
      <Gap width={1} />
      <div className="location">
        <i className="fa fa-phone" />
        <div className="address">
          <span className="main-address">{phone}</span>
        </div>
        <div>
          <span className="phone-right">免费咨询</span>
          {/*<i className="fa fa-angle-right" aria-hidden="true" />*/}
        </div>
      </div>
      <Gap width={1} />
      <div className="hd">
        <div className="left">
          <span className="icon_ke" />
          <span className="titleText">本店课程</span>
        </div>
        <div className="right">{uiRefund}</div>
      </div>
      <div className="tagBox">{uiTags}</div>
      <Gap width={1} />
    </div>
  );
};
export default ShopCard;
