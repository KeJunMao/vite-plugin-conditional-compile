// #v-ifdef DEV
import { test } from "vitest";
console.log("DEV", "vitest");
// #v-else
import { test } from "node:test";
console.log("DEV else", "node:test");
// #v-endif
