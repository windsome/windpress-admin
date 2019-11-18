import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uploadCombinedFileInput } from 'utils/upload';
import { uploadFileInput as uploadVideoFile } from 'utils/upload.qcloud';
import { createUploader } from 'utils/upload.aliyun';
//import { createResource } from 'utils/apis';
import _ from 'lodash';

import {
  convertFromRaw,
  convertToRaw,
  AtomicBlockUtils,
  EditorState
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import './draft-js-buttonStyles.css';

import { ImageBrowserModal, VideoBrowserModal } from '../ResBrowser';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import './draft-js-inline-toolbar-plugin/toolbarStyles.css';

import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin';
import './draft-js-side-toolbar-plugin/toolbarStyles.css';
import './draft-js-side-toolbar-plugin/blockTypeSelectStyles.css';

import createToolbarPlugin, {
  Separator
} from './draft-js-static-toolbar-plugin';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton
} from 'draft-js-buttons';

import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import createLinkPlugin from './draft-js-anchor-plugin';
import createImagePlugin from './draft-js-image-plugin';
import createVideoPlugin, { types } from './draft-js-video-plugin';
import { Player } from 'video-react';
import createAlignmentPlugin from './draft-js-alignment-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createResizeablePlugin from './draft-js-resizeable-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import createDragNDropUploadPlugin from '@mikeljames/draft-js-drag-n-drop-upload-plugin';
import editorStyles from './editorStyles.css';
import 'video-react/dist/video-react.css';

const VideoPlayer = ({ blockProps }) => (
  <Player>
    <source src={blockProps.src} />
  </Player>
);

/* eslint-disable */
const initialState = {
  entityMap: {
    '0': {
      type: 'image',
      mutability: 'IMMUTABLE',
      data: {
        src: '/ysj/images/test1.gif'
      }
    },
    '1': {
      type: types.VIDEOTYPE,
      mutability: 'IMMUTABLE',
      data: {
        src: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4'
      }
    },
    '2': {
      type: types.VIDEOTYPE,
      mutability: 'IMMUTABLE',
      data: {
        //src: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4'
        src:
          'http://1255968143.vod2.myqcloud.com/87f29433vodtransgzp1255968143/a465c3e84564972819129202561/v.f20.mp4'
      }
    }
  },
  blocks: [
    {
      key: '9gm3s',
      text:
        'You can have images in your text field. This is a very rudimentary example, but you can enhance the image plugin with resizing, focus or alignment plugins.',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {}
    },
    {
      key: 'ovideo',
      text: ' ',
      type: 'atomic',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 1,
          key: 1
        }
      ],
      data: {}
    },
    {
      key: 'ov7r',
      text: ' ',
      type: 'atomic',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 1,
          key: 0
        }
      ],
      data: {}
    },
    {
      key: 'e23a8',
      text: 'See advanced examples further down â€¦',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {}
    },
    {
      key: 'video2',
      text: ' ',
      type: 'atomic',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 1,
          key: 2
        }
      ],
      data: {}
    }
  ]
};
/* eslint-enable */
let defImages = [
  '/ysj/images/slide1.jpg',
  '/ysj/images/slide2.jpg',
  '/ysj/images/slide3.jpg',
  '/ysj/images/slide4.jpg',
  '/ysj/images/slide5.jpg',
  '/ysj/images/headnews.jpeg',
  '/ysj/images/headnews2.jpeg',
  '/ysj/images/cert1.jpg',
  '/ysj/images/avatar-1.png',
  '/ysj/images/test1.gif',
  '/ysj/images/logo.png',
  '/ysj/images/logo2.png'
];
let defVideos = [
  'http://1255968143.vod2.myqcloud.com/87f29433vodtransgzp1255968143/a465c3e84564972819129202561/v.f20.mp4',
  'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
  'http://1255968143.vod2.myqcloud.com/87f29433vodtransgzp1255968143/462fb6db4564972819274987082/v.f20.mp4',
  'http://1255968143.vod2.myqcloud.com/87f29433vodtransgzp1255968143/eeea51a84564972819106691410/v.f20.mp4',
  'http://d3caf18bvodgzp1255968143-10022853.cosgzp.myqcloud.com/d3caf18bvodgzp1255968143/636655da7447398155626865834/ICGbV3m9C2AA.mp4',
  'http://video.qingshansi.cn/f63bc6f065ea4acc8b9867468e79c0f9/f99bfb14876a4f2bb8946d1f9999ea30-22f5183a03da8a02d99d3e3621e3b213-ld.mp4'
];

export default class CustomEditor extends Component {
  constructor(props) {
    super(props);
    let initialValue = props.initialState || initialState;
    this.state = {
      editorState: EditorState.createWithContent(convertFromRaw(initialValue)),
      imageStore: defImages,
      videoStore: defVideos
    };
    this.draft = this.initPlugins();
  }

