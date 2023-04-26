import solid from "solid-start/vite";
import solidSvg from 'vite-plugin-solid-svg'
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    solid({ssr: false,}),
    solidSvg(),
  ],
});
