import { createSelector } from 'reselect';

export const jssdkSelect = state => state.jssdk;
export const signSelect = state => state.jssdk && state.jssdk.sign;
export const originalSelect = state => state.jssdk && state.jssdk.original;
export const originalPkgSelect = createSelector(
  signSelect,
  originalSelect,
  (sign, original) => {
    let originalSign = sign && original && sign[original];
    return originalSign && originalSign.pkg;
  }
);
/*
export const pkgWrapSelect = createSelector(
  jssdkSelect,
  jssdk => {
    let url = window.location.href.split('#')[0];
    return jssdk && jssdk[url];
  }
)
export const pkgSelect = createSelector(
  pkgWrapSelect,
  pkgWrap => {
    return pkgWrap && pkgWrap.pkg || null
  }
)
*/
