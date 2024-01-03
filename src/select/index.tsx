import { Select as ArcoSelect, SelectProps } from "@arco-design/web-react";
import { IconLoading } from "@arco-design/web-react/icon";
import { Field } from "@formily/core";
import { ReactFC, connect, mapProps, mapReadPretty } from "@formily/react";
import { PreviewText } from "../preview-text";

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
