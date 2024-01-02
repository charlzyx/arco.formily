import * as path from "path";
import { defineConfig } from "rspress/config";
import RsBuildConfig from "./rsbuild.config";
import { pluginPreview } from "@rspress/plugin-preview";

export default defineConfig({
  plugins: [pluginPreview()],
  root: path.join(__dirname, "docs"),
  title: "arco.formily React",
  description: "Formily Impl for Arco Design React",
  icon: "/arco.png",
  logo: {
    light: "/arco.png",
    dark: "/arco.png",
  },
  builderConfig: {
    ...(RsBuildConfig as any),
  },
  themeConfig: {
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/charlzyx/arco.formily",
      },
    ],
  },
});
