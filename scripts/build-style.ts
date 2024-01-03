import { readFileSync, writeFileSync } from "fs";
import { copy, readFile, writeFile, existsSync } from "fs-extra";
import { globSync } from "glob";
import path from "path";

export type CopyBaseOptions = Record<"esStr" | "libStr", string>;

const importLibToEs = async ({
  libStr,
  esStr,
  filename,
}: CopyBaseOptions & { filename: string }) => {
  if (!existsSync(filename)) {
    return Promise.resolve();
  }

  const fileContent: string = (await readFile(filename)).toString();

  return writeFile(
    filename,
    fileContent.replace(new RegExp(libStr, "g"), esStr)
  );
};

export const runCopy = (pwd: string, opts: CopyBaseOptions) => {
  return new Promise((resolve, reject) => {
    const globStr = `${pwd}/**/*`;
    const files = globSync(globStr);
    const all = [] as Promise<unknown>[];
    for (let i = 0; i < files.length; i += 1) {
      const filename = files[i];

      if (/\.(less|scss)$/.test(filename)) {
        all.push(copy(filename, filename.replace(/src\//, "esm/")));
        all.push(copy(filename, filename.replace(/src\//, "lib/")));
        const styleesm = filename
          .replace(/src\//, "esm/")
          .replace(".less", ".js");
        const stylecommonjs = filename
          .replace(/src\//, "lib/")
          .replace(".less", ".js");

        [stylecommonjs, styleesm].forEach((stylejs) => {
          if (existsSync(stylejs)) {
            const content = readFileSync(stylejs);
            const lines = content.toString().split("\n");
            const isLib = /lib\//.test(stylejs);
            lines.splice(
              1,
              0,
              isLib ? 'require("./style.less");' : 'import "./style.less";'
            );
            writeFileSync(stylejs, lines.join("\n"), "utf-8");
          }
        });

        continue;
      }

      if (/\/style.ts$/.test(filename)) {
        importLibToEs({
          ...opts,
          filename: filename.replace(/src\//, "esm/").replace(/\.ts$/, ".js"),
        });

        continue;
      }
    }
  });
};

const pwd = path.join(__dirname, "../src");

const build = () => {
  runCopy(pwd, {
    esStr: "@arco-design/web-react/es",
    libStr: "@arco-design/web-react/lib",
  });
};

build();
