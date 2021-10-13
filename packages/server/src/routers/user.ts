import KoaRouter from '@koa/router';

import HbApi from '@data-analysis/utils/http';

const userRouter = new KoaRouter({
  prefix: '/user',
});

userRouter.get('/', async (ctx) => {
  // 永续 合约 账户金额
  const account = await HbApi.restApi({
    path: `/linear-swap-api/v1/swap_cross_account_info`,
    method: 'POST',
    body: { margin_account: 'USDT' },
  });
  console.log('account:', account[0]);
  ctx.body = account[0];
});

export default userRouter;
