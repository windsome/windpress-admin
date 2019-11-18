import React from 'react';
import FileInput, { FileInputPreview } from 'components/widgets/FileInput';
import { sliceUploadFile } from 'utils/apisQcloud';

export class Page extends React.Component {
  constructor() {
    super();
  }
  state = {
    src: '',
    src2: ''
  };

  asyncHashUploadImages(evt) {
    console.log('asyncHashUploadImages:', evt);
    let fileList = [];
    for (let i = 0; i < evt.target.files.length; i++) {
      let file = evt.target.files[i];
      fileList.push(file);
    }
    sliceUploadFile({ file: fileList[0] })
      .then(ret => {
        console.log('result:', ret);
        this.setState({ src: 'http://' + ret.Location });
      })
      .catch(error => {
        console.log('error:', error);
      });
  }

  asyncHashUploadVideos(evt) {
    console.log('asyncHashUploadVideos:', evt);
    let fileList = [];
    for (let i = 0; i < evt.target.files.length; i++) {
      let file = evt.target.files[i];
      fileList.push(file);
    }
    let file = fileList[0];
    sliceUploadFile({
      Bucket: 'ceshi-1255968143',
      file,
      Key: '/abc/' + file.name
    })
      .then(ret => {
        console.log('result:', ret);
        this.setState({ src2: 'http://' + ret.Location });
      })
      .catch(error => {
        console.log('error:', error);
      });
  }

  render() {
    return (
      <div>
        <h5>上传图片到腾讯云存储</h5>
        <FileInputPreview
          accept="image/*"
          src={this.state.src}
          onChange={this.asyncHashUploadImages.bind(this)}
          text="图片"
        />
        <h5>上传视频到腾讯云存储</h5>
        <FileInputPreview
          accept="video/*"
          src={this.state.src2}
          onChange={this.asyncHashUploadVideos.bind(this)}
          text="图片"
        />
      </div>
    );
  }
}

export default Page;
