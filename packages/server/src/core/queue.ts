// 单调栈
// 最大最小值
export default class Queue {
  queue: Array<any> = [];

  constructor(readonly maxLength: number) {}

  // 往队列推入一个 k线对象
  push(item: any) {
    if (this.queue.length > this.maxLength) {
      this.queue.shift();
    }
    this.queue.push(item);
  }

  // 从第一个位置弹出元素
  shift() {
    if (!this.queue.length) {
      return -1;
    }
    const val = this.queue.shift();

    return val;
  }

  // 返回队列数据 limit 限制长度
  getItems(limit = 5) {
    if (limit > this.queue.length) {
      return this.queue;
    }

    return this.queue.slice(this.queue.length - limit);
  }
}
