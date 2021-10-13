import Queue from '../core/queue';

import { KLineInterface } from '@data-analysis/types/kline.type';
import { historyKline } from '../huobi/historyKline';
import { websocket } from '../websocket';

import {
  MacdOperator,
  RsiOperator,
  MOMOperator,
} from '@data-analysis/operators';

export default class MainServices {
  private key: string; // 例子: 'BTC'
  map = new Map(); // k线数据
  lastId: number = 0; // 最后一个存储的 Id
  kLine = new Queue(15); // 单调队列

  macd = new MacdOperator(6, 13, 4);
  rsi = new RsiOperator(5);
  mom = new MOMOperator(12);

  constructor(key: string, WS_URL: string, param: any) {
    this.key = key;
    console.log(this.key, ' 显示品种');
    this.onLoad({ WS_URL, param });
  }

  async onLoad({ WS_URL = '', param = {} }: any) {
    // 初始化 BTC 的数据
    await historyKline(param);
    websocket(WS_URL, param);
  }

  async addItem(item: any = {}) {
    const { id, ...rest } = item;

    this.kLine.push(item);

    this.macd.addItem(item);
    this.rsi.addItem(item);
    this.mom.addItem(item);

    this.map.set(id, {
      ...rest,
    });
    // 存储最后一个id
    this.lastId = id;
  }

  // 获取历史k线
  getMapItem = (limit = 5) => this.kLine.getItems(limit);
}
