import isNumber from 'lodash/isNumber';

export const getNicePriceFromCent = cent => {
  let strPrice = null;
  if (isNumber(cent)) {
    let yushu = cent % 100;
    if (!yushu) {
      // integer
      strPrice = cent / 100 + '';
    } else {
      // float
      strPrice = parseFloat(cent / 100).toFixed(2) + '';
    }
  }
  return strPrice;
};
