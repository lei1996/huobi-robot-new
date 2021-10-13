import KoaRouter from '@koa/router';

import { GlobalData } from '../global/data';

const mainRouter = new KoaRouter({
  prefix: '/main',
});

mainRouter.get('/', async (ctx) => {
  const arr = [];

  // console.log(222);
  for (const [id, value] of GlobalData.BTC.map) {
    // console.log(id, value);
    arr.push({ id, ...value });
  }

  ctx.body = arr;
});

export default mainRouter;
