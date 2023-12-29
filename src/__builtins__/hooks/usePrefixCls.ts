import { useContext } from "react";
import { ConfigProvider } from "@arco-design/web-react";

export const usePrefixCls = (
  tag?: string,
  props?: {
    prefix?: string;
  }
) => {
  if ("ConfigContext" in ConfigProvider) {
    const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
    if (getPrefixCls) {
      return getPrefixCls(tag!, props?.prefix);
    } else {
      const prefix = props?.prefix ?? "arco-";
      return `${prefix}${tag ?? ""}`;
    }
  } else {
    const prefix = props?.prefix ?? "arco-";
    return `${prefix}${tag ?? ""}`;
  }
};
