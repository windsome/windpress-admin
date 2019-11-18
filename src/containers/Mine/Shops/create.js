import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace, goBack } from 'react-router-redux';

import { GoBackItem } from 'components/widgets/Menu';
import FileInput from 'components/widgets/FileInput';

import { create as createShop } from 'modules/shop';
import { dbSelect, createSelect } from 'selectors/shop';

import cert1 from './cert1.jpg';
import cert2 from './cert2.jpeg';
import cert3 from './cert3.jpg';
import './create.css';

export const Step0Part2 = () => {
  return (
    <div className="step0part2">
      <div className="mt-1 mb-1">
        <small className="d-block text-center mb-3">
          成为商家需要准备哪些资料？
        </small>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <span className="border-warning rounded-circle number">1</span>
            <span className="ml-2">（必要）营业执照清晰照片</span>
          </div>
          <div className="col-12 col-sm-3">
            <img className="img-fluid" src={cert1} />
          </div>
          <div className="col-12 col-sm-9">
            <div className="small text-para">
              三证合一的照片，如果不是三证合一，请将图片左右合成成一张。如果是个人没有营业执照，请准备一张个人全身照。
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12">
            <span className="border-warning rounded-circle number">2</span>
            <span className="ml-2">（必要）营业场所照片至少1张</span>
          </div>
          <div className="col-12 col-sm-3">
            <img className="img-fluid" src={cert2} />
          </div>
          <div className="col-12 col-sm-9">
            <div className="small text-para">方便客户了解门店情况</div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12">
            <span className="border-warning rounded-circle number">3</span>
            <span className="ml-2">（可选）广告视频或图片若干</span>
          </div>
          <div className="col-12 col-sm-3">
            <img className="img-fluid" src={cert3} />
          </div>
          <div className="col-12 col-sm-9">
            <div className="small text-para">
              准备一张宣传图，作为小图标显示在门店列表页。一般为公司logo等。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export class Page extends React.Component {
  componentDidMount() {}
  render() {
    let { match, push, goBack, createShop, dataCreate } = this.props;
    const handleCreate = evt => {
      evt.preventDefault();
      createShop().then(ret => {
        console.log('ret:', ret);
        push('/mine/shops/edit/' + ret.id);
      });
    };
    let fetching = dataCreate && dataCreate.fetching;
    return (
      <div>
        <GoBackItem onClick={goBack} title="添加门店" />
        <div className="container-fluid jumbotron-fluid">
          <div className="row no-gutters">
            <div className="col-12">
              <div className="header__photo" />
              <div className="col-sm-12 col-md-6 col-lg-5 bg-babu pt-3 pb-3 m-0 m-sm-2">
                <div>
                  <h5 className="d-block">
                    <strong>成为艺术加商户，让你在电视上免费做广告</strong>
                  </h5>
                  <small className="d-block">
                    开启艺术教育培训的高效之旅，通过电视传播你的课程，让更多人认识您。
                  </small>
                  <br />
                  <div>
                    {!fetching && (
                      <Link
                        to="/mine/shops/edit/1"
                        className="btn btn-primary btn-large"
                        onClick={handleCreate}
                      >
                        开始吧
                      </Link>
                    )}
                    {fetching && <div>正在创建草案</div>}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 mt-5">
              <Step0Part2 />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  db: dbSelect(state),
  dataCreate: createSelect(state)
});

export default connect(mapStateToProps, {
  push,
  goBack,
  createShop
})(Page);
