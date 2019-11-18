import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import { push, goBack } from 'react-router-redux';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';

import { BigButton } from 'components/widgets/Bar';
import ImageClosable from 'components/widgets/ImageClosable';
import { ImageUploaderV2 } from 'components/widgets/FileInput';
import { uploadCombinedFileInput } from 'utils/upload';
import Gap from 'components/widgets/Gap';
import { FormInput } from 'components/widgets/FormInput';
import { GoBackItem } from 'components/widgets/Menu';

import { update as updateVote, get as getVote } from 'modules/vote';
import {
  dbSelect as dbVoteSelect,
  getSelect as dataVoteGetSelect
} from 'selectors/vote';
import { meSelect } from 'selectors/user';
import _key from 'modules/u_key';
import { sleep } from 'utils/sleep';

import './edit.css';

export class Page extends React.Component {
  state = {
    id: null,
    status: null,
    name: null,
    owner: null,
    desc: null,
    startAt: null,
    endAt: null,
    reserved1: null,
    reserved2: null,

    errMsg: null
  };

  constructor() {
    super();
    this.updateItem = this.updateItem.bind(this);
  }

  componentDidMount() {
    this.initFetchData(this.props);
  }

  async initFetchData(props) {
    let { match, dbVote, getVote } = props;
    let voteId = match.params && match.params.voteId;
    let item = dbVote && dbVote[voteId];
    if (!item) {
      item = await getVote(voteId);
    }
    if (item) {
      this.setState({ ...item });
    }
  }

  updateItem = evt => {
    evt.preventDefault();
    let { updateVote, push, match } = this.props;
    let voteId = match.params.voteId;

    let { errMsg, desc, ...item } = this.state;
    let { images } = desc || {};
    let nextImages =
      images &&
      images.map(item => {
        return { url: item.url };
      });

    let nextItem = { ...item, desc: { ...(desc || {}), images: nextImages } };
    //console.log('updateItem:', this.state, nextItem);
    updateVote(voteId, nextItem)
      .then(ret => {
        push('/mine/votes');
      })
      .catch(error => {
        this.setState({ errMsg: error.message });
      });
  };

  uploadImages(imgList) {
    let { desc } = this.state;
    let { images } = desc || {};
    let nImages = (images && images.slice(0)) || [];
    nImages = nImages.concat(imgList);
    //console.log('nImages:', nImages, imgList);
    this.setState({ desc: { ...desc, images: nImages } });
  }
  removeImageIndex(index) {
    let { desc } = this.state;
    let { images } = desc || {};
    let nImages = (images && images.slice(0)) || [];
    nImages.splice(index, 1);
    //console.log('removeImageIndex:', index, nImages, images);
    this.setState({ desc: { ...desc, images: nImages } });
  }

  render() {
    let { push, goBack } = this.props;
    let {
      id,
      status,
      name,
      owner,
      desc,
      startAt,
      endAt,
      reserved1,
      reserved2,
      errMsg
    } = this.state;
    let { images } = desc || {};

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
      <div className="bg-white">
        <GoBackItem onClick={goBack} title="编辑投票" />
        <div className="p-3">
          <FormInput
            placeholder="投票标题"
            value={name}
            onChange={evt => this.setState({ name: evt.target.value })}
          />
        </div>
        <Gap width={3} />
        <div className="p-3">
          <span>图片列表：</span>
          <div className="py-1">
            <span
              className="align-middle mx-1 bg-dark"
              style={{ width: 100, height: 30, display: 'inline-block' }}
            >
              <ImageUploaderV2
                count={9}
                onUpload={this.uploadImages.bind(this)}
              />
            </span>
          </div>
          <div className="container-fluid jumbotron-fluid">
            <div className="row no-gutters">{uiImages}</div>
          </div>
        </div>
        <Gap width={3} />
        <div className="p-3">
          <span>开始日期：</span>
          <Flatpickr
            data-enable-time
            value={startAt}
            onChange={date => {
              this.setState({ startAt: date });
            }}
          />
        </div>
        <div className="p-3">
          <span>截至日期：</span>
          <Flatpickr
            data-enable-time
            value={endAt}
            onChange={date => {
              this.setState({ endAt: date });
            }}
          />
        </div>

        <Gap width={3} />
        <div>{errMsg}</div>
        <div>
          <BigButton title="确认提交" onClick={this.updateItem} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dbVote: dbVoteSelect(state),
  dataVoteGet: dataVoteGetSelect(state)
});

const mapActionsToProps = {
  push,
  goBack,
  updateVote,
  getVote
};

export default connect(mapStateToProps, mapActionsToProps)(Page);
