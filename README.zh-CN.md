# vite-plugin-conditional-compiler

基于环境变量的条件编译语法

[English](./README.md) | 简体中文

## 语法

以 `#v-ifdef` 或 `#v-ifndef` 加 `%ENV%` 开头，以 `#v-endif` 结尾。

- `#v-ifdef`：if defined 仅在某环境下编译
- `#v-ifndef`：if not defined 除了某环境均编译
- `%ENV%` Vite 中的环境变量

## 安装

```
pnpm i -D vite-plugin-conditional-compiler
```

## 使用

```ts
// vite.config.ts
import { defineConfig } from "vite";
import ConditionalCompile from "vite-plugin-conditional-compiler";

export default defineConfig({
  plugins: [ConditionalCompile()],
});
```

## 例子

```js
// 仅在生产环境下编译
// #v-ifdef PROD
value = 1;
// #v-endif
```

```css
/* 除了开发环境都编译 */
/* #v-ifndef DEV */
.code {
}
/* #v-endif */
```

```js
// 条件或，暂不支持&&
// 生产环境或者开发环境下编译
// #v-ifdef PROD||DEV
value = 1;
// #v-endif
```

```js
// 允许使用自定义环境变量
// 仅在 VITE_MY_ENV 存在且不为 false 时编译
// #v-ifdef VITE_MY_ENV
value = 1;
// #v-endif
```

```js
// 允许使用指定值
// 仅在 VITE_MY_ENV 存在且等于 hi 时编译
// #v-ifdef VITE_MY_ENV=hi
value = 1;
// #v-endif
```

## 其他

在 Vscode 中配合 better-comments 插件可以有语法高亮

```json
{
  "tag": "#v",
  "color": "#fff",
  "strikethrough": false,
  "underline": false,
  "backgroundColor": "#0000ff",
  "bold": true,
  "italic": false
}
```
