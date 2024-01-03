import { globSync } from "glob";
import path from "path";
import fs from "fs-extra";

const run = () => {
  const files = globSync("../src/*/style.less", {
    cwd: path.resolve(__dirname, "../src"),
  });

  fs.writeFile(
    path.resolve(__dirname, "../src/style.ts"),
    `// auto generated code
${files
  .map((path) => {
    return `import './${path}'\n`;
  })
  .join("")}`,
    "utf8"
  );
  fs.writeFile(
    path.resolve(__dirname, "../src/style.less"),
    `// auto generated code
${files
  .map((path) => {
    return `@import './${path}';\n`;
  })
  .join("")}`,
    "utf8"
  );
};

run();
