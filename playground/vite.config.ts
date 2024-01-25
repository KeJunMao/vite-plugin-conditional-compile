import { defineConfig } from "vite";
import ConditionalCompile from "../src";

export default defineConfig({
  plugins: [
    ConditionalCompile()
  ]
})
