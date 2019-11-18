/**
 * see: http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml
 */
import React from 'react';
import indexOf from 'lodash/indexOf';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

let gFileList = []; //list of files already added
const loadjscssfile = (filename, filetype) => {
  let fileref = null;
  if (filetype == 'js') {
    //if filename is a external JavaScript file
    fileref = document.createElement('script');
    fileref.setAttribute('type', 'text/javascript');
    fileref.setAttribute('src', filename);
  } else if (filetype == 'css') {
    //if filename is an external CSS file
    fileref = document.createElement('link');
    fileref.setAttribute('rel', 'stylesheet');
    fileref.setAttribute('type', 'text/css');
    fileref.setAttribute('href', filename);
  }
  if (typeof fileref != 'undefined') {
    fileref.onload = res => console.log('withScript: onload:', res);
    fileref.onerror = error => console.log('withScript: onerror:', error);
    document.getElementsByTagName('head')[0].appendChild(fileref);
  }
};

const checkloadjscssfile = (filename, filetype) => {
  if (indexOf(gFileList, filename) < 0) {
    loadjscssfile(filename, filetype);
    gFileList.push(filename); //List of files added in the form "[filename1],[filename2],etc"
  } else console.log('withScript: file already added!');
  return true;
};

/**
 * script: https://imgcache.qq.com/open/qcloud/js/vod/sdk/ugcUploader.js
 * filetype: js / css
 */
export default (cfg = { script: null, filetype: 'js' }) => {
  let script = cfg && cfg.script;
  let filetype = cfg && cfg.filetype;
  return WrappedComponent => {
    // ...and returns another component...
    class withScript extends React.Component {
      constructor(props) {
        super(props);
      }
      componentWillMount() {
        checkloadjscssfile(script, filetype);
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    }
    withScript.displayName = `withScript(${getDisplayName(WrappedComponent)})`;
    return withScript;
  };
};
