import React from 'react';

import {
  uploadFileInput,
  hash$UploadFile,
  hash$UploadDataURLs,
  uploadCombinedFileInput
} from 'utils/upload';
import { imageFileListScale } from 'utils/imageScale';
import { chooseImage } from 'utils/jssdk';
import parseUserAgent from 'utils/userAgent';

import './FileInput.css';

export const ImageUploader = ({
  multiple = false, // "multiple"
  doUpload = null,
  accept = 'image/*',
  text = '添加图片',
  isWechat = false // 默认为PC模式(即用<input type='file'>进行上传)
} = {}) => {
  let InputElement = () => {
    if (isWechat) {
      return (
        <div
          className="fileinput"
          onClick={evt => doUpload(evt, isWechat)}
          tabIndex="0"
        />
      );
    } else {
      let inputAttrs = {};
      if (multiple) inputAttrs = { multiple: 'multiple' };
      return (
        <input
          className="fileinput"
          type="file"
          accept={accept}
          onChange={evt => doUpload(evt)}
          {...inputAttrs}
        />
      );
    }
  };

  return (
    <div className="weui_uploader_input">
      <span className="desc1">{text}</span>
      <InputElement />
    </div>
  );
};

export const ImageUploaderV2 = ({
  onUpload = null,
  accept = 'image/*',
  text = '添加图片',
  //isWechat = false, // 默认为PC模式(即用<input type='file'>进行上传)
  count = 1,
  maxWidth = 720,
  maxHeight = 720,
  keepRatio = true
} = {}) => {
  let ua = parseUserAgent(navigator.userAgent);
  let isWechat = !!ua.wechat;

  let doUpload = (evt, isWechat) => {
    uploadCombinedFileInput(evt, {
      isWechat,
      count,
      maxWidth,
      maxHeight,
      keepRatio
    }).then(result => {
      onUpload && onUpload(result);
    });
  };

  let InputElement = () => {
    if (isWechat) {
      return (
        <div
          className="fileinput"
          onClick={evt => doUpload(evt, isWechat)}
          tabIndex="0"
        />
      );
    } else {
      let inputAttrs = {};
      if (count > 1) inputAttrs = { multiple: 'multiple' };
      return (
        <input
          className="fileinput"
          type="file"
          accept={accept}
          onChange={evt => doUpload(evt)}
          {...inputAttrs}
        />
      );
    }
  };

  return (
    <div className="weui_uploader_input">
      <span className="desc1">{text}</span>
      <InputElement />
    </div>
  );
};

export const FileInput = ({
  accept = 'images/*',
  noinput = false,
  multiple = false,
  onClick = null,
  onChange = null
} = {}) => {
  let InputElement = () => {
    if (!!noinput) {
      return <div className="fileinput" onClick={onClick} tabIndex="0" />;
    } else {
      let inputAttrs = {};
      if (multiple) inputAttrs = { multiple: 'multiple' };
      return (
        <input
          className="fileinput"
          type="file"
          accept={accept}
          onChange={onChange}
          onClick={evt => {
            console.log('FileInput clicked!');
          }}
          {...inputAttrs}
        />
      );
    }
  };

  return (
    <div className="weui_uploader_input">
      <InputElement />
    </div>
  );
};

export const FileInputPreview = ({
  accept = 'image/*',
  noinput = false,
  multiple = false, // "multiple"
  onClick = null,
  onChange = null,
  onRemove = null,
  src = null,
  text = '添加图片'
} = {}) => {
  let InputElement = () => {
    if (!!noinput) {
      return <div className="fileinput" onClick={onClick} tabIndex="0" />;
    } else {
      let inputAttrs = {};
      if (multiple) inputAttrs = { multiple: 'multiple' };
      return (
        <input
          className="fileinput"
          type="file"
          accept={accept}
          onChange={onChange}
          onClick={evt => {
            console.log('FileInputPreview clicked!');
          }}
          {...inputAttrs}
        />
      );
    }
  };

  return (
    <div className="weui_uploader_input">
      <span className="desc1">{text}</span>
      <InputElement />
      {src && (
        <div className="fileinput" style={{ opacity: 1 }}>
          <img src={src} className="img-thumbnail preview" alt={src} />
          <i className="fa fa-times close" onClick={onRemove} tabIndex="0" />
          <span className="desc2">{text}</span>
        </div>
      )}
    </div>
  );
};

export class FileInputPreviewList extends React.Component {
  state = {
    data: null
  };

  constructor() {
    super();
  }

