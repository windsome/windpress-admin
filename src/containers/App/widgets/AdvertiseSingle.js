import React from 'react';
import { dataUrlSvgWithSize } from 'components/widgets/_SvgWithSize';
import LinkOutable from 'components/widgets/LinkOutable';
import ImageKeepRatio from 'components/widgets/ImageKeepRatio';
import withTimely from 'components/hoc/withTimely';
import parseUserAgent from 'utils/userAgent';
import { uploadCombinedFileInput } from 'utils/upload';
import ImageUploader from './ImageUploader';
let xdebug = window.myDebug('app:AdvertiseSingle');

export const AdvertiseSingle = ({ data, ratio = 50 }) => {
  let { img, to } = data || {};
  img = img || dataUrlSvgWithSize(720, parseInt(720 * ratio / 100));
  to = to || '/app';

  return (
    <LinkOutable to={to}>
      <ImageKeepRatio src={img} ratio={ratio} />
    </LinkOutable>
  );
};

export class AdvertiseSingleEditor extends React.Component {
  constructor() {
    super();
    this.uploadImage = this.uploadImage.bind(this);
    this.setLink = this.setLink.bind(this);
  }
  state = {
    img: null,
    to: null
  };

  componentDidMount() {
    let data = this.props.data || {};
    this.setState({ ...data });
  }

  uploadImage(evt, isWechat) {
    uploadCombinedFileInput(evt, { isWechat }).then(result => {
      console.log('uploadImage:', result);
      let img = result[0];
      this.setState({ img: img.url });
    });
  }
  setLink(evt) {
    let value = evt.target.value;
    this.setState({ to: value });
  }

  render() {
    let { onChange, ratio = 50 } = this.props;
    let { img, to } = this.state;
    img = img || dataUrlSvgWithSize(720, parseInt(720 * ratio / 100));
    to = to || '/app';

    return (
      <div>
        <ImageKeepRatio src={img} ratio={ratio} />
        <div className="small p-1 bg-secondary" style={{ opacity: '0.8' }}>
          <div>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="设置链接"
                value={to || ''}
                onChange={this.setLink}
              />
            </div>
          </div>
          <div className="pt-1">
            <span
              className="align-middle mx-1 bg-dark"
              style={{ width: 100, height: 30, display: 'inline-block' }}
            >
              <ImageUploader doUpload={this.uploadImage} />
            </span>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => onChange && onChange(this.state)}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    );
  }
}
