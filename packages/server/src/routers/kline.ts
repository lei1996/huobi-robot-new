import KoaRouter from '@koa/router';

import { Kline } from '../huobi/historyKline';

const klineRouter = new KoaRouter({
  prefix: '/kline',
});

klineRouter.get('/', async (ctx) => {
  const {
    contract_code = 'BTC',
    period = '1min',
    size,
    from,
    to,
  } = ctx.request.query;

  // 历史k线数据
  const result = await Kline({
    contract_code: contract_code,
    period: period,
    size: size,
    from,
    to,
  });

  ctx.body = result;
});

export default klineRouter;
