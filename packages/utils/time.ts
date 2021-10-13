import moment from 'moment';

// k线的时间戳 10位
export const getTime = () =>
  new Date(moment().format('YYYY-MM-DD HH:mm')).getTime() / 1000;

// 输出时间
export const getNowTime = (id: any) =>
  `${moment(Number(`${id}000`))
    .utcOffset(8 * 60)
    .format('YYYY/MM/DD HH:mm:ss')}`;

// 当前时间
export const nowTime = () =>
  moment(new Date())
    .utcOffset(8 * 60)
    .format('YYYY/MM/DD HH:mm:ss');

// 判断时间是否超出限制
export const isOverFlowTime = (id: any, minute: number) => {
  const diffTime = ((new Date().getTime() / 1000) | 0) - +id;
  return diffTime > minute * 60;
};
