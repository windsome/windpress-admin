import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace, goBack } from 'react-router-redux';
import ReactModal from 'react-modal';
import _ from 'lodash';

import { MenuItem, GoBackItem } from 'components/widgets/Menu';
import Gap from 'components/widgets/Gap';
import { FormInput, FormTextarea } from 'components/widgets/FormInput';
import MapModal from 'components/widgets/ModalMap';
import TagModal from 'components/widgets/ModalTag';
import ImageClosable from 'components/widgets/ImageClosable';
import { ImageUploaderV2 } from 'components/widgets/FileInput';
import { uploadCombinedFileInput } from 'utils/upload';

import {
  update as updateShop,
  get as getShop,
  retrieve as retrieveShops
} from 'modules/shop';
import { dbSelect, updateSelect } from 'selectors/shop';
import { tag as fetchTags } from 'modules/setting';
import { tagDataSelect } from 'selectors/setting';

import './edit.css';

export class Page extends React.Component {
  state = {
    status: null,
    name: null,
    address: null,
    lng: null,
    lat: null,
    tags: null,
    desc: {
      phone: null,
      content: null,
      license: null,
      region: null
    },
    owner: null,
    managers: null,
    extend: {
      images: null,
      videos: null,
      ads: null
    },
    updated: null,

    isOpenTagModal: false,
    isOpenMapModal: false,
    errMsg: ''
  };

  constructor() {
    super();
    this.updateItem = this.updateItem.bind(this);
  }

  componentDidMount() {
    let { db, dataTag, match, retrieveShops, fetchTags } = this.props;
    let id = match.params && match.params.id;
    let item = db && db[id];
    if (!item) {
      retrieveShops('id=' + id).then(ret => {
        console.log('retrieveShops result:', ret);
        if (ret) {
          item = this.props.db && this.props.db[id];
          if (item) {
            this.setState({ ...item });
          } else {
            console.log('retrieveShops fail!');
          }
        }
      });
    } else {
      this.setState({ ...item });
    }

    if (!dataTag) {
      fetchTags();
    }
  }

  updateItem = evt => {
    evt.preventDefault();
    let { updateShop, getShop, push, match } = this.props;
    let id = match.params.id;

    let { isOpenTagModal, isOpenMapModal, ...item } = this.state;
    let { desc, extend } = item || {};
    let { images, videos } = extend || {};

    let nextImages =
      images &&
      images.map((item, index) => {
        return { url: item.url };
      });
    let nextVideos =
      videos &&
      videos.map((item, index) => {
        return { url: item.url };
      });

    let nextItem = {
      ...item,
      extend: { ...extend, images: nextImages, videos: nextVideos }
    };

    console.log('updateItem:', nextItem);
    updateShop(id, nextItem)
      .then(ret => getShop(id))
      .then(ret2 => push('/mine/shops'))
      .catch(error => {
        this.setState({ errMsg: error.message });
      });
  };

  // uploadLicenseImage(evt, isWechat) {
  //   uploadCombinedFileInput(evt, { isWechat }).then(result => {
  //     console.log('uploadLicenseImage:', result);
  //     let img = result[0];
  //     let licenseImage = { src: img.url };
  //     let { desc } = this.state;
  //     this.setState({
  //       desc: {
  //         ...desc,
  //         license: licenseImage
  //       }
  //     });
  //   });
  // }
  uploadLicenseImage(imgList) {
    let img = imgList[0];
    let licenseImage = { src: img.url };
    let { desc } = this.state;
    this.setState({
      desc: {
        ...desc,
        license: licenseImage
      }
    });
  }

  removeLicense() {
    let { desc } = this.state;
    this.setState({ desc: { ...desc, license: null } });
  }

  uploadImages(imgList) {
    let { extend } = this.state;
    let { images } = extend || {};
    let nImages = (images && images.slice(0)) || [];
    nImages = nImages.concat(imgList);
    console.log('nImages:', nImages, imgList);
    this.setState({ extend: { ...extend, images: nImages } });
  }

  removeImageIndex(index) {
    let { extend } = this.state;
    let { images } = extend || {};
    let nImages = (images && images.slice(0)) || [];
    nImages.splice(index, 1);
    console.log('removeImageIndex:', index, nImages, images);
    this.setState({ extend: { ...extend, images: nImages } });
  }

