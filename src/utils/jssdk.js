//import wx from 'utils/jweixin-1.2.0';
//var wx = require ('utils/jweixin-1.2.0')
let wx = window.wx;

export const wxConfig = pkg => {
  return new Promise((resolve, reject) => {
    console.log('wxConfig start:', pkg);
    let error = null;
    wx.config({
      beta: true,
      //debug: true,
      appId: pkg.appId,
      timestamp: pkg.timestamp,
      nonceStr: pkg.nonceStr,
      signature: pkg.signature,
      jsApiList: [
        // 所有要调用的 API 都要加到这个列表中
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard',
        'openWXDeviceLib',
        'getWXDeviceTicket',
        'configWXDeviceWiFi'
      ]
    });
    // jssdk注册成功后执行
    // 实际中发现不管成功还是失败都会走到这里，貌似是加载完成后执行。
    // 得找到成功和失败返回的方案
    wx.ready(() => {
      if (error == null) {
        console.log('ready(), request jssdk ok!');
        resolve(wx);
      } else {
        console.log(
          'ready(), previous fail, already return! no need return twice! request jssdk fail!'
        );
        reject(error);
      }
    });
    // jssdk注册失败时执行
    wx.error(err => {
      console.log('error(), request jssdk fail!', err);
      error = err;
    });
  });
};

export const getBrandWCPayRequest = args => {
  console.log('WxBridge支付参数：' + JSON.stringify(args));
  return new Promise((resolve, reject) => {
    window.WeixinJSBridge.invoke('getBrandWCPayRequest', args, res => {
      console.log('支付结果：' + JSON.stringify(res));
      if (res.err_msg == 'get_brand_wcpay_request:ok') {
        resolve(true);
      } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
        reject(new Error('用户取消了'));
      } else {
        reject(new Error(res.err_desc || res.err_msg || 'Unknown Error'));
      }
    });
  });
};

export const getLocation = () => {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      success: res => {
        console.log('getLocation success:', res);
        resolve({
          lng: res.longitude,
          lat: res.latitude,
          acc: res.accuracy,
          speed: res.speed
        });
        // var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        // var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        // var speed = res.speed; // 速度，以米/每秒计
        // var accuracy = res.accuracy; // 位置精度
      },
      fail: error => {
        console.log('getLocation fail:', error);
        reject(error);
      },
      cancel: error => {
        console.log('getLocation cancel:', error);
        reject(error);
      }
    });
  });
};

export const openLocation = position => {
  // let position = {
  //   latitude: 0, // 纬度，浮点数，范围为90 ~ -90
  //   longitude: 0, // 经度，浮点数，范围为180 ~ -180。
  //   name: '', // 位置名
  //   address: '', // 地址详情说明
  //   scale: 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
  //   infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
  // }
  wx.openLocation(position);
};

export const chooseImage = ({ count, sizeType, sourceType }) => {
  count = count || 1;
  sizeType = sizeType || ['original', 'compressed'];
  sourceType = sourceType || ['album', 'camera'];
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: count, // 默认9
      sizeType: sizeType, //['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: sourceType, //['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        console.log('uploadFileWxjs: chooseImage: ', localIds);
        resolve(localIds);
      },
      fail: err => {
        console.log('error! uploadFileWxjs() fail!', err);
        reject(err);
      },
      cancel: err => {
        console.log('cancel!', err);
        reject(err);
      }
    });
  });
};

/**
 * 根据图片的localId获取图片的dataUrl. IOS中wkwebview用户必须使用此接口获取dataUrl自行上传。
 * wkwebview in ios, we can use `getLocalImgData` get image DataURL
 * @param {String} localId
 */
export const getLocalImgData = localId => {
  return new Promise((resolve, reject) => {
    wx.getLocalImgData({
      localId, // 图片的localID
      success: res => {
        var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
        resolve(localData);
      },
      fail: err => {
        reject(err);
      },
      cancel: err => {
        reject(err);
      }
    });
  });
};

export const uploadImage = localId => {
  return new Promise((resolve, reject) => {
    wx.uploadImage({
      localId, // 需要上传的图片的本地ID，由chooseImage接口获得
      isShowProgressTips: 1, // 默认为1，显示进度提示
      success: res => {
        var serverId = res.serverId; // 返回图片的服务器端ID
        console.log('uploadImage: ' + serverId);
        resolve(serverId);
      },
      fail: err => {
        reject(err);
      },
      cancel: err => {
        reject(err);
      }
    });
  });
};
