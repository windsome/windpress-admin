// ========================================================
// Browser Debug Setup
// ========================================================
export const initDebug = () => {
  window.myDebug = require('debug');
  window.myDebug.enable('*');
  window.xdebug = window.myDebug('app:');
  return window.xdebug;
};

let xdebug = initDebug();

export default xdebug;
