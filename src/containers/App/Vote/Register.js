import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';
import _ from 'lodash';

import ImageClosable from 'components/widgets/ImageClosable';
import { ImageUploaderV2 } from 'components/widgets/FileInput';
import { uploadCombinedFileInput } from 'utils/upload';

import { meSelect } from 'selectors/user';
import {
  create as createOption,
  get as getOption,
  update as updateOption,
  retrieve as retrieveOptions
} from 'modules/voteOption';
import { dbSelect as dbOptionSelect } from 'selectors/voteOption';

import './List.css';

export class Page extends React.Component {
  constructor() {
    super();
    this.createOption = this.createOption.bind(this);
  }
  state = {};

  componentDidMount() {
    let { match, dbOption } = this.props;
    let optionId = match.params && match.params.optionId;
    if (optionId) {
      let option = dbOption && optionId && dbOption[optionId];
      let { desc } = option || {};
      let { name, content, images, phone } = desc || {};
      this.setState({ name, content, images, phone });
    }
  }

  getMyQs(match, me) {
    let id = match && match.params && match.params.id;
    let owner = me && me.id;
    if (owner && id) return 'voteId=' + id + ';owner=' + owner;
    else return null;
  }

  createOption() {
    let {
      me,
      match,
      createOption,
      getOption,
      updateOption,
      retrieveOptions,
      push
    } = this.props;
    let { id: voteId, optionId } = (match && match.params) || {};
    voteId = voteId && parseInt(voteId);
    optionId = optionId && parseInt(optionId);
    let { name, content, images, phone } = this.state;
    let nextImages =
      images &&
      images.map((item, index) => {
        return { url: item.url };
      });
    let args = {
      voteId,
      desc: {
        name,
        content,
        images: nextImages,
        phone
      }
    };
    if (optionId) {
      updateOption(optionId, args)
        .then(ret => {
          console.log('update:', ret);
          return getOption(optionId);
        })
        .then(ret => {
          console.log('get:', ret);
          let optionId = ret && ret.id;
          if (optionId) {
            push('/app/vote/' + voteId + '/' + optionId);
          }
        })
        .catch(error => {
          this.setState({
            errMsg: '更新失败！ ' + error.message
          });
          console.log('create fail:', error);
        });
    } else {
      createOption(args)
        .then(ret => {
          optionId = ret.id;
          return optionId;
        })
        .then(ret => {
          let qsMy = this.getMyQs(match, me);
          return retrieveOptions(qsMy);
        })
        .then(ret => {
          console.log('get:', ret, ', optionId:', optionId);
          if (optionId) {
            push('/app/vote/' + voteId + '/' + optionId);
          }
        })
        .catch(error => {
          this.setState({
            errMsg: '创建失败！ ' + error.message
          });
          console.log('create fail:', error);
        });
    }
  }

  uploadImages(imgList) {
    let { images } = this.state;
    let nImages = (images && images.slice(0)) || [];
    nImages = nImages.concat(imgList);
    //console.log('nImages:', nImages, imgList);
    this.setState({ images: nImages });
  }
  removeImageIndex(index) {
    let { images } = this.state;
    let nImages = (images && images.slice(0)) || [];
    nImages.splice(index, 1);
    //console.log('removeImageIndex:', index, nImages, images);
    this.setState({ images: nImages });
  }

  render() {
    let { match, me } = this.props;
    let { name, content, phone, images = [], errMsg } = this.state;

    // if (!me) {
    //   return <div>请用微信登录</div>;
    // }

    let { params } = match || {};
    let id = params && params.id;
    let updateVote = args => {
      this.setState({ ...args });
    };

    let imageCount = (images && images.length) || 0;
    let remainCount = 3 - imageCount;
    images = (images && images.slice(0, 3)) || null;
    let uiImages =
      images &&
      images.map((image, index) => {
        if (!image) return null;
        let src = image.src || image.url;
        return (
          <div
            key={index}
            className="col-4 col-sm-2 p-1"
            style={{ paddingBottom: '100%' }}
          >
            <ImageClosable
              src={src}
              onClose={() => this.removeImageIndex(index)}
            />
          </div>
        );
      });

    return (
      <div className="p-3 m-3 bg-white">
        <div className="position-relative text-center legend-wrapper">
          <div className="legend-header" />
          <span className="d-block bg-white px-2 position-relative">
            选手报名
          </span>
        </div>
        <div>
          <div className="form-group">
            <label>参赛者姓名</label>
            <input
              type="input"
              className="form-control"
              value={name}
              placeholder="输入姓名"
              onChange={evt => updateVote({ name: evt.target.value })}
            />
          </div>
          <div className="form-group">
            <label>描述</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="输入介绍信息"
              value={content}
              onChange={evt => updateVote({ content: evt.target.value })}
            />
          </div>
          <div className="form-group">
            <label>联系电话</label>
            <input
              type="input"
              value={phone}
              className="form-control"
              placeholder="输入联系电话"
              onChange={evt => updateVote({ phone: evt.target.value })}
            />
          </div>
          <div className="form-group">
            <div>请上传封面及图片(共三张)</div>
            {remainCount > 0 && (
              <div className="py-1">
                <span
                  className="align-middle mx-1 bg-dark"
                  style={{ width: 100, height: 30, display: 'inline-block' }}
                >
                  <ImageUploaderV2
                    count={remainCount}
                    onUpload={this.uploadImages.bind(this)}
                  />
                </span>
              </div>
            )}
            <div className="container-fluid jumbotron-fluid">
              <div className="row no-gutters">{uiImages}</div>
            </div>
          </div>
          <div className="m-2 p-2 text-danger">{errMsg}</div>
          <div className="m-2">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              onClick={this.createOption}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  me: meSelect(state, props),
  dbOption: dbOptionSelect(state)
});
const mapActionsToProps = {
  push,
  createOption,
  getOption,
  updateOption,
  retrieveOptions
};
export default connect(mapStateToProps, mapActionsToProps)(Page);
