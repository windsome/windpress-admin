// !!!CAUTION: 每加一个reducer，需要手动加入到_database.js中，以便reducer能正常工作
import { getReducer } from './_baseMongo';
import './bonusUser';
import './match';
import './message';
import './order';
import './product';
import './productSeckill';
import './seckill';
import './setting';
import './shop';
import './shopManager';
import './user';
import './vote';
import './voteOption';
import './pointUser';
import './resource';

export default getReducer();
