import { EMA, MOM } from 'trading-signals';

import { getNowTime } from '@data-analysis/utils';
import { BaseOperator, Equalizer, WareHouse } from '../base';

export class MOMOperator extends BaseOperator {
    readonly indicator: MOM;
    readonly wareHouse: WareHouse;
    readonly equalizer: Equalizer;

    constructor(length: number) {
        super();
        this.indicator = new MOM(length);
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
            const num = this.indicator.getResult();

            // console.log(getNowTime(id), close, num.round(8).toString(), 'num --');
            

            let info = ''; // '开多' || '开空'
            let bool = false; // 开关

            // 小于0 && 之前柱子是正的
            if (num.gt(0) && (this.prev === 'UP' || this.prev === '')) {
                info = '开空';
                bool = true;
                this.prev = 'DOWN';
            } else if (num.lt(0) && (this.prev === 'DOWN' || this.prev === '')) {
                info = '开多';
                bool = true;
                this.prev = 'UP';
            }

            if (bool) {
                // 执行开仓操作 && 平仓之前的交易
                this.wareHouse.addItem({
                    indicatorData: num.round(8).toString(),
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