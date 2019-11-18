import decorateComponentWithProps from 'decorate-component-with-props';
import addImage from './modifiers/addImage';
import ImageComponent from './Image';
import createImageButton from './ImageButton';
//import imageStyles from './imageStyles.css';
import './imageStyles.css';

const defaultTheme = {
  image: 'draft-plugin-image',
  buttonStyles: {
    buttonWrapper: 'draft-plugin-buttonWrapper',
    button: 'draft-plugin-button',
    active: 'draft-plugin-button-active'
  }
};

export default (config = {}) => {
  const theme = config.theme ? config.theme : defaultTheme;
  let Image = config.imageComponent || ImageComponent;
  if (config.decorator) {
    Image = config.decorator(Image);
  }
  const ThemedImage = decorateComponentWithProps(Image, { theme });
  const openImageBrowser = config.openImageBrowser;
  return {
    blockRendererFn: (block, { getEditorState }) => {
      if (block.getType() === 'atomic') {
        const contentState = getEditorState().getCurrentContent();
        const entity = block.getEntityAt(0);
        if (!entity) return null;
        const type = contentState.getEntity(entity).getType();
        if (type === 'image') {
          return {
            component: ThemedImage,
            editable: false
          };
        }
        return null;
      }

      return null;
    },
    addImage,
    createImageButton,
    ImageButton: createImageButton({
      theme: theme.buttonStyles,
      onClick: openImageBrowser
    })
  };
};

export const Image = ImageComponent;
