import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import { observer } from 'mobx-react';

import { css } from 'linaria';
import store from './store/store';

const styles = {
  title: css`
    color: blue;
  `,
  center: css`
    display: flex;
    justify-content: center;
    align-items: center;
  `,
};

const getOption = ({
  xAxisTexts = [],
  before = [],
  after = [],
  macd = [],
}: any) => {

  return {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['修正前数据', '修正后数据', 'macd数据']
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      data: xAxisTexts
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '修正前数据',
      type: 'line',
      smooth: true,
      data: before
    },
    {
      name: '修正后数据',
      type: 'line',
      smooth: true,
      data: after
    },
    {
      name: 'macd数据',
      type: 'line',
      smooth: true,
      data: macd
    },
    ],
  };
}

const indicator: any = {
  0: 'macd',
  1: 'rsi',
  2: 'mom',
}

const klinePeriod: string[] = ['1min', '5min', '15min', '30min', '60min', '4hour', '1day', '1week', '1mon'];

function App() {
  const [option, setOption] = useState({});
  const [touchIndicator, setTouchIndicator] = useState(0);


  const fetchData = async ({ indicator = 'macd' }) => {
    const res: any = await axios.get(`http://youdomain.com:7777/history?key=BTC&indicator=${indicator}`)

    setOption(getOption(res.data));
  }

  useEffect(() => {
    fetchData({ indicator: indicator[touchIndicator] });
  }, [touchIndicator]);


  const indicatorOnChange = (e: any) => {
    setTouchIndicator(e.target.value);
  }


  return (
    <div>
      <h1 className={styles.title}>App</h1>
      <div className={styles.center}>
        <div>当前权益： {JSON.stringify(store.user.margin_balance)}</div>
        <div>未实现盈亏: {JSON.stringify(store.user.profit_unreal)}</div>

        <select value={touchIndicator} onChange={indicatorOnChange}>
          {Object.keys(indicator).map((key) => {
            return <option key={key} value={key}>
              {indicator[key]}
            </option>
          })}
        </select>
      </div>

      <ReactECharts option={option} />

      <div className={styles.center}>
        {Object.keys(store.kLine).map((key) => {
          if (key === 'contract_code') {
            return <select value={store.kLine[key]} onChange={(evt) => store.kLine[key] = evt.target.value}>
              {store.contractList.map((iter, i) => {
                return <option key={i} value={iter}>{iter}</option>;
              })}
            </select>
          }
          if (key === 'period') {
            return <select value={store.kLine[key]} onChange={(evt) => store.kLine[key] = evt.target.value}>
              {klinePeriod.map((iter, i) => {
                return <option key={i} value={iter}>{iter}</option>;
              })}
            </select>
          }
          return <input key={key} value={store.kLine[key]} onChange={(evt) => store.kLine[key] = evt.target.value} />
        })}

        <select value={store.operatorIndex} onChange={(evt) => store.operatorIndex = +evt.target.value}>
          {store.operatorList.map((iter, i) => {
            return <option key={iter} value={i}>{iter}</option>
          })}
        </select>

        <button onClick={() => void store.onLoad()}>load data</button>
      </div>

      <ReactECharts option={getOption(store.result)} />
    </div>
  );
}

export default observer(App);
