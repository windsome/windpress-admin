import React from 'react';
import ReactModal from 'react-modal';
ReactModal.setAppElement(document.body);

export class ConfirmModal extends React.Component {
  render() {
    let {
      isOpen,
      onRequestClose = null,
      title = '确认您的操作！',
      content = '无操作',
      errMsg = null,
      func = null
    } = this.props;
    return (
      <ReactModal
        isOpen={isOpen}
        contentLabel={title}
        onRequestClose={onRequestClose}
        style={{ overlay: { zIndex: 1050 } }}
      >
        <div className="modal-content" style={{ zIndex: 1000 }}>
          <div className="modal-header">
            <span className="modal-title">{title}</span>
            <button type="button" className="close" onClick={onRequestClose}>
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div className="modal-body container" style={{ textAlign: 'center' }}>
            <div>
              <span>{content}</span>
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
              onClick={func}
            >
              <span>确定</span>
            </div>
          </div>
        </div>
      </ReactModal>
    );
  }
}

export default ConfirmModal;
