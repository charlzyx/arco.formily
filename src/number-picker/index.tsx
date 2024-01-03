import { InputNumber } from "@arco-design/web-react";
import { connect, mapReadPretty } from "@formily/react";
import { PreviewText } from "../preview-text";

export const NumberPicker = connect(
  InputNumber,
  mapReadPretty(PreviewText.NumberPicker)
);

export default NumberPicker;
