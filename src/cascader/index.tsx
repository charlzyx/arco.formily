import { Cascader as ArcoCascader } from "@arco-design/web-react";
import { IconLoading } from "@arco-design/web-react/icon";
import { Field } from "@formily/core";
import { connect, mapProps, mapReadPretty } from "@formily/react";
import { PreviewText } from "../preview-text";
import "./style";
export const Cascader = connect(
  ArcoCascader,
  mapProps(
    {
      dataSource: "options",
    },
    (props, field) => {
      return {
        ...props,
        suffixIcon:
          (field as Field)?.["loading"] || (field as Field)?.["validating"] ? (
            <IconLoading />
          ) : (
            props.suffixIcon
          ),
      };
    }
  ),
  mapReadPretty(PreviewText.Cascader)
);

export default Cascader;
