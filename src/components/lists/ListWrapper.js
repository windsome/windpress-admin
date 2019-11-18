import React from 'react';
import { Link } from 'react-router-dom';
import {
  getViewport,
  getPagearea,
  getElementAbsolutePos,
  getElementViewPos,
  getElementAbsolutePosV2,
  getElementViewPosV2
} from 'utils/domext';

class List extends React.Component {
  constructor() {
    super();
    this.onEvent = this.onEvent.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.domElement = null;
  }

  onEvent(evt) {
    evt.preventDefault();
    console.log('onEvent:', evt.type, evt);
  }

  info() {
    let vp = getViewport();
    let pa = getPagearea();
    console.log('viewport:', vp, ', pagearea:', pa);
    if (this.domElement) {
      let abspos = getElementAbsolutePos(this.domElement);
      let relpos = getElementViewPos(this.domElement);
      let abspos2 = getElementAbsolutePosV2(this.domElement);
      let relpos2 = getElementViewPosV2(this.domElement);
      console.log(
        'abspos:',
        abspos,
        ', relpos:',
        relpos,
        ', abspos2:',
        abspos2,
        ', relpos2:',
        relpos2
      );
    }
  }

  onTouchStart(evt) {
    console.log('start:', evt.type);
    this.info();
  }

  onTouchMove(evt) {
    var point = evt.touches ? evt.touches[0] : evt;
    //deltaX		= point.pageX - this.pointX,
    //deltaY		= point.pageY - this.pointY,
    console.log('move:', evt.type, ', pos:', point.pageX, point.pageY);
  }

  onTouchEnd(evt) {
    console.log('end:', evt.type);
    this.info();
  }

  render() {
    let { onRefresh, onNext, children } = this.props;

    return (
      <div
        ref={ele => {
          this.domElement = ele;
        }}
        onClick={this.onEvent}
        onWheel={this.onEvent}
        onMouseDown={this.onTouchStart}
        onMouseMove={this.onTouchMove}
        onMouseUp={this.onTouchEnd}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchCancel={this.onTouchEnd}
        onTouchEnd={this.onTouchEnd}
      >
        <div
          className="media align-items-center align-content-center px-2"
          onClick={onRefresh}
        >
          刷新
        </div>
        {children}
        <div
          className="media align-items-center align-content-center px-2"
          onClick={onNext}
        >
          下一页
        </div>
      </div>
    );
  }
}

export default List;
