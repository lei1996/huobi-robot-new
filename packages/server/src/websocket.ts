import WebSocket from 'ws';
import pako from 'pako';

import { sleep } from '@data-analysis/utils';
import { GlobalData } from './global/data';

export const websocket = (WS_URL: string = '', param: any) => {
  const ws = new WebSocket(WS_URL);
  const { contract_code = 'BTC', period } = param;

  // 上一根k线
  let prev = {
    id: 0,
  };

  const handle = (data: any = {}) => {
    if (prev.id !== data.id) {
      GlobalData[contract_code].addItem(prev.id === 0 ? data : prev);

      prev = data;
    }
  }

  ws.on('open', () => {
    ws.send(
      JSON.stringify({
        sub: `market.${contract_code}-USDT.kline.${period}`,
        id: `id1`,
      }),
    );
  });

  ws.on('message', (data: any) => {
    const msg = JSON.parse(
      pako.inflate(data, {
        to: 'string',
      }),
    );

    if (msg.ping) {
      ws.send(
        JSON.stringify({
          pong: msg.ping,
        }),
      );
    } else if (msg.tick) {
      handle(msg.tick);
    } else {
      // console.log(msg);
    }
  });

  ws.on('close', async () => {
    console.log('close');
    await sleep(5000);
    websocket(WS_URL, param);
  });

  ws.on('error', (err) => {
    console.log('error', err);
    websocket(WS_URL, param);
  });
};