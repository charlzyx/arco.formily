import React from "react";
import { connect, mapReadPretty, mapProps, ReactFC } from "@formily/react";
import { Select as ArcoSelect, SelectProps } from "@arco-design/web-react";
import { PreviewText } from "../preview-text";
import { IconLoading } from "@arco-design/web-react/icon";
import { Field } from "@formily/core";

export const Select: ReactFC<SelectProps> = connect(
  ArcoSelect,
  mapProps(
    {
      dataSource: "options",
      loading: true,
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
  mapReadPretty(PreviewText.Select)
);

export default Select;
