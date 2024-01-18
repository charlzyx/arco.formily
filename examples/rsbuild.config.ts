import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import path from "path";
import { ArcoDesignPlugin } from "@arco-plugins/unplugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    alias: {
      "@arco-design/web-react": path.resolve(
        __dirname,
        "node_modules/@arco-design/web-react"
      ),
    },
  },
  tools: {
    less: {
      lessOptions: {
        javascriptEnabled: true,
      },
    },
    rspack(config) {
      config.experiments = {
        ...config.experiments,
        rspackFuture: {
          ...config.experiments?.rspackFuture,
          disableTransformByDefault: false,
        },
      };
      if (!config.plugins) {
        config.plugins = [];
      }
      config.plugins.push(
        new ArcoDesignPlugin({
          theme: "@arco-themes/react-asuka",
          // iconBox: "@arco-iconbox/react-partial-bits",
          removeFontFace: true,
        }) as any
      );
    },
  },
});
