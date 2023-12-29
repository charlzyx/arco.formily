import React from "react";
import { connect, mapReadPretty, mapProps } from "@formily/react";
import { TreeSelect as ArcoTreeSelect } from "@arco-design/web-react";
import { PreviewText } from "../preview-text";
import { IconLoading } from "@arco-design/web-react/icon";
import { Field } from "@formily/core";
export const TreeSelect = connect(
  ArcoTreeSelect,
  mapProps(
    {
      dataSource: "treeData",
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
  mapReadPretty(PreviewText.TreeSelect)
);

export default TreeSelect;
