import KoaRouter from '@koa/router';

import { position } from '../huobi/position';

const positionRouter = new KoaRouter({
    prefix: '/position',
});

positionRouter.get('/', async (ctx) => {
    const { key = 'BTC' } = ctx.request.query;

    const res = await position({
        contractCode: key,
    });

    ctx.body = res;
});

export default positionRouter;
