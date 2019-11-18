import decorateComponentWithProps from 'decorate-component-with-props';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton
} from 'draft-js-buttons';
import createStore from './utils/createStore';
import Toolbar from './components/Toolbar';
import SeparatorOrigin from './components/Separator';
// import buttonStyles from './buttonStyles.css';
// import toolbarStyles from './toolbarStyles.css';
import '../draft-js-buttonStyles.css';
import './toolbarStyles.css';

//const defaultTheme = { buttonStyles, toolbarStyles };
const defaultTheme = {
  buttonStyles: {
    buttonWrapper: 'draft-plugin-buttonWrapper',
    button: 'draft-plugin-button',
    active: 'draft-plugin-button-active',
    separator: 'draft-plugin-separator'
  },
  toolbarStyles: { toolbar: 'draft-plugin-static-toolbar' }
};

//const Separator = ({ className = defaultTheme.buttonStyles.separator }) => <div className={className} />;
const Separator = decorateComponentWithProps(SeparatorOrigin, {
  className: defaultTheme.buttonStyles.separator
});

export default (config = {}) => {
  const store = createStore({});

  const {
    theme = defaultTheme,
    structure = [BoldButton, ItalicButton, UnderlineButton, CodeButton]
  } = config;

  const toolbarProps = {
    store,
    structure,
    theme
  };

  return {
    initialize: ({ getEditorState, setEditorState }) => {
      store.updateItem('getEditorState', getEditorState);
      store.updateItem('setEditorState', setEditorState);
    },

    // Re-Render the text-toolbar on selection change
    onChange: editorState => {
      store.updateItem('selection', editorState.getSelection());
      return editorState;
    },
    Toolbar: decorateComponentWithProps(Toolbar, toolbarProps)
  };
};

export { Separator };
