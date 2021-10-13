# data-analysis

Data Analysis server and client

## Hot to run

1. Install dependency. `yarn install`
2. Run development server. `yarn dev:server`
3. Open `http://localhost:7777` to view server response
4. Run development client. `yarn dev:client`,
5. Open `http://localhost:8080` to view client page

## Avaliable Scripts

- `yarn dev:server` start dev server
- `yarn start:server` start prod server
- `yarn dev:client` start dev client
- `yarn build:client` build prod client
- `npx lerna add [--scope xxx] [--dev] yyy` 为 scope=xxx 包添加 dev 依赖 yyy, 不加 scope 则给所有包添加依赖, 不加 dev 则添加非 dev 依赖


仅供测试学习使用。


全局搜索替换 http://youdomain.com 为你自己站点的域名.
全局搜索填写你自己的 accessKey secretKey.