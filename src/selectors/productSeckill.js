import {
  cachedDbTableSelector,
  cachedDbModuleActionSelector
} from './_database';

const moduleName = 'productSeckill';
export const dbSelect = state => cachedDbTableSelector(state, `${moduleName}s`);
export const retrieveSelect = state =>
  cachedDbModuleActionSelector(state, moduleName, 'retrieve');
