import React from 'react';
import ReactModal from 'react-modal';
import SearchBar from 'components/widgets/SearchBar';

export class ModalManager extends React.Component {
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

    let { data = [] } = this.state;

    return (
      <ReactModal
        isOpen={isOpen}
        contentLabel={'设置管理员'}
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
            <span className="modal-title">设置管理员</span>
            <button type="button" className="close" onClick={onRequestClose}>
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div className="modal-body container">
            <div>
              <SearchBar
                placeholder="搜索:用户ID"
                value={qs}
                onChange={evt => this.setState({ qs: evt.target.value })}
                onSubmit={null}
              />
            </div>

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
