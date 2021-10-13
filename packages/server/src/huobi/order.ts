import HbApi from '@data-analysis/utils/http';

import {
  OrderInterface,
  OrderInfoInterface,
  OrderDetailInterface,
} from '@data-analysis/types/order.type';

// 订单枚举
const orderEnum: any = {
  多: 'buy',
  空: 'sell',
  开: 'open',
  平: 'close',
};

// "tp_trigger_price": 31000, // 止盈触发价格
// "tp_order_price": 31000, // 止盈委托价格（最优N档委托类型时无需填写价格）
// "tp_order_price_type": "optimal_5", // 止盈委托类型
// "sl_trigger_price": "29100", // 止损触发价格
// "sl_order_price": "29100", // 止损委托价格（最优N档委托类型时无需填写价格）
// "sl_order_price_type": "optimal_5" // 止损委托类型

// 开/平 仓
export const order = async ({
  info = '开多', // 默认信息
  contractCode = 'BTC',
  clientOrderId = '', // 订单id
  volume = 1, // 张数
  level_rate = 5, // 杠杆倍数
  ...rest
}: OrderInterface): Promise<any> => {
  const [a, b] = info.split('');

  const offset = orderEnum[a];
  const direction = orderEnum[b];

  const body = {
    contract_code: !!contractCode ? `${contractCode}-USDT` : 'BTC-USDT',
    client_order_id: clientOrderId,
    volume: volume ?? 1,
    direction: direction,
    offset: offset,
    lever_rate: level_rate ?? 5,
    order_price_type: 'opponent',
    ...rest,
  };

  console.log(offset, direction, clientOrderId, body, '订单');

  const res = await HbApi.restApi({
    path: `/linear-swap-api/v1/swap_cross_order`,
    method: 'POST',
    body: body,
  });

  console.log(res, '订单接口 res');

  return res;
};

// 【全仓】获取合约订单信息
export const orderInfo = async ({
  contractCode: contract_code,
  orderId: order_id,
  clientOrderId: client_order_id,
}: OrderInfoInterface) => {
  const body = {
    contract_code,
    order_id,
    client_order_id,
  };

  const res = await HbApi.restApi({
    path: `/linear-swap-api/v1/swap_cross_order_info`,
    method: 'POST',
    body: body,
  });

  return res;
};

// 【全仓】获取合约订单信息
export const orderDetail = async ({
  contract_code,
  order_id,
  created_at,
  order_type,
  page_index,
  page_size,
}: OrderDetailInterface) => {
  const body = {
    contract_code,
    order_id,
    created_at,
    order_type,
    page_index,
    page_size,
  };

  const res = await HbApi.restApi({
    path: `/linear-swap-api/v1/swap_cross_order_detail`,
    method: 'POST',
    body: body,
  });

  return res;
};