  initPlugins() {
    const focusPlugin = createFocusPlugin();
    const resizeablePlugin = createResizeablePlugin();
    const blockDndPlugin = createBlockDndPlugin();
    const alignmentPlugin = createAlignmentPlugin();
    const { AlignmentTool } = alignmentPlugin;

    const decorator = composeDecorators(
      //resizeablePlugin.decorator,
      alignmentPlugin.decorator,
      focusPlugin.decorator
      //blockDndPlugin.decorator
    );
    const imagePlugin = createImagePlugin({ decorator });
    const openImageBrowser = evt => {
      console.log('openImageBrowser: true');
      this.setState({
        isOpenImageBrowser: true
      });
    };
    const ImageButton = imagePlugin.createImageButton({
      theme: {
        buttonWrapper: 'draft-plugin-buttonWrapper',
        button: 'draft-plugin-button',
        active: 'draft-plugin-button-active',
        separator: 'draft-plugin-separator'
      },
      onClick: openImageBrowser
    });

    const videoPlugin = createVideoPlugin({
      decorator,
      videoComponent: VideoPlayer
    });
    const openVideoBrowser = evt => {
      console.log('openVideoBrowser: true');
      this.setState({
        isOpenVideoBrowser: true
      });
    };
    const VideoButton = videoPlugin.createVideoButton({
      theme: {
        buttonWrapper: 'draft-plugin-buttonWrapper',
        button: 'draft-plugin-button',
        active: 'draft-plugin-button-active',
        separator: 'draft-plugin-separator'
      },
      onClick: openVideoBrowser
    });

    const linkPlugin = createLinkPlugin();

    const inlineToolbarPlugin = createInlineToolbarPlugin({
      structure: [
        BoldButton,
        ItalicButton,
        UnderlineButton,
        linkPlugin.LinkButton
      ],
      theme: {
        buttonStyles: {
          buttonWrapper: 'draft-plugin-buttonWrapper',
          button: 'draft-plugin-button',
          active: 'draft-plugin-button-active'
        },
        toolbarStyles: { toolbar: 'draft-plugin-toolbar' }
      }
    });
    const { InlineToolbar } = inlineToolbarPlugin;

    const sideToolbarPlugin = createSideToolbarPlugin({
      theme: {
        buttonStyles: {
          buttonWrapper: 'draft-plugin-buttonWrapper',
          button: 'draft-plugin-button',
          active: 'draft-plugin-button-active',
          separator: 'draft-plugin-separator'
        },
        blockTypeSelectStyles: {
          blockType: 'draft-plugin-blockType',
          spacer: 'draft-plugin-spacer',
          popup: 'draft-plugin-popup'
        },
        toolbarStyles: { wrapper: 'draft-plugin-wrapper' }
      }
    });
    const { SideToolbar } = sideToolbarPlugin;

    const staticToolbarPlugin = createToolbarPlugin({
      structure: [
        BoldButton,
        ItalicButton,
        UnderlineButton,
        linkPlugin.LinkButton,
        Separator,
        HeadlineOneButton,
        HeadlineTwoButton,
        HeadlineThreeButton,
        UnorderedListButton,
        OrderedListButton,
        BlockquoteButton,
        CodeBlockButton,
        Separator,
        ImageButton,
        VideoButton
      ]
    });
    const { Toolbar } = staticToolbarPlugin;

    const plugins = [
      blockDndPlugin,
      focusPlugin,
      alignmentPlugin,
      resizeablePlugin,
      imagePlugin,
      videoPlugin,
      linkPlugin,
      inlineToolbarPlugin,
      sideToolbarPlugin,
      staticToolbarPlugin
    ];
    return {
      plugins,
      AlignmentTool,
      InlineToolbar,
      SideToolbar,
      Toolbar
    };
  }
  getContent = () => {
    let contentState = this.state.editorState.getCurrentContent();
    let raw = convertToRaw(contentState);
    return raw;
  };

  onChange = editorState => {
    let content = editorState.getCurrentContent();
    let entityMap = content.getEntityMap();
    let selection = editorState.getSelection();
    //console.log('selection:', selection.toJS());
    console.log('content:', content.toJS());
    //entityMap.mapEntries(([ k, v ]) => console.log(k,':',v));
    this.setState({ editorState });
  };

