import { EMA, MACD } from 'trading-signals';

import { getNowTime } from '@data-analysis/utils';
import { BaseOperator, Equalizer, WareHouse } from '../base';

export class MacdOperator extends BaseOperator {
    readonly indicator: MACD;
    readonly wareHouse: WareHouse;
    readonly equalizer: Equalizer;

    constructor(shortInterval: number, longInterval: number, signalInterval: number,) {
        super();

        this.indicator = new MACD({
            indicator: EMA,
            shortInterval: shortInterval,
            longInterval: longInterval,
            signalInterval: signalInterval,
        })
        this.wareHouse = new WareHouse();
        this.equalizer = new Equalizer(6, 13, 4);
    }

    getResult(): any {
        return [this.wareHouse.map, this.equalizer.getResult()];
    }

    addItem(item: any = {}): void {
        const { id, open, close, high, low, vol } = item;

        this.indicator.update(close);

        if (this.indicator.isStable) {
            const { histogram, macd, signal } = this.indicator.getResult();
            const obj: any = {
                histogram: histogram.round(8).toString(),
                macd: macd.round(8).toString(),
                signal: signal.round(8).toString(),
            };

            console.log(getNowTime(id), close, obj.histogram, 'macd --');

            let info = ''; // '开多' || '开空'
            let bool = false; // 开关

            // 小于0 && 之前柱子是正的
            if (histogram.lt(0) && (this.prev === 'UP' || this.prev === '')) {
                info = '开空';
                bool = true;
                this.prev = 'DOWN';
            } else if (histogram.gt(0) && (this.prev === 'DOWN' || this.prev === '')) {
                info = '开多';
                bool = true;
                this.prev = 'UP';
            }

            if (bool) {
                // 执行开仓操作 && 平仓之前的交易
                this.wareHouse.addItem({
                    indicatorData: obj,
                    lastTime: this.lastTime,
                    item,
                    info,
                    isLock: this.equalizer.IsLock
                });
                
                this.equalizer.addItem(this.wareHouse.sum ?? 0, this.wareHouse.diff, getNowTime(id));

                this.lastTime = id;
            }
        }
    }
}