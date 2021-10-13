import HbApi from '@data-analysis/utils/http';
import { GlobalData } from '../global/data';

export const Kline = ({
  contract_code,
  period,
  size,
  from, // 开始时间戳 10位 单位S
  to, // 结束时间戳 10位 单位S
}: any) =>
  HbApi.restApi({
    path: `/linear-swap-ex/market/history/kline`,
    method: 'GET',
    query: {
      contract_code,
      period,
      size,
      from,
      to,
    },
  });

export const historyKline = async ({
  contract_code = 'BTC',
  period = '1min',
  size = '480',
  from, // 开始时间戳 10位 单位S
  to, // 结束时间戳 10位 单位S
}: any) => {
  // 如果已经初始化过，直接 return 出去.
  // if (GlobalData.activeCrypto.has(contract_code)) {
  //   return;
  // }

  // 历史k线数据
  const arrs = await Kline({
    contract_code: !!contract_code ? `${contract_code}-USDT` : 'BTC-USDT',
    period: period ?? '1min',
    size: size ?? '480',
    from,
    to,
  });

  for (const arr of arrs) {
    GlobalData[contract_code].addItem(arr);
  }

  // 添加 初始化 的标识
  GlobalData.activeCrypto.add(contract_code);
};
