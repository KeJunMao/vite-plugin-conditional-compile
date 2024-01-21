import { describe, it, expect } from "vitest";
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

describe("Performance", async () => {
  const root = resolve(__dirname, "fixtures/code");
  it("with 100000", async ({ expect }) => {
    const sourceCode = await getGlobContent(root, "*.*");
    const ctx = await createCtxWithEnv();
    for (let i = 0; i < 100000; i++) {
      const transformCode = ctx.transform(sourceCode, "fixtures");
      expect(transformCode).not.to.equal(undefined);
    }
  });

  it.skip("with node_modules", () => {
    const ctx = createContext(resolveOptions());
    const files = fg.sync('**/*.*', { cwd: resolve(__dirname, '../node_modules/.pnpm'), absolute: true, onlyFiles: true })
    console.log(files.length);

    for (const file of files) {
      const sourceCode = fs.readFileSync(file, 'utf8')
      const transformCode = ctx.transform(sourceCode, "fixtures");
      expect(transformCode).not.to.equal(undefined);
    }
  })
});
