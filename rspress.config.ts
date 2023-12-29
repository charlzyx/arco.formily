import * as path from "path";
import { defineConfig } from "rspress/config";
import RsBuildConfig from "./rsbuild.config";
// import { pluginPlayground } from "@rspress/plugin-playground";
import { pluginPreview } from "@rspress/plugin-preview";

export default defineConfig({
  plugins: [pluginPreview()],
  root: path.join(__dirname, "docs"),
  title: "Formily Arco React",
  description: "Formily Impl for Arco Design React",
  icon: "/rspress-icon.png",
  logo: {
    light: "/rspress-light-logo.png",
    dark: "/rspress-dark-logo.png",
  },
  builderConfig: {
    ...(RsBuildConfig as any),
  },
  themeConfig: {
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/web-infra-dev/rspress",
      },
    ],
  },
});
