import path from "path";

const inputFilePath = path.join(process.cwd(), "./src/index.ts");

export const removeImportStyleFromInputFilePlugin = () => ({
  name: "remove-import-style-from-input-file",
  transform(code, id) {
    // 样式由 build:style 进行打包，所以要删除入口文件上的 `import './style'`
    if (inputFilePath === id) {
      return code.replace(`import './style';`, "");
    }

    return code;
  },
});
