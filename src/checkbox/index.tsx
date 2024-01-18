import {
  Checkbox as ArcoCheckbox,
  CheckboxGroupProps,
  CheckboxProps,
} from "@arco-design/web-react";
import { connect, mapProps, mapReadPretty } from "@formily/react";
import { PreviewText } from "../preview-text";
import "./style";
type ComposedCheckbox = React.FC<React.PropsWithChildren<CheckboxProps>> & {
  Group?: React.FC<
    React.PropsWithChildren<CheckboxGroupProps<string | number>>
  >;
  __BYTE_CHECKBOX?: boolean;
};

export const Checkbox = connect(
  ArcoCheckbox,
  mapProps({
    value: "checked",
  }),
) as ComposedCheckbox;

Checkbox.__BYTE_CHECKBOX = true;

Checkbox.Group = connect(
  ArcoCheckbox.Group,
  mapProps({
    dataSource: "options",
  }),
  mapReadPretty(PreviewText.Select, {
    mode: "tags",
  }),
);

export default Checkbox;
