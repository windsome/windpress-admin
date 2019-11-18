import React from 'react';
import { dataUrlSvgWithSize } from 'components/widgets/_SvgWithSize';
import LinkOutable from 'components/widgets/LinkOutable';
import withTimely from 'components/hoc/withTimely';
import parseUserAgent from 'utils/userAgent';
import { uploadCombinedFileInput } from 'utils/upload';
import ImageUploader from './ImageUploader';
let xdebug = window.myDebug('app:AdvertiseThree');

let RATIO = 100;
let defImage = dataUrlSvgWithSize(160, parseInt(160 * RATIO / 100));

export const AdvertiseThree = ({ data }) => {
  let sampleData = {
    title: '厌学拯救者',
    subtitle: '全场0.1元起',
    url: '/app/shop/1',
    img: defImage
  };
  let item1 = (data && data[0]) || sampleData;
  let item2 = (data && data[1]) || sampleData;
  let item3 = (data && data[2]) || sampleData;
  return (
    <div className="container-fluid jumbotron-fluid bg-white">
      <div className="row no-gutters">
        <div className="col-5 media flex-column align-items-center align-self-center activitylist-item">
          <LinkOutable to={item1.url} style={{ textAlign: 'center' }}>
            <div className="activitylist-title text-truncate">
              {item1.title}
            </div>
            <div className="activitylist-subtitle my-1 text-truncate">
              {item1.subtitle}
            </div>
            <div>
              <img
                className="activitylist-left-img"
                src={item1.img || defImage}
              />
            </div>
          </LinkOutable>
        </div>
        <div className="col-7 pr-2">
          <LinkOutable to={item2.url}>
            <div className="media activitylist-item align-items-center">
              <div className="media-body media flex-column align-items-center text-truncate">
                <div className="activitylist-left-title">{item2.title}</div>
                <div className="activitylist-left-subtitle">
                  {item2.subtitle}
                </div>
              </div>
              <div>
                <img
                  className="activitylist-right-img"
                  src={item2.img || defImage}
                />
              </div>
            </div>
          </LinkOutable>
          <LinkOutable to={item3.url}>
            <div className="media activitylist-item align-items-center">
              <div className="media-body media flex-column align-items-center text-truncate">
                <div className="activitylist-left-title">{item3.title}</div>
                <div className="activitylist-left-subtitle">
                  {item3.subtitle}
                </div>
              </div>
              <div>
                <img
                  className="activitylist-right-img"
                  src={item3.img || defImage}
                />
              </div>
            </div>
          </LinkOutable>
        </div>
      </div>
    </div>
  );
};

export class AdvertiseThreeEditor extends React.Component {
  constructor() {
    super();
    this.adCount = 3;
    this.prevPage = this.prevPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.setData = this.setData.bind(this);
  }
  state = {
    data: [],
    current: 0
  };

  componentDidMount() {
    this.setState({ data: this.props.data });
  }

  prevPage() {
    let { current } = this.state;
    current--;
    if (current < 0) current = 0;
    this.setState({ current });
  }
  nextPage() {
    let { data, current } = this.state;
    current++;
    if (current >= 3) current = this.adCount - 1;
    if (current < 0) current = 0;
    this.setState({ current });
  }
  uploadImage(evt, isWechat) {
    uploadCombinedFileInput(evt, { isWechat }).then(result => {
      console.log('uploadImage:', result);
      let img = result[0];
      let { data, current } = this.state;
      data = data || [];
      let item = data[current] || {};
      let nItem = { ...item, img: img.url };
      let nData = data.slice(0) || [];
      nData[current] = nItem;
      this.setState({ data: nData });
    });
  }
  setData(evt, name) {
    let value = evt.target.value;
    let { data, current } = this.state;
    data = data || [];
    let item = data[current] || {};
    let nItem = { ...item, [name]: value };
    let nData = data.slice(0);
    nData[current] = nItem;
    console.log('nData:', nData);
    this.setState({ data: nData });
  }

  render() {
    let { onChange } = this.props;
    let { data, current } = this.state;
    let sampleData = { img: dataUrlSvgWithSize(160, 160) };
    let pos = ['左边', '右上', '右下'];
    let posName = pos[current];
    let item = (data && data[current]) || sampleData;
    console.log('render state:', this.state, item, current, data);
    return (
      <div>
        <AdvertiseThree data={data} />
        <div className="small py-1 bg-secondary" style={{ opacity: '0.8' }}>
          <div className="container-fluid no-gutters p-0">
            <div className="row no-gutters align-items-center">
              <div className="col-1 px-1 text-left" onClick={this.prevPage}>
                <i className="fa fa-angle-left" style={{ fontSize: 40 }} />
              </div>
              <div className="col-10">
                <div>
                  <div className="input-group mb-1">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="basic-addon3">
                        大标题
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={item.title || ''}
                      onChange={evt => this.setData(evt, 'title')}
                    />
                  </div>
                  <div className="input-group mb-1">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="basic-addon3">
                        小标题
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={item.subtitle || ''}
                      onChange={evt => this.setData(evt, 'subtitle')}
                    />
                  </div>
                  <div className="input-group mb-1">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="basic-addon3">
                        链接页
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={item.url || ''}
                      onChange={evt => this.setData(evt, 'url')}
                    />
                  </div>
                </div>
                <div className="pt-1">
                  <span className="p-1 text-warning">{posName}</span>
                  <span
                    className="align-middle mx-1 bg-dark"
                    style={{ width: 100, height: 30, display: 'inline-block' }}
                  >
                    <ImageUploader doUpload={this.uploadImage} />
                  </span>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => onChange && onChange(data)}
                  >
                    <i className="fa fa-check text-warning" />
                    <span>保存设置</span>
                  </button>
                </div>
              </div>
              <div className="col-1 px-1 text-right" onClick={this.nextPage}>
                <i className="fa fa-angle-right" style={{ fontSize: 40 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
