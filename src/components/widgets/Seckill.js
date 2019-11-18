import React from 'react';
import moment from 'moment';

import withTimely from 'components/hoc/withTimely';
import { getNicePriceFromCent } from 'utils/price';

import './FileInput.css';
import './Seckill.css';

const Sessions = [
  { start: 0, duration: 6 },
  { start: 6, duration: 2 },
  { start: 8, duration: 2 },
  { start: 10, duration: 2 },
  { start: 12, duration: 2 },
  { start: 14, duration: 2 },
  { start: 16, duration: 2 },
  { start: 18, duration: 2 },
  { start: 20, duration: 2 },
  { start: 22, duration: 2 }
];

export const ImageSquare = ({ src }) => {
  return (
    <div className="image_closable_wrapper">
      <div className="fileinput" style={{ opacity: 1 }}>
        <img src={src} className="preview img-thumbnail" alt={src} />
      </div>
    </div>
  );
};

const CountDown = ({ xTimeCount }) => {
  let now = new Date();
  let hour = moment().hour();
  let currentSession = null;
  for (let i = 0; i < Sessions.length; i++) {
    let session = Sessions[i];
    if (hour >= session.start && hour < session.start + session.duration) {
      currentSession = session;
      break;
    }
  }
  let finishDate = moment(now)
    .millisecond(0)
    .second(0)
    .minute(0)
    .hour(currentSession.start + currentSession.duration)
    .toDate();

  let diff = finishDate.getTime() - now.getTime();
  let duration = moment.duration(diff);
  let hours = parseInt(duration.asHours());
  let strHours = hours < 10 ? '0' + hours : hours;
  let strMinutes =
    duration.minutes() < 10 ? '0' + duration.minutes() : duration.minutes();
  let strSeconds =
    duration.seconds() < 10 ? '0' + duration.seconds() : duration.seconds();

  return (
    <span>
      <span className="pr-1 small">{currentSession.start + '点场'}</span>
      <span className="pr-1 small">
        <span>{strHours}</span>
        <span> : </span>
        <span>{strMinutes}</span>
        <span> : </span>
        <span>{strSeconds}</span>
      </span>
    </span>
  );
};

export const TimelyCountDown = withTimely(1)(CountDown);

export const SeckillPreview = ({ data }) => {
  data = data || [
    {
      priceOrigin: 100,
      priceSeckill: 0,
      image: '/ysj/images/seckill.jpg'
    },
    {
      priceOrigin: 100,
      priceSeckill: 0,
      image: '/ysj/images/seckill.jpg'
    },
    {
      priceOrigin: 100,
      priceSeckill: 0,
      image: '/ysj/images/seckill.jpg'
    }
  ];

  let uiSeckills = data.map((item, index) => {
    let image = item.image;
    let priceOrigin = getNicePriceFromCent(item.priceOrigin);
    let priceSeckill = getNicePriceFromCent(item.priceSeckill);
    return (
      <div key={index} className="col-4">
        <ImageSquare src={image} />
        <div className="pl-1">
          <span className="cur"> {'¥' + priceSeckill}</span>
          <span className="past">{'¥' + priceOrigin}</span>
        </div>
      </div>
    );
  });

  return (
    <div className="seckill bg-white p-1">
      <div>
        <span className="pr-1 small text-dp-pink">秒杀</span>
        <TimelyCountDown />
      </div>
      <div className="container-fluid jumbotron-fluid">
        <div className="row no-gutters">{uiSeckills}</div>
      </div>
    </div>
  );
};

export default SeckillPreview;
