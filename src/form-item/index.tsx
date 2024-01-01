import { isVoidField } from "@formily/core";
import { connect, mapProps } from "@formily/react";
import React from "react";
import { BaseItem, IFormItemProps } from "./base-item";
export { BaseItem } from "./base-item";
export type { IFormItemProps } from "./base-item";

type ComposeFormItem = React.FC<React.PropsWithChildren<IFormItemProps>> & {
  BaseItem?: React.FC<React.PropsWithChildren<IFormItemProps>>;
};

// 适配
export const FormItem: ComposeFormItem = connect(
  BaseItem,
  mapProps((props, field) => {
    if (isVoidField(field))
      return {
        label: field.title || props.label,
        // asterisk: props.asterisk,
        extra: props.extra || field.description,
      };
    if (!field) return props;
    const takeFeedbackStatus = () => {
      if (field.validating) return "validating";
      return field.decoratorProps.feedbackStatus || field.validateStatus;
    };
    const takeMessage = () => {
      const split = (messages: any[]) => {
        return messages.reduce((buf, text, index) => {
          if (!text) return buf;
          return index < messages.length - 1
            ? buf.concat([text, ", "])
            : buf.concat([text]);
        }, []);
      };
      if (field.validating) return;
      if (props.help) return props.help;
      if (field.selfErrors.length) return split(field.selfErrors);
      if (field.selfWarnings.length) return split(field.selfWarnings);
      if (field.selfSuccesses.length) return split(field.selfSuccesses);
    };
    const takeAsterisk = () => {
      if (field.required && field.pattern !== "readPretty") {
        return true;
      }
      // if ("asterisk" in props) {
      //   return props.asterisk;
      // }
      return false;
    };
    return {
      label: props.label || field.title,
      feedbackStatus: takeFeedbackStatus(),
      feedbackText: takeMessage(),
      required: takeAsterisk(),
      optionalMarkHidden:
        field.pattern === "readPretty" && !("asterisk" in props),
      extra: props.extra || field.description,
    };
  })
);

FormItem.BaseItem = BaseItem;

export default FormItem;
