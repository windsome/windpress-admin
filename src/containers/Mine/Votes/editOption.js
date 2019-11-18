import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import { push, goBack } from 'react-router-redux';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';

import { GoBackItem } from 'components/widgets/Menu';
import { BigButton } from 'components/widgets/Bar';
import ImageClosable from 'components/widgets/ImageClosable';
import { ImageUploaderV2 } from 'components/widgets/FileInput';
import { uploadCombinedFileInput } from 'utils/upload';
import Gap from 'components/widgets/Gap';
import { FormInput, FormTextarea } from 'components/widgets/FormInput';

import { update as updateOption, get as getOption } from 'modules/voteOption';
import {
  dbSelect as dbOptionSelect,
  getSelect as dataOptionGetSelect
} from 'selectors/voteOption';
import { meSelect } from 'selectors/user';
import _key from 'modules/u_key';
import { sleep } from 'utils/sleep';

import './edit.css';

export class Page extends React.Component {
  state = {
    id: null,
    status: null,
    owner: null,
    voteId: null,
    desc: null,
    reserved1: null,

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
    let { match, dbOption, getOption } = props;
    let { voteId, optionId } = (match && match.params) || {};
    let item = dbOption && dbOption[optionId];
    if (!item) {
      item = await getOption(optionId);
    }
    if (item) {
      this.setState({ ...item });
    }
  }

  updateItem = evt => {
    evt.preventDefault();
    let { updateOption, push, match } = this.props;
    let { voteId, optionId } = (match && match.params) || {};

    let { errMsg, desc, ...item } = this.state;
    let { images } = desc || {};
    let nextImages =
      images &&
      images.map(item => {
        return { url: item.url };
      });

    let nextItem = { ...item, desc: { ...(desc || {}), images: nextImages } };
    //console.log('updateItem:', this.state, nextItem);
    updateOption(optionId, nextItem)
      .then(ret => {
        push('/mine/votes/' + voteId + '/options');
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
    let { push, goBack, match } = this.props;
    let { id, status, owner, desc, voteId, reserved1, errMsg } = this.state;
    let { name, content, phone, images } = desc || {};
    const updateDesc = args => {
      this.setState({ desc: { ...desc, ...args } });
    };

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

    console.log('render()', this.state, this.props);
    return (
      <div className="bg-white">
        <GoBackItem onClick={goBack} title="编辑候选项" />
        <div className="p-3">
          <FormInput
            placeholder="参赛者姓名"
            value={name}
            onChange={evt => updateDesc({ name: evt.target.value })}
          />
        </div>
        <div className="p-3">
          <FormInput
            placeholder="电话"
            value={phone}
            onChange={evt => updateDesc({ phone: evt.target.value })}
          />
        </div>
        <div className="p-3">
          <FormTextarea
            placeholder="简介（一般200字内，不支持换行）"
            value={content}
            onChange={evt => updateDesc({ content: evt.target.value })}
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
        <div>{errMsg}</div>
        <div>
          <BigButton title="确认提交" onClick={this.updateItem} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dbOption: dbOptionSelect(state),
  dataOptionGet: dataOptionGetSelect(state)
});

const mapActionsToProps = {
  push,
  goBack,
  updateOption,
  getOption
};

export default connect(mapStateToProps, mapActionsToProps)(Page);
