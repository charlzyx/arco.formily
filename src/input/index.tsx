import {
  Input as ArcoInput,
  InputProps,
  TextAreaProps,
} from "@arco-design/web-react";
import { IconLoading } from "@arco-design/web-react/icon";
import { Field } from "@formily/core";
import { connect, mapProps, mapReadPretty } from "@formily/react";
import React from "react";
import { PreviewText } from "../preview-text";
import "./style";

type ComposedInput = React.FC<React.PropsWithChildren<InputProps>> & {
  TextArea?: React.FC<React.PropsWithChildren<TextAreaProps>>;
};

export const Input: ComposedInput = connect(
  ArcoInput,
  mapProps((props, field) => {
    return {
      ...props,
      suffix: (
        <span>
          {(field as Field)?.loading || (field as Field)?.validating ? (
            <IconLoading />
          ) : (
            props.suffix
          )}
        </span>
      ),
    };
  }),
  mapReadPretty(PreviewText.Input),
);

Input.TextArea = connect(ArcoInput.TextArea, mapReadPretty(PreviewText.Input));

export default Input;
