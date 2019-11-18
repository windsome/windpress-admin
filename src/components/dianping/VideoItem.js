import React from 'react';
import { Link } from 'react-router-dom';
import './VideoItem.css';

export const VideoItem = ({ item }) => {
  item = item || {
    attributeName: '炫技能',
    categoryName: '绘画',
    contentId: 2596,
    defaultPic:
      'https://p0.meituan.net/merchantpic/981882e84723db61530f3310a0f46a2f887386.jpg%40280w_200h_1e_1c_1l%7Cwatermark%3D0',
    detailLink:
      'https://g.dianping.com/app/app-education-cms-c/cms_detail.html?cmsId=2596&source=dianping',
    duration: '02:32',
    likeCount: 0,
    videoId: 33182,
    videoTitle: '超燃的战狼2，她的第一次献给了吴京！！！'
  };

  return (
    <div className="videoItem">
      <div className="shadowBox">
        <div className="picBox">
          <img className="img-fluid" src={item.defaultPic} />
          <div className="videoIcon">
            <i className="fa fa-play" />
            {item.duration}
          </div>
        </div>
        <div className="videoName text-truncate">{item.videoTitle}</div>
        <div className="videoTagBox">
          <span className="videoTagItem">{item.categoryName}</span>
          <span className="videoTagItem">{item.attributeName}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoItem;
