import { describe, it } from "vitest";
import { createContext } from "../src/context";
import { resolveOptions } from "../src/options";
import { resolve } from "node:path";
import fs from "fs-extra";
import fg from "fast-glob";

async function getGlobContent(cwd: string, glob: string) {
  return await fg(glob, { cwd, absolute: true })
    .then((r) => Promise.all(r.map((f) => fs.readFile(f, "utf8"))))
    .then((r) => r.join("\n"));
}

async function createCtxWithEnv(env: Record<string, any> = {}) {
  const opts = resolveOptions();
  const ctx = createContext(opts);
  ctx.env = env
  return ctx;
}

describe("Context", async () => {
  const root = resolve(__dirname, "fixtures/code");
  const sourceCode = await getGlobContent(root, "*.*");
  it("empty env", async ({ expect }) => {
    const ctx = await createCtxWithEnv();
    const transformCode = ctx.transform(sourceCode, "fixtures");
    expect(transformCode).not.to.equal(undefined);
    expect(transformCode).toMatchSnapshot();
  });
  it("DEV env", async ({ expect }) => {
    const ctx = await createCtxWithEnv({
      DEV: true,
    });
    const transformCode = ctx.transform(sourceCode, "fixtures");
    expect(transformCode).not.to.equal(undefined);
    expect(transformCode).toMatchSnapshot();
  });
  it("PROD env", async ({ expect }) => {
    const ctx = await createCtxWithEnv({
      PROD: true,
    });
    const transformCode = ctx.transform(sourceCode, "fixtures");
    expect(transformCode).not.to.equal(undefined);
    expect(transformCode).toMatchSnapshot();
  });
});
