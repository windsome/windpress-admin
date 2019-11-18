import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { generateRandomList } from 'utils/_testData';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import List from 'react-virtualized/dist/commonjs/List';
import CellMeasurer, {
  CellMeasurerCache
} from 'react-virtualized/dist/commonjs/CellMeasurer';
//import 'react-virtualized/styles.css'
import './ListReactVirtualized.css';

var xdebug = window.myDebug('app:Users:list');

const list = Immutable.List(generateRandomList(100));

export class Page extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      scrollToIndex: undefined,
      current: -1
    };

    this._cache = new CellMeasurerCache({
      defaultHeight: 85,
      fixedWidth: true
    });

    this._noRowsRenderer = this._noRowsRenderer.bind(this);
    this._rowRenderer = this._rowRenderer.bind(this);

    this.args = '';
    this._toggleCurrent = this._toggleCurrent.bind(this);
  }

  componentDidMount() {}

  render() {
    const { scrollToIndex, current } = this.state;

    let rowCount = list.size;
    console.log('rowCount=' + rowCount);

    return (
      <div style={{ minHeight: '500px', width: '100%' }}>
        <AutoSizer>
          {({ width, height }) => (
            <List
              ref="List"
              className="List"
              deferredMeasurementCache={this._cache}
              height={height}
              overscanRowCount={10}
              noRowsRenderer={this._noRowsRenderer}
              rowCount={rowCount}
              //rowHeight={this._cache.rowHeight}
              rowHeight={50}
              rowRenderer={this._rowRenderer}
              scrollToIndex={scrollToIndex}
              width={width}
              current={current}
            />
          )}
        </AutoSizer>
      </div>
    );
  }

  _getDatum(index) {
    return list.get(index % list.size);
  }
  _noRowsRenderer() {
    return <div className="noRows">No rows</div>;
  }

  _toggleCurrent(index) {
    let old = this.state.current;
    if (old != index) {
      this.setState({ current: index });
    } else {
      this.setState({ current: -1 });
    }
    if (old >= 0) this._cache.clear(old);
    if (old !== index) this._cache.clear(index);
  }

  _rowRenderer({ index, isScrolling, key, parent, style }) {
    const { current } = this.state;

    if (isScrolling) {
      return (
        <div className="isScrollingPlaceholder" key={key} style={style}>
          Scrolling...
        </div>
      );
    }

    const datum = this._getDatum(index);

    console.log('datum:', datum, ', index:', index);
    let additionalContent = null;
    if (current === index) {
      additionalContent = (
        <div>
          <span className="btn btn-primary m-1">注销</span>
          <span className="btn btn-primary m-1">恢复</span>
        </div>
      );
    }

    let avatar =
      (datum.extend && datum.extend.headimgurl) || '/ysj/images/avatar-1.png';

    return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
        //width={this._mostRecentWidth}
      >
        <div className="row" style={style}>
          <div
            className="letter"
            style={{
              backgroundColor: datum.color
            }}
          >
            {datum.name.charAt(0)}
          </div>
          <div>
            <div className="name">{datum.name}</div>
            <div className="index">This is row {index}</div>
            {additionalContent}
          </div>
        </div>
      </CellMeasurer>
    );
  }
}

export default Page;