  render() {
    let { match, push, goBack, history, dataTag } = this.props;
    let { name, address, lng, lat, tags, desc, extend } = this.state;
    let { phone, content, license, region } = desc || {};
    let { images, videos, ads } = extend || {};
    let dataTagShop = (dataTag && dataTag.desc && dataTag.desc.shop) || [
      '无标签'
    ];

    console.log('state:', this.state);
    let licenseImageSrc = license && license.src;
    let uiTags =
      tags &&
      tags.map((tag, index) => {
        return (
          <span
            key={index}
            className="d-inline-block bg-primary rounded p-1 mx-2 my-1 tag-item"
          >
            {tag}
          </span>
        );
      });

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
      <div>
        <GoBackItem onClick={goBack} title="编辑门店信息" />
        <form>
          <div className="h5 text-center m-1">
            您好！我们开始登记您的商户信息吧。
          </div>
          <FormInput
            placeholder="机构名称"
            value={name}
            onChange={evt => this.setState({ name: evt.target.value })}
          />
          <Gap width={1} />
          <FormInput
            placeholder="联系电话"
            value={phone}
            onChange={evt =>
              this.setState({
                desc: { ...this.state.desc, phone: evt.target.value }
              })
            }
          />
          <Gap width={1} />
          <FormTextarea
            placeholder="机构描述"
            value={content}
            onChange={evt =>
              this.setState({
                desc: { ...this.state.desc, content: evt.target.value }
              })
            }
          />
          <Gap width={3} />
          <MenuItem
            icon={null}
            title="上传营业执照清晰照片"
            subtitle=""
            subicon="fa fa-angle-down"
          />
          <div className="py-1">
            {!licenseImageSrc && (
              <span
                className="align-middle mx-1 bg-dark"
                style={{ width: 100, height: 30, display: 'inline-block' }}
              >
                <ImageUploaderV2
                  onUpload={this.uploadLicenseImage.bind(this)}
                />
              </span>
            )}
            {licenseImageSrc && (
              <ImageClosable
                src={licenseImageSrc}
                onClose={this.removeLicense.bind(this)}
              />
            )}
          </div>
          <Gap width={3} />
          <MenuItem
            icon={null}
            title="机构照片"
            subtitle=""
            subicon="fa fa-angle-down"
          />
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
          <Gap width={3} />
          <MenuItem
            icon={null}
            title="选择标签"
            subtitle="机构服务的项目"
            subicon="fa fa-angle-right"
            onClick={() => {
              this.setState({ isOpenTagModal: !this.state.isOpenTagModal });
            }}
          />
          <div>{uiTags}</div>

          <Gap width={3} />
          <MenuItem
            icon={null}
            title="地址"
            subtitle={address}
            subicon="fa fa-angle-right"
            onClick={() => {
              this.setState({ isOpenMapModal: !this.state.isOpenMapModal });
            }}
          />
          <button
            type="submit"
            className="btn btn-default"
            onClick={this.updateItem}
          >
            保存
          </button>
          <MapModal
            isOpen={this.state.isOpenMapModal}
            gps={{ lng, lat }}
            address={address}
            onRequestClose={() => this.setState({ isOpenMapModal: false })}
            func={({ gps, address, region, province, city, district }) => {
              console.log('gps:', gps);
              this.setState({
                isOpenMapModal: false,
                address,
                lng: gps.N,
                lat: gps.Q,
                desc: { ...this.state.desc, region },
                business: region,
                province,
                city,
                district
              });
            }}
          />
          <TagModal
            isOpen={this.state.isOpenTagModal}
            selected={tags}
            all={dataTagShop}
            onRequestClose={() => this.setState({ isOpenTagModal: false })}
            func={selected => {
              this.setState({ isOpenTagModal: false, tags: selected });
            }}
          />
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  db: dbSelect(state),
  dataUpdate: updateSelect(state),
  dataTag: tagDataSelect(state)
});

const mapActionsToProps = {
  push,
  goBack,
  updateShop,
  getShop,
  retrieveShops,
  fetchTags
};
export default connect(mapStateToProps, mapActionsToProps)(Page);
