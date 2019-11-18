import decorateComponentWithProps from 'decorate-component-with-props';
import DefaultLink from './components/Link';
import LinkButton from './components/LinkButton';
import EditorUtils from './utils/EditorUtils';
import linkStrategy, { matchesEntityType } from './linkStrategy';
//import linkStyles from './linkStyles.css';
import './linkStyles.css';

const defaultTheme = {
  input: 'draft-plugin-anchor-input',
  inputInvalid: 'draft-plugin-anchor-inputInvalid',
  link: 'draft-plugin-anchor-link'
};

export default (config = {}) => {
  const { theme = defaultTheme, placeholder, Link, linkTarget } = config;

  const store = {
    getEditorState: undefined,
    setEditorState: undefined
  };

  return {
    initialize: ({ getEditorState, setEditorState }) => {
      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
    },

    decorators: [
      {
        strategy: linkStrategy,
        matchesEntityType,
        component:
          Link ||
          decorateComponentWithProps(DefaultLink, {
            className: theme.link,
            target: linkTarget
          })
      }
    ],

    LinkButton: decorateComponentWithProps(LinkButton, {
      ownTheme: theme,
      store,
      placeholder,
      onRemoveLinkAtSelection: () =>
        store.setEditorState(
          EditorUtils.removeLinkAtSelection(store.getEditorState())
        )
    })
  };
};