  componentDidMount() {
    let { data } = this.props;
    if (data !== this.state.data) {
      this.setState({ data });
    }
  }

  componentWillReceiveProps(nextProps) {
    let currData = this.props.data;
    let nextData = nextProps.data;
    if (currData !== nextData) {
      this.setState({ data: nextData });
    }
  }

  uploadFileWxjs(evt) {
    chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        console.log('uploadFileWxjs: chooseImage: ', localIds);
        let uploadResult =
          localIds &&
          localIds.map(localId => {
            src: localId;
          });

        let { data = [] } = this.state;
        let nextItems = [...data, ...uploadResult];
        this.setState({ data: nextItems });
        let { onUpdate } = this.props;
        onUpdate && onUpdate(nextItems);
      },
      fail: err => {
        console.log('error! uploadFileWxjs() fail!', err);
      },
      cancel: err => {
        console.log('cancel!', err);
      }
    });
  }

  async asyncHashUploadVideos(evt) {
    console.log('asyncHashUploadVideos1:', evt);
    let fileList = [];
    for (let i = 0; i < evt.target.files.length; i++) {
      let file = evt.target.files[i];
      fileList.push(file);
    }

    let uploadResult = [];
    for (let i = 0; i < fileList.length; i++) {
      let file = fileList[i];
      let result = await hash$UploadFile({
        onprogress: progitem => {}
      });
      console.log('asyncHashUploadVideos2:', result);
      uploadResult.push(result);
    }
    console.log('asyncHashUploadVideos3:', uploadResult);

    let { data } = this.state;
    let nextItems = [...(data || []), ...uploadResult];
    this.setState({ data: nextItems });
    let { onUpdate } = this.props;
    onUpdate && onUpdate(nextItems);
  }

  async asyncScaleUploadImages(evt) {
    //let scaledList = await imageFileListScale(evt.target.files);
    //let scaledList = await imageFileListScale(evt.target.files, {maxWidth:800, maxHeight: 800});
    let scaledList = await imageFileListScale(evt.target.files, {
      maxWidth: null,
      maxHeight: null
    });
    console.log('after scale: ', scaledList);
    let uploadResult = await hash$UploadDataURLs({
      dataUrls: scaledList,
      onprogress: progitem => {
        console.log('progress:', progitem);
        var { action, percent } = progitem;
      }
    });
    console.log('upload result: ', uploadResult);

    let { data } = this.state;
    let nextImages = [...(data || []), ...uploadResult];
    this.setState({ data: nextImages });
    let { onUpdate } = this.props;
    onUpdate && onUpdate(nextImages);
  }
  removeItem(index) {
    let { data } = this.state;
    if (!data || data.length <= 0) {
      console.log('images is null!');
      return;
    }
    let nextImages = data.slice(0);
    nextImages.splice(index, 1);
    console.log('images:', data, ', arr:', nextImages, ', index:', index);
    this.setState({ data: nextImages });
    let { onUpdate } = this.props;
    onUpdate && onUpdate(nextImages);
  }

  render() {
    let {
      accept = 'image/*', // 'video/*'
      noinput = false,
      multiple = false, // "multiple"
      text = '添加图片'
    } = this.props;
    let { data } = this.state;

    accept = (accept && accept.toLowerCase()) || '';
    let canScale = accept.indexOf('image/') >= 0;
    //console.log(accept, canScale)
    let onChangeFunc = this.asyncHashUploadVideos.bind(this);
    if (canScale) onChangeFunc = this.asyncScaleUploadImages.bind(this);
    let onClickFunc = this.uploadFileWxjs.bind(this);
    if (canScale) onClickFunc = this.uploadFileWxjs.bind(this);

    let uiImages =
      data &&
      data.map((image, index) => {
        let src = image.src || image.url || '/ysj/images/logo.png';
        return (
          <div className="col-4" key={index}>
            <FileInputPreview
              src={src}
              text={text}
              onRemove={() => this.removeItem(index)}
            />
          </div>
        );
      });

    let showAdd = multiple || !(uiImages && uiImages.length > 0);

    return (
      <div className="container-fluid jumbotron-fluid">
        <div className="row no-gutters">
          {showAdd && (
            <div className="col-4">
              <FileInputPreview
                accept={accept}
                noinput={noinput}
                multiple={multiple}
                text={text}
                onClick={onClickFunc}
                onChange={onChangeFunc}
              />
            </div>
          )}
          {uiImages}
        </div>
      </div>
    );
  }
}

export default FileInput;
