import React from 'react';
import ReactModal from 'react-modal';

export class ModalAd extends React.Component {
  state = {
    data: this.props.data || []
  };
  componentWillReceiveProps(nextProps) {
    let currData = this.props.data;
    let nextData = nextProps.data;
    if (currData !== nextData) {
      this.setState({ data: nextData });
    }
  }

  render() {
    let {
      isOpen,
      onRequestClose = null,
      errMsg = null,
      func = null
    } = this.props;

    let changeContent = (index, content) => {
      let data = this.state.data || [];
      let datai = (data && data[index]) || {};
      let ndatai = { ...datai, content };
      let ndata = [...data];
      ndata[index] = ndatai;
      this.setState({ data: ndata });
    };

    let changeExtTag = (index, checked) => {
      let extTag = checked ? '预约礼' : null;
      let data = this.state.data || [];
      let datai = (data && data[index]) || {};
      let ndatai = { ...datai, extTag };
      let ndata = [...data];
      ndata[index] = ndatai;
      this.setState({ data: ndata });
    };

    let changeShowType = (index, value) => {
      let data = this.state.data || [];
      let datai = (data && data[index]) || {};
      let ndatai = { ...datai, showType: value };
      let ndata = [...data];
      ndata[index] = ndatai;
      this.setState({ data: ndata });
    };

    let { data = [] } = this.state;

    let uiData = [1, 2].map((item, index) => {
      let { content = '', extTag, showType } = (data && data[index]) || {};
      let extTagChecked = extTag ? true : false;
      return (
        <div key={index}>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">
              {'广告语' + (index + 1)}
              <small className="form-text text-muted">
                在列表页面显示，不超过20字
              </small>
            </label>
            <input
              type="input"
              value={content}
              onChange={evt => changeContent(index, evt.target.value)}
              className="form-control"
              placeholder={'输入广告语' + (index + 1)}
            />
          </div>
          <div>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  value="tuan"
                  onChange={evt => changeShowType(index, evt.target.value)}
                  checked={showType === 'tuan'}
                />{' '}
                团购
              </label>
            </div>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  value="ding"
                  onChange={evt => changeShowType(index, evt.target.value)}
                  checked={showType === 'ding'}
                />{' '}
                预约
              </label>
            </div>
          </div>
          <div className="form-check">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="checkbox"
                checked={extTagChecked}
                onChange={evt => changeExtTag(index, evt.target.checked)}
              />
              预约有礼品
            </label>
          </div>
          <div style={{ width: '100%', height: 1, backgroundColor: '#eee' }} />
        </div>
      );
    });

    return (
      <ReactModal
        isOpen={isOpen}
        contentLabel={'设置广告'}
        onRequestClose={onRequestClose}
        style={{
          overlay: { zIndex: 1050 },
          content: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            padding: 0,
            margin: 30
          }
        }}
      >
        <div className="modal-content" style={{ zIndex: 1000 }}>
          <div className="modal-header">
            <span className="modal-title">设置广告</span>
            <button type="button" className="close" onClick={onRequestClose}>
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div className="modal-body container">
            {uiData}

            {errMsg && (
              <div className="text-danger text-left">
                <span>{errMsg}</span>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <div
              style={{
                backgroundColor: '#db3652',
                color: '#fff',
                textAlign: 'center',
                fontSize: 20,
                padding: 5
              }}
              onClick={() => func(this.state.data)}
            >
              <span>确定</span>
            </div>
          </div>
        </div>
      </ReactModal>
    );
  }
}

export default ModalAd;
