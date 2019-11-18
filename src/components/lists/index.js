import React from 'react';
import ListWrapper from './ListWrapper';

export default () => {
  let uis = [];
  for (let i = 0; i < 30; i++) {
    let deta = parseInt(20 * Math.random());
    let height = 20 + deta;
    uis.push(<div style={{ height }}>{'height=' + height}</div>);
  }

  /*let arr = new Array(30);
  let uis = arr.map (ele => {
    let deta = parseInt(20*Math.random());
    let height = 20+deta;
    return (
      <div style={{height}}>{'height='+height}</div>
    )
  })*/
  return (
    <div>
      <ListWrapper>{uis}</ListWrapper>
    </div>
  );
};
