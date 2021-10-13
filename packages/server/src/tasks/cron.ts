import { CronJob } from 'cron';

import HbApi from '@data-analysis/utils/http';
import { GlobalData } from '../global/data';

// cron 参数范围 * * * * * *
// Seconds: 0-59
// Minutes: 0-59
// Hours: 0-23
// Day of Month: 1-31
// Months: 0-11 (Jan-Dec)
// Day of Week: 0-6 (Sun-Sat)

// start

export const cron = new CronJob('0 * * * * *', async () => {
  console.log('Executing cron job once every hour');
});

export const fixDataCron = new CronJob('0 */5 * * * *', async () => {
  console.log('每隔5分钟执行一次任务调度', new Date().getTime());
});

// 定期执行里面的策略。跑
export const monitorCron = new CronJob('0 */17 * * * *', async () => {
  console.log('每隔17分钟执行一次任务调度', new Date().getTime());
});
