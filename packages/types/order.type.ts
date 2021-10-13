export interface OrderInfoInterface {
  contractCode: string; // 合约代码
  orderId?: string; // 订单ID
  clientOrderId?: string; // 客户订单ID
}

export interface OrderInterface {
  info?: string;
  contractCode?: string;
  clientOrderId?: string;
  volume?: number;
  level_rate?: number;
  sl_trigger_price?: string;
  sl_order_price?: string;
  sl_order_price_type?: string;
}

export interface OrderDetailInterface {
  contract_code: string; // 合约代码  "BTC-USDT"
  order_id: string; // 订单id
  created_at?: string; // 下单时间戳
  order_type?: string; // 订单类型   1:报单 、 2:撤单 、 3:强平、4:交割
  page_index?: string; // 第几页,不填第一页
  page_size?: string; // 不填默认20，不得多于50
}
