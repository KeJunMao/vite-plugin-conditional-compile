import { defineConfig } from "vite";
import ConditionalCompile from "..";

export default defineConfig({
    plugins: [
        ConditionalCompile()
    ]
})