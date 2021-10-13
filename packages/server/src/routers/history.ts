import KoaRouter from '@koa/router';

import { GlobalData } from '../global/data';

const historyRouter = new KoaRouter({
  prefix: '/history',
});

historyRouter.get('/', async (ctx) => {
  const { key = 'BTC', indicator = 'rsi' } = ctx.request.query;

  if (!GlobalData[key as string][indicator as string]) {
    ctx.body = 'hello';
    return;
  }

  ctx.body = GlobalData[key as string][indicator as string].equalizer.getResult();
});

export default historyRouter;
