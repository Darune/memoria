import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    solid({ssr: false,}),
  ],
  build: {
    commonjsOptions: {
      strictRequires: "debug",
      // include: ['node_modules/better-sqlite3/build/Release/better_sqlite3.node'],
      ignoreDynamicRequires: true,
      // dynamicRequireTargets: [
      //   'node_modules/better-sqlite3/**/*.node',
      //   'node_modules/better-sqlite3/build/Release/better_sqlite3.node',
      // ],
      // extensions: [
      //   '.js',
      //   '.node',
      // ]
    }
  }
});
