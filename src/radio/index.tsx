import {
  Radio as ArcoRadio,
  RadioGroupProps,
  RadioProps,
} from "@arco-design/web-react";
import { connect, mapProps, mapReadPretty } from "@formily/react";
import { PreviewText } from "../preview-text";
import "./style";

type ComposedRadio = React.FC<React.PropsWithChildren<RadioProps<any>>> & {
  Group?: React.FC<React.PropsWithChildren<RadioGroupProps>>;
  __BYTE_RADIO?: boolean;
};

export const Radio = connect(
  ArcoRadio,
  mapProps({
    value: "checked",
  })
) as ComposedRadio;

Radio.__BYTE_RADIO = true;

Radio.Group = connect(
  ArcoRadio.Group,
  mapProps({
    dataSource: "options",
  }),
  mapReadPretty(PreviewText.Select)
);

export default Radio;
