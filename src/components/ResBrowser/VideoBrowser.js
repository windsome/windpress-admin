import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cx from 'classnames';
import { ImageUploaderSvg } from './ImageUploader';
import { Player } from 'video-react';
import DivideLine from '../widgets/Line';
import { uploadCombinedFileInput } from 'utils/upload';
import './ImageBrowser.css';
let xdebug = window.myDebug('app:ResBrowser');

const VideoPlayer = ({ src }) => (
  <Player>
    <source src={src} />
  </Player>
);
const Image = ({ src }) => (
  <div className="img_cont d-block">
    <VideoPlayer src={src} />
  </div>
);

const ImageCell = ({ src, selected = false, ops = null }) => (
  <div className={cx({ img_cell: true, hover: selected })}>
    <div className="" style={{ height: 160, position: 'relative' }}>
      <Image src={src} />
    </div>
    <div className="img_info">
      <div className="px-2" style={{ top: '20%', position: 'absolute' }}>
        <div style={{ fontSize: '1.5rem', height: '1.5rem' }}>
          {!selected &&
            ops &&
            ops.select && (
              <span className="pr-2" onClick={ops.select}>
                <i className="fa fa-plus-square-o" />
              </span>
            )}
          {selected &&
            ops &&
            ops.unselect && (
              <span className="pr-2" onClick={ops.unselect}>
                <i className="fa fa-check-square-o" />
              </span>
            )}
          {ops &&
            ops.remove && (
              <span className="pr-2" onClick={ops.remove}>
                <i className="fa fa-times-rectangle-o" />
              </span>
            )}
        </div>
        <div className="px-2 text-truncate" style={{ height: '1rem' }}>
          <span className="pr-2">...133.jpg</span>
          <span className="pr-2">{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  </div>
);

/**
  props{
    images: [
      '/ysj/images/slide1.jpg',
      '/ysj/images/slide2.jpg',
      '/ysj/images/slide3.jpg',
      '/ysj/images/slide4.jpg',
      '/ysj/images/slide5.jpg',
      '/ysj/images/headnews.jpeg',
      '/ysj/images/headnews2.jpeg',
      '/ysj/images/cert1.jpg',
      '/ysj/images/avatar-1.png',
      '/ysj/images/test1.gif',
      '/ysj/images/logo.png',
      '/ysj/images/logo2.png'
    ],
    upload: (evt, isWechat) => {
      let { images } = this.state;
      uploadCombinedFileInput(evt, { isWechat }).then(result => {
        console.log('uploadImage:', result);
        let img = result[0];
        this.setState({ images: _.uniq(_.concat(images, img.url)) });
      });
    }

  }
 */
export class Browser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selects: []
    };
  }

  // uploadImage = (evt, isWechat) => {
  //   let { images } = this.state;
  //   uploadCombinedFileInput(evt, { isWechat }).then(result => {
  //     console.log('uploadImage:', result);
  //     let img = result[0];
  //     this.setState({ images: _.uniq(_.concat(images, img.url)) });
  //   });
  // }

  renderList() {
    let { resources, remove } = this.props;
    let { selects } = this.state;
    let uiImages = resources.map((image, index) => {
      let ops = {
        select: evt => {
          this.setState({ selects: _.uniq(_.concat(selects, image)) });
        },
        unselect: evt => {
          this.setState({ selects: _.without(selects, image) });
        },
        remove: evt => {
          remove(image);
          //this.setState({ images: _.without(images, image) });
        }
      };
      let selected = _.indexOf(selects, image) >= 0;
      return (
        <div key={index} className="col-6 col-sm-4 col-md-3 col-lg-2 px-1">
          <ImageCell src={image} selected={selected} ops={ops} />
        </div>
      );
    });
    return (
      <div className="container-fluid">
        <div className="row">{uiImages}</div>
      </div>
    );
  }

  render() {
    let { use, upload, getNext } = this.props;
    let { selects } = this.state;
    return (
      <div className="bg-white">
        <div>
          <span
            className="align-middle mr-3"
            style={{ width: 40, height: 40, display: 'inline-block' }}
          >
            <ImageUploaderSvg doUpload={upload} accept="video/*" />
          </span>
          <span>{'已选中' + selects.length + '个'}</span>
          <button
            onClick={evt => {
              evt.preventDefault();
              use(selects);
            }}
          >
            确定
          </button>
        </div>
        {this.renderList()}
        <div style={{ textAlign: 'center', color: '#ccc' }}>
          ---------<span style={{ padding: '0 20px' }} onClick={getNext}>
            查看更多
          </span>---------
        </div>
        <div>
          <span
            className="align-middle mr-3"
            style={{ width: 40, height: 40, display: 'inline-block' }}
          >
            <ImageUploaderSvg doUpload={upload} accept="video/*" />
          </span>
          <span>{'已选中' + selects.length + '个'}</span>
          <button
            onClick={evt => {
              evt.preventDefault();
              use(selects);
            }}
          >
            确定
          </button>
        </div>
        <DivideLine className="text-center">
          <span>有底线的</span>
        </DivideLine>
      </div>
    );
  }
}

Browser.propTypes = {
  resources: PropTypes.array.isRequired,
  upload: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  //getFirst: PropTypes.func.isRequired,
  getNext: PropTypes.func.isRequired,
  use: PropTypes.func.isRequired,
  title: PropTypes.string
};

export default Browser;
