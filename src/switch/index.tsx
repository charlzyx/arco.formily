import { Switch as ArcoSwitch } from "@arco-design/web-react";
import { connect, mapProps } from "@formily/react";
import "./style";

export const Switch = connect(
  ArcoSwitch,
  mapProps(
    {
      value: "checked",
    },
    (props) => {
      const onChange = props.onChange;
      // biome-ignore lint/performance/noDelete: <explanation>
      delete (props as any).value;
      return {
        ...props,
        onChange(checked: boolean) {
          onChange?.(checked, null);
        },
      };
    },
  ),
);

export default Switch;
