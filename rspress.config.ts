import * as path from "path";
import { defineConfig } from "rspress/config";
import RsBuildConfig from "./rsbuild.config";
import { pluginPreview } from "@rspress/plugin-preview";

export default defineConfig({
  base: "/arco.formily/",
  plugins: [pluginPreview()],
  root: path.join(__dirname, "docs"),
  title: "arco.formily",
  description: "Formily Components Adaptor of Arco Design React",
  icon: "/logo.png",
  logo: {
    light: "/logo.png",
    dark: "/logo.png",
  },
  builderConfig: {
    ...(RsBuildConfig as any),
  },
  themeConfig: {
    footer: {
      message: "Powered by RsPress. © 2024 charlzyx All Rights Reserved.",
    },
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/charlzyx/arco.formily",
      },
    ],
  },
});
