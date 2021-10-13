import Big, { BigSource } from 'big.js';
import { EMA, MACD, RSI, MOM } from 'trading-signals';

import { getNowTime, isOverFlowTime } from '@data-analysis/utils';
import { EqualizerResult } from '@data-analysis/types/operator.type';

// 注意 类的单一职责， 不需要丢太多繁杂的代码进去
// 现在头有些晕乎乎的，我想将执行策略，和读取渲染回测数据分离开来

/// 均衡器的锁，可以对照值，比如after的值高于before，当 histogram 小于0， 启用限制
/// 如果是负优化，优化后的值还要低于原始值，则不启用均衡器
export class Equalizer {
  indicator: MACD;
  result?: EqualizerResult = {
    xAxisTexts: [],
    before: [],
    after: [],
    macd: [],
  };

  beforeSum?: Big = new Big(0); // 修正前的累加和
  sum?: Big = new Big(0); // 修正后的累加值
  isLock?: Boolean = false;

  constructor(
    shortInterval: number,
    longInterval: number,
    signalInterval: number,
  ) {
    // 初始化 macd 均衡器
    this.indicator = new MACD({
      indicator: EMA,
      shortInterval: shortInterval,
      longInterval: longInterval,
      signalInterval: signalInterval,
    });
  }

  // 是否限制当前策略实盘开仓 模拟策略还是在不断执行
  get IsLock() {
    const { xAxisTexts, before, after }: any = this.result;
    const n = after.length;
    const diff = new Big(before[n - 1] ?? 0).minus(new Big(after[n - 1] ?? 0));
    // 这里用来调试
    // console.log(diff.gt(0) ? false : this.isLock, diff.round(8).toString(), after[n - 1], before[n - 1], xAxisTexts[n - 1]);

    // 修正前的数据大于修正后的数据，表明当前优化是负优化，false 为允许开仓, 否则返回isLock 判断是否可以开仓
    return diff.gt(0) ? false : this.isLock;
  }

  // 返回数据 绘制图表使用的
  getResult(): any {
    return this.result;
  }

  addItem(_price: BigSource, diff: BigSource, time: string): void {
    this.indicator.update(_price);

    if (this.indicator.isStable) {
      const { histogram, macd, signal } = this.indicator.getResult();

      const obj: any = {
        histogram: histogram.round(8).toString(),
        macd: macd.round(8).toString(),
        signal: signal.round(8).toString(),
      };

      // 修正前的数值 累加和
      this.beforeSum = this.beforeSum?.plus(diff);

      // 当上锁的状态不进行累加操作，
      if (!this.isLock) {
        this.sum = this.sum?.plus(diff);
      }

      // 小于0 表明当前策略执行不乐观，需要锁定实盘开仓
      if (histogram.lt(0)) {
        this.isLock = true;
      } else {
        this.isLock = false;
      }

      // 这里push的数据是用来回测数据使用的 在客户端绘制图表.
      this.result?.xAxisTexts.push(time);
      this.result?.before.push(this.beforeSum?.toString());
      this.result?.after.push(this.sum?.toString());
      this.result?.macd.push(obj.histogram);
    }
  }
}

// 开平仓 仓库
export class WareHouseNew {
  map?: Map<string | number, any> = new Map(); // 开平仓数据
  diff: Big = new Big(0); // 当前平仓获利点数
  sum?: Big = new Big(0); // 累计盈利点数

  count: number = 0; // 开仓次数
  lastTime: string[] = []; // 上一次开仓的时间

  constructor(readonly maxLimit: number) {}

  // 开仓
  async open({ id, _price, info }: any) {
    if (this.count >= this.maxLimit) return;

    // 开仓
    this.map?.set(id, [
      {
        info,
        close: _price,
        time: getNowTime(id),
      },
    ]);

    this.lastTime.push(id);

    this.count++;
  }

  // 平仓
  async close({ id, _price }: any) {
    if (this.count === 0) return;

    const lastTime: string = this.lastTime.shift() ?? '';
    const [openOrder] = this.map?.get(lastTime);

    // 平仓信息
    this.map?.set(lastTime, [
      openOrder,
      {
        info: openOrder.info === '开多' ? '平多' : '平空',
        close: _price,
        time: getNowTime(id),
      },
    ]);

    // 当前平仓获利点数
    this.diff =
      openOrder.info === '开多'
        ? new Big(_price).minus(new Big(openOrder.close))
        : new Big(openOrder.close).minus(new Big(_price));

    // 总赢利点
    this.sum = this.sum?.plus(this.diff);

    this.count--;
  }

  // 清仓
  async closeAll({ id, _price }: any) {
    if (this.count === 0) return;

    const diff = new Big(0);

    while (!!this.lastTime.length) {
      this.close({ id, _price });
      diff.plus(this.diff);
    }

    this.diff = diff;
  }
}

// 开平仓 仓库
export class WareHouse {
  map?: Map<string | number, any> = new Map(); // 开平仓数据
  diff: Big = new Big(0); // 当前平仓获利点数
  sum?: Big = new Big(0); // 累计盈利点数

  // 添加开平仓数据
  async addItem({ indicatorData, lastTime, item, info, isLock }: any) {
    const { id, open, close } = item;

    if (this.map?.has(lastTime)) {
      const [openOrder] = this.map?.get(lastTime);

      // api 调用order平仓 需要判断 id 时间戳是否是最近2分钟以内的
      if (openOrder.orderID) {
        // await order({
        //   info: openOrder.info === '开多' ? '平空' : '平多',
        //   clientOrderId: openOrder.orderID,
        // });
      }

      this.diff =
        openOrder.info === '开多'
          ? new Big(close).minus(new Big(openOrder.close))
          : new Big(openOrder.close).minus(new Big(close));

      this.sum = this.sum?.plus(this.diff);

      // 平仓信息
      this.map?.set(lastTime, [
        openOrder,
        {
          info: openOrder.info === '开多' ? '平多' : '平空',
          open,
          close,
          indicator: indicatorData,
          time: getNowTime(id),
        },
      ]);
    }

    let res: any = {};

    // api 调用order开仓 需要 记录信息 orderID 信息 需要判断 id 时间戳是否是最近2分钟以内的
    if (!isLock && !isOverFlowTime(id, 15)) {
      // const price = info === '开多' ? new Big(close).minus(150).toString() : new Big(close).plus(150).toString();
      // res = await order({
      //   info,
      //   // sl_trigger_price: price, // 止损触发价格
      //   // sl_order_price: price, // 止损委托价格（最优N档委托类型时无需填写价格）
      //   // sl_order_price_type: 'optimal_5', // 止损委托类型
      // });
    }

    // 开仓
    this.map?.set(id, [
      {
        info: info,
        open,
        close,
        indicator: indicatorData,
        orderID: res.order_id,
        time: getNowTime(id),
      },
    ]);
  }
}

export interface Operator<T> {
  getResult(): T;

  addItem(...args: any): void;
}

// abstract 相当于只是定义函数或者类， 丢给子类去具体实现. 相当于规范流程
export abstract class BaseOperator implements Operator<Big> {
  protected result?: Array<any> = []; // protected 受保护的，子类继承可以直接 this.result 访问

  abstract indicator: MACD | RSI | MOM; // 使用的指标

  protected lastTime: string = ''; // 上一次开仓的时间

  protected prev: string = ''; // 'UP' 开多 'DOWN' 开空

  abstract getResult(): Big;

  abstract addItem(...args: any): void;
}
