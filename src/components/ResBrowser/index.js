import ImageBrowser from './ImageBrowser';
import withModal from '../hoc/withModal';
import withScript from '../hoc/withScript';
import VideoBrowserInner from './VideoBrowser';

export const ImageBrowserModal = withModal()(ImageBrowser);
// export const VideoBrowser = withScript({
//   script: 'https://imgcache.qq.com/open/qcloud/js/vod/sdk/ugcUploader.js',
//   filetype: 'js'
// })(VideoBrowserInner);
export const VideoBrowser = VideoBrowserInner;
export const VideoBrowserModal = withModal()(VideoBrowser);

export default ImageBrowser;
