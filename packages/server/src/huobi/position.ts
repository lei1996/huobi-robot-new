import HbApi from '@data-analysis/utils/http';

// 当前全仓usdt合约 持仓情况
export const position = async ({ contractCode }: any): Promise<any> => {
  const body = {
    contract_code: !!contractCode ? `${contractCode}-USDT` : '',
  };

  const res = await HbApi.restApi({
    path: `/linear-swap-api/v1/swap_cross_position_info`,
    method: 'POST',
    body: body,
  });

  return res;
};
