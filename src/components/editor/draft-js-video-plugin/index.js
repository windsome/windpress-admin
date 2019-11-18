import decorateComponentWithProps from 'decorate-component-with-props';
import addVideo from './video/modifiers/addVideo';
import DefaultVideoComponent from './video/components/DefaultVideoComponent';
import * as types from './video/constants';
import './videoStyles.css';
import createVideoButton from './VideoButton';

const defaultTheme = {
  buttonStyles: {
    buttonWrapper: 'draft-plugin-buttonWrapper',
    button: 'draft-plugin-button',
    active: 'draft-plugin-button-active'
  },
  videoStyles: {
    iframeContainer: 'draft-plugin-iframeContainer',
    iframe: 'draft-plugin-iframe',
    invalidVideoSrc: 'draft-plugin-invalidVideoSrc'
  }
};

export default (config = {}) => {
  const theme = config.theme ? config.theme : defaultTheme.videoStyles;
  let Video = config.videoComponent || DefaultVideoComponent;
  if (config.decorator) {
    Video = config.decorator(Video);
  }
  const ThemedVideo = decorateComponentWithProps(Video, { theme });
  const openVideoBrowser = config.openVideoBrowser;
  return {
    blockRendererFn: (block, { getEditorState }) => {
      if (block.getType() === types.ATOMIC) {
        // TODO subject to change for draft-js next release
        const contentState = getEditorState().getCurrentContent();
        const entity = contentState.getEntity(block.getEntityAt(0));
        const type = entity.getType();
        const { src } = entity.getData();
        if (type === types.VIDEOTYPE) {
          return {
            component: ThemedVideo,
            editable: false,
            props: {
              src
            }
          };
        }
      }

      return null;
    },
    addVideo,
    types,
    createVideoButton,
    VideoButton: createVideoButton({
      theme: theme.buttonStyles,
      onClick: openVideoBrowser
    })
  };
};

export { types };
