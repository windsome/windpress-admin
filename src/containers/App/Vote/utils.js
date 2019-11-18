export const strError = error => {
  let msg = '';
  if (error) {
    switch (error.errcode) {
      case 40051:
        msg = '该投票已过期';
        break;
      case 40052:
        msg = '今天已经投过了，改天再投！';
        break;
      case 40053:
        msg = '不在投票期！';
        break;
      case 40054:
        msg = '投票还未开始！';
        break;
      default:
        msg = error.message;
        break;
    }
  }
  return msg;
};
