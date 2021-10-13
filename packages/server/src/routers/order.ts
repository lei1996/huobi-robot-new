import KoaRouter from '@koa/router';

import { order, orderInfo, orderDetail } from '../huobi/order';
import { OrderInfoInterface } from '@data-analysis/types/order.type';

const orderRouter = new KoaRouter({
  prefix: '/order',
});

orderRouter.get('/', async (ctx) => {
  const { info } = ctx.request.query;
  // const res = await order({
  //   info: info as string,
  // });

  // ctx.body = res;
  ctx.body = 'hello';
});

orderRouter.get('/info', async (ctx) => {
  const { contractCode, orderId, clientOrderId } = ctx.request.query;

  const body: OrderInfoInterface = {
    contractCode: contractCode as string,
    orderId: orderId as string,
    clientOrderId: clientOrderId as string,
  };

  const res = await orderInfo(body);

  ctx.body = res;
});

export default orderRouter;
