import axios from 'axios';

import { kLine } from '@data-analysis/types/kline.type';
import { OrderInfoInterface } from '@data-analysis/types/order.type';

const spliceURL = (obj: any): string => {
  if (obj.constructor !== Object) return '';

  let param = '';

  Object.keys(obj).map((key: string) => {
    if (param === '') {
      param += `?${key}=${obj[key]}`;
    } else {
      param += `&${key}=${obj[key]}`;
    }
  });

  return param;
};

// 获取k线数据
export const fetchKlineData = async (kline: kLine) => {
  const param = spliceURL({
    ...kline,
    contract_code: kline.contract_code + '-USDT',
  });

  const res: any = await axios.get(
    `http://youdomain.com:7777/kline${param}`,
  );

  return res.data;
};

// 获取用户账户信息
export const fetchUserData = async () => {
  const res: any = await axios.get(`http://youdomain.com:7777/user`);

  return res.data;
};

// 【全仓】获取合约订单信息
export const fetchOrderInfo = async (orderInfo: OrderInfoInterface) => {
  const param = spliceURL(orderInfo);

  const res: any = await axios.get(
    `http://youdomain.com:7777/order/info${param}`,
  );

  return res.data;
};
