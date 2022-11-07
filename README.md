<p align="center">
  <img width="300" src="./assets/logo.svg" alt="logo of vite-plugin-conditional-compiler repository">
</p>

<h2 align='center'>vite-plugin-conditional-compiler</h2>

<p align="center">Conditional compilation syntax based on environment variables</p>

English | [简体中文](./README.zh-CN.md)

## Installation

```
pnpm i -D vite-plugin-conditional-compiler
```

## Usage

```ts
// vite.config.ts
import { defineConfig } from "vite";
import ConditionalCompile from "vite-plugin-conditional-compiler";

export default defineConfig({
  plugins: [ConditionalCompile()],
});
```

## Syntax

Start with `#v-ifdef` or `#v-ifndef` then append `%ENV%`, end with `#v-endif`

- `#v-ifdef`: if defined
- `#v-ifndef`: if not defined
- `%ENV%` Vite environment variables

## Configuration

```ts
export interface Options {
  /**
   * @default ["**/*"]
   */
  include: FilterPattern;
  /**
   * @default []
   */
  exclude: FilterPattern;
}
```

## Examples

```js
// Compile in production environment only
// #v-ifdef PROD
value = 1;
// #v-endif
```

```css
/* Compile except the development environment */
/* #v-ifndef DEV */
.code {
}
/* #v-endif */
```

```js
// Condition or, not supported &&
// Compile in production or development
// #v-ifdef PROD||DEV
value = 1;
// #v-endif
```

```js
// Allow custom environment variables
// Compile only when 'VITE_MY_ENV' exists and is not false
// #v-ifdef VITE_MY_ENV
value = 1;
// #v-endif
```

```js
// Allow specified values
// Compile only when 'VITE_MY_ENV' exists and is equal to hi
// #v-ifdef VITE_MY_ENV=hi
value = 1;
// #v-endif
```

## Other

With the better-comments plugin in VsCode, syntax can be highlighted

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
