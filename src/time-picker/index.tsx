import {
  TimePicker as ArcoTimePicker,
  TimePickerProps as ArcoTimePickerProps,
  TimeRangePickerProps,
} from "@arco-design/web-react";
import { connect, mapProps, mapReadPretty } from "@formily/react";
import { getDateTimePickerMapper } from "../__builtins__";
import { PreviewText } from "../preview-text";
import "./style";

type ComposedTimePicker = React.FC<
  React.PropsWithChildren<ArcoTimePickerProps>
> & {
  RangePicker?: React.FC<React.PropsWithChildren<TimeRangePickerProps>>;
};

export const TimePicker: ComposedTimePicker = connect(
  ArcoTimePicker,
  mapProps(getDateTimePickerMapper("time")),
  mapReadPretty(PreviewText.TimePicker)
);

TimePicker.RangePicker = connect(
  ArcoTimePicker.RangePicker,
  mapProps(getDateTimePickerMapper("time")),
  mapReadPretty(PreviewText.TimeRangePicker)
);

export default TimePicker;
