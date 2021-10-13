// 这里丢全局数据的地方
import MainService from '../services/main.services';

export interface GlobalDataInterface {
  [key: string]: any;
  activeCrypto: Set<string>;
}

// 合约站行情请求以及订阅地址为
const WS_URL = "wss://api.btcgateway.pro/linear-swap-ws";

const param = {
  contract_code: 'BTC',
  period: '5min',
  size: '200'
};

export const GlobalData: GlobalDataInterface = {
  BTC: new MainService('BTC', WS_URL, param), // 默认初始化 BTC 的数据
  activeCrypto: new Set(), // 已经激活监听的数据
};
