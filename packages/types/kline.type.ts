export interface kLine {
  contract_code?: string;
  period?: string;
  size?: string;
  from?: string;
  to?: string;
  [key: string]: any;
}

// k线的数据modal
export interface KLineInterface {
  id: number; // 时间戳
  open: string; // 开盘价
  close: string; // 收盘价
  low: string; // 最低价
  high: string; // 最高价
  amount: string; // 成交量
  vol: number; //
  trade_turnover: string; // 成交额
  count: number;
}
