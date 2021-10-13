import Big from 'big.js';
import { makeAutoObservable } from 'mobx';

import { fetchKlineData, fetchUserData, fetchOrderInfo } from '../huobi/http';

import { kLine } from '@data-analysis/types/kline.type';
import { EqualizerResult } from '@data-analysis/types/operator.type';

import {
  MacdOperator,
  RsiOperator,
  AmountOperator,
  MOMOperator,
} from '@data-analysis/operators';

// 这里获取数据处理数据 一定要精简

class Store {
  kLine: kLine = {
    contract_code: 'BTC',
    period: '5min',
    size: '100',
  };

  user: any = {
    margin_mode: '', // cross 全仓
    margin_balance: new Big(0), // 账户权益
    margin_account: '', // 账户类型
    profit_real: new Big(0), // 已实现盈亏
    profit_unreal: new Big(0), // 未实现盈亏（所有全仓仓位汇总）
  };

  contractList: string[] = []; // 合约交易对名称列表

  operator: MacdOperator | RsiOperator | MOMOperator = new MacdOperator(
    6,
    13,
    4,
  );
  amount: AmountOperator = new AmountOperator(7);
  operatorIndex: number = 0;
  operatorList: string[] = ['mom', 'macd', 'rsi'];

  result: EqualizerResult = {
    xAxisTexts: [],
    before: [],
    after: [],
    macd: [],
  };

  constructor() {
    this.loadUserData();
    this.onLoad();
    this.orderInfo();
    // this.onAmountLoad();
    makeAutoObservable(this);
  }

  async orderInfo() {
    const res = await fetchOrderInfo({
      contractCode: 'BTC-USDT',
      orderId: '880094114119942144,880098665195638786',
    });

    console.log(res);
  }

  async loadUserData() {
    const res = await fetchUserData();

    const {
      margin_mode,
      margin_balance,
      margin_account,
      profit_real,
      profit_unreal,
      contract_detail = [],
    } = res;

    this.user = {
      margin_mode,
      margin_balance,
      margin_account,
      profit_real,
      profit_unreal,
    };
    this.contractList = contract_detail.map((arr: any) => arr.symbol);
  }

  async onAmountLoad({ from, to }: any) {
    const arrs: Array<any> = await fetchKlineData({
      contract_code: 'BTC',
      period: '1min',
      from,
      to,
    });

    this.amount = new AmountOperator(7);

    for (const arr of arrs) {
      this.amount.addItem(arr);
    }

    console.log(this.amount.getResult(), 'amount');
  }

  async onLoad() {
    const arrs: Array<any> = await fetchKlineData(this.kLine);

    switch (this.operatorList[this.operatorIndex]) {
      case 'macd':
        this.operator = new MacdOperator(6, 13, 4);
        break;
      case 'rsi':
        this.operator = new RsiOperator(5);
        break;
      case 'mom':
        this.operator = new MOMOperator(12);
        break;

      default:
        this.operator = new MacdOperator(6, 13, 4);
        break;
    }

    // 单次
    // this.onAmountLoad({
    //     from: arr.id,
    //     to: arr.id + ((5 - 1) * 60),
    // })

    this.onAmountLoad({
      from: arrs[0].id,
      to: (new Date().getTime() / 1000) | 0,
    });

    for (const arr of arrs) {
      this.operator.addItem(arr);
    }

    this.result = this.operator.equalizer.getResult();
  }
}

const store = new Store();
export default store;