  focus = () => {
    this.editor.focus();
  };
  insertImages = images => {
    if (!images) return null;
    if (images.length <= 0) return null;

    let { editorState } = this.state;
    const urlType = 'image';

    for (let i = 0; i < images.length; i++) {
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        urlType,
        'IMMUTABLE',
        { src: images[i] }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = AtomicBlockUtils.insertAtomicBlock(
        editorState,
        entityKey,
        ' '
      );
      editorState = newEditorState;
    }
    editorState = EditorState.forceSelection(
      editorState,
      editorState.getCurrentContent().getSelectionAfter()
    );
    this.setState({ isOpenImageBrowser: false });
    this.onChange(editorState);
  };
  uploadImages = (evt, isWechat) => {
    let { createResource } = this.props;
    let { imageStore } = this.state;
    uploadCombinedFileInput(evt, { isWechat }).then(result => {
      console.log('uploadImage:', result);
      const uploadMeta = async () => {
        let metaList = [];
        for (let i = 0; i < result.length; i++) {
          let img = result[i];
          let meta1 = await createResource({ type: 'image', url: img.url });
          console.log('meta1:', meta1);
          let meta2 =
            (meta1 &&
              meta1.db &&
              meta1.db.resources &&
              meta1.result &&
              meta1.db.resources[meta1.result]) ||
            null;
          metaList.push(meta2);
        }
        return metaList;
      };
      uploadMeta().then(metaList => {
        console.log('metaList:', metaList);
        let imgList = [];
        for (let i = 0; i < metaList.length; i++) {
          let img = metaList[i];
          imgList.push(img.url);
        }
        this.setState({ imageStore: _.uniq(_.concat(imageStore, imgList)) });
      });
    });
  };
  removeImage = image => {
    let { imageStore } = this.state;
    this.setState({ imageStore: _.without(imageStore, image) });
  };
  insertVideos = videos => {
    if (!videos) return null;
    if (videos.length <= 0) return null;

    let { editorState } = this.state;
    const urlType = 'draft-js-video-plugin-video';

    for (let i = 0; i < videos.length; i++) {
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        urlType,
        'IMMUTABLE',
        { src: videos[i] }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = AtomicBlockUtils.insertAtomicBlock(
        editorState,
        entityKey,
        ' '
      );
      editorState = newEditorState;
    }
    editorState = EditorState.forceSelection(
      editorState,
      editorState.getCurrentContent().getSelectionAfter()
    );
    this.setState({ isOpenVideoBrowser: false });
    this.onChange(editorState);
  };
  uploadVideos = (evt, isWechat) => {
    let { createResource } = this.props;
    let { videoStore } = this.state;
    uploadVideoFile(evt).then(result => {
      console.log('uploadVideos:', result);
      const uploadMeta = async () => {
        let metaList = [];
        for (let i = 0; i < result.length; i++) {
          let img = result[i];
          let meta1 = await createResource({ type: 'image', url: img.url });
          console.log('meta1:', meta1);
          let meta2 =
            (meta1 &&
              meta1.db &&
              meta1.db.resources &&
              meta1.result &&
              meta1.db.resources[meta1.result]) ||
            null;
          metaList.push(meta2);
        }
        return metaList;
      };
      uploadMeta().then(metaList => {
        console.log('metaList:', metaList);
        let imgList = [];
        for (let i = 0; i < metaList.length; i++) {
          let img = metaList[i];
          imgList.push(img.url);
        }
        this.setState({ imageStore: _.uniq(_.concat(videoStore, imgList)) });
      });
    });
  };
  uploadVideosAliyun = evt => {
    let { videoStore, uploader } = this.state;
    let files = [];
    for (let i = 0; i < evt.target.files.length; i++) {
      files.push(evt.target.files[i]);
    }
    (async () => {
      if (uploader) return uploader;
      uploader = await createUploader();
      this.setState({ uploader });
      return uploader;
    })().then(uploader => {
      for (let i = 0; i < files.length; i++) {
        let userData = {
          Vod: { UserData: { IsShowWaterMark: false, Priority: '7' } }
        };
        let file = files[i];
        uploader.addFile(file, null, null, null, JSON.stringify(userData));
      }
      uploader.startUpload();
    });
  };

  render() {
    let {
      plugins,
      AlignmentTool,
      InlineToolbar,
      SideToolbar,
      Toolbar
    } = this.draft;
    return (
      <div className="editor" onClick={this.focus}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={element => {
            this.editor = element;
          }}
        />
        <div style={{ textAlign: 'center', color: '#ccc' }}>
          ---------<span style={{ padding: '0 20px' }}>我是有底线的</span>---------
        </div>
        <AlignmentTool />
        <InlineToolbar />
        <SideToolbar />
        <Toolbar />
        <ImageBrowserModal
          isOpen={this.state.isOpenImageBrowser}
          title="选择图片"
          onRequestClose={() => this.setState({ isOpenImageBrowser: false })}
          resources={this.state.imageStore}
          upload={this.uploadImages}
          remove={this.removeImage}
          use={this.insertImages}
          getFirst={null}
          getNext={null}
        />
        <VideoBrowserModal
          isOpen={this.state.isOpenVideoBrowser}
          title="选择视频"
          onRequestClose={() => this.setState({ isOpenVideoBrowser: false })}
          resources={this.state.videoStore}
          upload={this.uploadVideosAliyun}
          remove={this.removeImage}
          use={this.insertVideos}
          getFirst={null}
          getNext={null}
        />
      </div>
    );
  }
}

CustomEditor.propTypes = {
  dbResource: PropTypes.object.isRequired,
  createResource: PropTypes.func.isRequired
};
