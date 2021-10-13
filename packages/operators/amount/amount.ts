import { EMA, RSI } from 'trading-signals';

import { getNowTime } from '@data-analysis/utils';
import { BaseOperator } from '../base';

// 量能
export class AmountOperator extends BaseOperator {
    readonly indicator: RSI
    lastTime: string = '';

    constructor(length: number) {
        super();
        this.indicator = new RSI(length, EMA);
    }

    getResult(): any {
        return this.result ?? [];
    }


    addItem(item: any = {}): void {
        const { id, close, amount } = item;

        this.indicator.update(amount);

        if (this.indicator.isStable) {
            const num = this.indicator.getResult();

            if (num.gt(80)) {

                console.log(getNowTime(id), amount, num.round(8).toString(), 'num --');

                // 当前量能的价格要与数组之前的 价格做比较, 放量的位置要么是 压力位 要么是支撑位
                this.result?.push({
                    id,
                    amount,
                    close
                });

                this.lastTime = id;
            }
        }
    }

}