import React from 'react';
import FileInput, { FileInputPreview } from './FileInput';
import Gap, { GapVertical } from './Gap';
import { FixedBottomButton, BigButton } from './Bar';
import { MenuItem } from './Menu';
import { FormInput, FormTextarea } from './FormInput';
import FiveStar from './FiveStar';
import ListReactVirtualized from '../ListReactVirtualized';
import ListWrapper from './ListWrapper';
import Select from './Select';
import ConfirmModal from './ModalConfirm';

class Page extends React.Component {
  constructor() {
    super();
  }
  state = {
    dlgIsOpen: false
  };
  render() {
    return (
      <div className="container-fluid jumbotron-fluid">
        <div className="row no-gutters">
          <div className="col-6">
            <FileInput />
          </div>
          <div className="col-3">
            <FileInput />
          </div>
          <div className="col-2">
            <FileInput />
          </div>
          <div className="col-1">
            <FileInput />
          </div>
          <div className="col-6">
            <FileInputPreview />
          </div>
          <div className="col-3">
            <FileInputPreview src="/ysj/test/160x160-3.png" />
          </div>
          <div className="col-2">
            <FileInputPreview />
          </div>
          <div className="col-1">
            <FileInputPreview />
          </div>
          <Gap width={3} />
          <div className="col-12">
            <MenuItem />
            <MenuItem height={100} />
            <FixedBottomButton />
          </div>
          <div className="col-12">
            <FiveStar value={33} />
          </div>
          <div className="col-12">
            <BigButton />
          </div>

          <Gap width={3} />
          <div className="col-12">
            <FormInput placeholder="请输入公司名称，24个字内" />
            <Gap width={1} />
            <FormTextarea placeholder="请输入公司简介，100个字内" />
          </div>

          <Gap width={10} />
          <Select />

          <Gap width={10} />
          <MenuItem
            icon="fa fa-file-text-o"
            title="打开对话框"
            subtitle="打开对话框"
            arrow={true}
            onClick={evt => {
              evt.preventDefault();
              this.setState({ dlgIsOpen: true });
            }}
          />
          <ConfirmModal
            isOpen={this.state.dlgIsOpen}
            title="对话框标题"
            content="确定要执行吗？"
            onRequestClose={() => this.setState({ dlgIsOpen: false })}
            func={() => this.setState({ dlgIsOpen: false })}
          />

          <Gap width={10} />
          <div className="col-12">
            <MenuItem title="ListReactVirtualized" />
            <ListReactVirtualized />
          </div>

          <Gap width={10} />
          <div className="col-12">
            <MenuItem title="ListWrapper" />
          </div>
          <ListWrapper>
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">item1</div>
                <div className="col-12">item1</div>
                <div className="col-12">item1</div>
                <div className="col-12">item1</div>
                <div className="col-12">item1</div>
                <div className="col-12">item1</div>
                <div className="col-12">item1</div>
                <div className="col-12">item1</div>
              </div>
            </div>
          </ListWrapper>

          <Gap width={10} />
          <Gap width={10} />
        </div>
      </div>
    );
  }
}

export default Page;
