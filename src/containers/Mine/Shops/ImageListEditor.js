import React from 'react';
import { Link } from 'react-router-dom';
import { dataUrlSvgWithSize } from 'components/widgets/_SvgWithSize';
import parseUserAgent from 'utils/userAgent';
import { uploadCombinedFileInput } from 'utils/upload';
import ImageUploader from 'components/widgets/ImageUploader';
let xdebug = window.myDebug('app:mine:shops:edit');

export class ImageListEditor extends React.Component {
  constructor() {
    super();
    this.prevPage = this.prevPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.addPrevPage = this.addPrevPage.bind(this);
    this.addNextPage = this.addNextPage.bind(this);
    this.remCurrentPage = this.remCurrentPage.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
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
    let count = (data && data.length) || 0;
    current++;
    if (current >= count) current = count - 1;
    if (current < 0) current = 0;
    this.setState({ current });
  }
  addPrevPage() {
    let { data, current } = this.state;
    let nData = (data && data.slice(0)) || [];
    nData.splice(current, 0, {
      img: dataUrlSvgWithSize(720, 160),
      to: '/nodeapp/'
    });
    this.setState({ data: nData, current });
  }
  addNextPage() {
    let { data, current } = this.state;
    let nData = (data && data.slice(0)) || [];
    nData.splice(current + 1, 0, {
      img: dataUrlSvgWithSize(720, 160),
      to: '/nodeapp/'
    });
    current++;
    this.setState({ data: nData, current });
  }
  remCurrentPage() {
    let { data, current } = this.state;
    let nData = (data && data.slice(0)) || [];
    nData.splice(current, 1);
    let count = nData.length;
    if (current >= count) current = count - 1;
    if (current < 0) current = 0;
    this.setState({ data: nData, current });
  }
  uploadImage(evt, isWechat) {
    uploadCombinedFileInput(evt, { isWechat }).then(result => {
      console.log('uploadImage:', result);
      let img = result[0];
      let { data, current } = this.state;
      let item = data[current];
      let nItem = { ...item, img: img.url };
      let nData = (data && data.slice(0)) || [];
      nData.splice(current, 1, nItem);
      this.setState({ data: nData });
    });
  }

  render() {
    let { onChange } = this.props;
    let { data, current } = this.state;
    console.log('render:', data);
    let item = null;
    let count = (data && data.length) || 0;
    if (current >= 0 && current < count) {
      item = data[current];
    } else {
      item = {
        img: dataUrlSvgWithSize(720, 160),
        to: '/coin/1'
      };
    }
    return (
      <div>
        <div className="small py-1 bg-secondary" style={{ opacity: '0.8' }}>
          <div className="container-fluid no-gutters p-0">
            <div className="row no-gutters align-items-center">
              <div className="col-1 px-1 text-left" onClick={this.prevPage}>
                <i className="fa fa-angle-left" style={{ fontSize: 40 }} />
              </div>
              <div className="col-10">
                <div className="container">
                  <div className="row">
                    <div className="col-4">
                      <span
                        className="align-middle mx-1 bg-dark"
                        style={{
                          width: 100,
                          height: 30,
                          display: 'inline-block'
                        }}
                      >
                        <ImageUploader doUpload={this.uploadImage} />
                      </span>
                    </div>
                    <div className="col-4">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={this.remCurrentPage}
                      >
                        {'删除第' + current + '页'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => onChange && onChange(data)}
                      >
                        <i className="fa fa-check text-warning" />
                        <span>保存设置</span>
                      </button>
                    </div>
                    <div className="col-4">
                      <span
                        className="align-middle mx-1 bg-dark"
                        style={{
                          width: 100,
                          height: 30,
                          display: 'inline-block'
                        }}
                      >
                        <ImageUploader doUpload={this.uploadImage} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-1 px-1 text-right" onClick={this.nextPage}>
                <i className="fa fa-angle-right" style={{ fontSize: 40 }} />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <img
            src={item.img}
            className="img-fluid h-100"
            alt="Responsive image"
          />
        </div>
      </div>
    );
  }
}
