# star-picture-vue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### 如何测试登录和注册

登录和注册依赖**后端接口**，前端请求的地址是 `http://localhost:8123`（见 `src/request.ts`）。

**1. 启动后端**

- 确保你有对应的后端项目（提供 `/api/user/login`、`/api/user/register` 等接口）。
- 在后端项目里启动服务，并保证运行在 **8123 端口**（或把前端的 `baseURL` 改成你后端的地址）。

**2. 启动前端**

```sh
npm run dev
```

浏览器打开终端里提示的地址（一般是 `http://localhost:5173`）。

**3. 测试注册**

- 打开：<http://localhost:5173/user/register>
- 填写：账号、密码、确认密码（密码至少 8 位）
- 点击「注册」，成功后会跳转到登录页

**4. 测试登录**

- 打开：<http://localhost:5173/user/login>
- 用刚注册的账号和密码登录
- 登录成功会跳转到首页，右上角会显示你的头像/昵称

**5. 常见问题**

- **请求报错 / 网络错误**：检查后端是否已启动、端口是否为 8123、后端是否允许跨域（CORS）并携带 Cookie（`withCredentials: true`）。
- **登录后刷新又变未登录**：检查后端是否通过 Cookie 或 Session 保持登录态，以及接口是否返回 40100 等未登录状态码（见 `src/request.ts` 和 `src/access.ts`）。

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
