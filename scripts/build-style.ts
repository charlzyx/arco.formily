import { readFileSync, writeFileSync } from "fs";
import {
  copy,
  readFile,
  writeFile,
  existsSync,
  copyFileSync,
  mkdirSync,
  move,
  moveSync,
} from "fs-extra";
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

const joinLine = (file: string, ...appends: string[]) => {
  if (!existsSync(file)) return;
  const content = readFileSync(file);
  const lines = content.toString().split("\n");
  lines.splice(1, 0, ...appends);
  writeFileSync(file, lines.join("\n"), "utf-8");
};
const removeLine = (file: string, shouldRemove: (line: string) => boolean) => {
  if (!existsSync(file)) return;
  const content = readFileSync(file);
  const lines = content.toString().split("\n");
  const neo = lines.filter(shouldRemove);
  writeFileSync(file, neo.join("\n"), "utf-8");
};

const srcTo = (s: string, to: "esm" | "lib" | "dist") => {
  return s.replace(/src\//, `${to}/`);
};

export const runCopy = (pwd: string, opts: CopyBaseOptions) => {
  if (!existsSync(srcTo(pwd, "dist"))) {
    mkdirSync(srcTo(pwd, "dist"));
  }
  moveSync(
    srcTo(pwd + "/arco.formily.css", "esm"),
    srcTo(pwd + "/arco.formily.css", "dist")
  );
  moveSync(
    srcTo(pwd + "/arco.formily.css", "lib"),
    srcTo(pwd + "/arco.formily.css", "dist"),
    { overwrite: true }
  );
  joinLine(srcTo(pwd + "/index.js", "lib"), `require("./style.js")`);
  joinLine(srcTo(pwd + "/index.js", "esm"), `import "./style.js"`);

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
          const isLib = /lib\//.test(stylejs);
          joinLine(
            stylejs,
            isLib ? 'require("./style.less");' : 'import "./style.less";'
          );
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

      if (/\/index.ts$/.test(filename)) {
        const indexesm = filename.replace(/src\//, "esm/");
        const indexcommon = filename.replace(/src\//, "lib/");
        removeLine(indexesm, (line) =>
          /@arco\-design\/web\-react\/(.*)style\/index$/.test(line)
        );
        removeLine(indexcommon, (line) =>
          /@arco\-design\/web\-react\/(.*)style\/index$/.test(line)
        );

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
