import dayjs from "dayjs";
import { connect, mapProps, mapReadPretty } from "@formily/react";
import {
  TimePicker as ArcoTimePicker,
  TimePickerProps as ArcoTimePickerProps,
  TimeRangePickerProps,
} from "@arco-design/web-react";
import { PreviewText } from "../preview-text";
import { formatMomentValue, momentable } from "../__builtins__";

type ComposedTimePicker = React.FC<
  React.PropsWithChildren<ArcoTimePickerProps>
> & {
  RangePicker?: React.FC<React.PropsWithChildren<TimeRangePickerProps>>;
};

const mapTimeFormat = function () {
  return (props: any) => {
    const format = props["format"] || "HH:mm:ss";
    const onChange = props.onChange;
    return {
      ...props,
      format,
      value: momentable(props.value, format),
      onChange: (value: dayjs.Dayjs | dayjs.Dayjs[]) => {
        if (onChange) {
          onChange(formatMomentValue(value, format));
        }
      },
    };
  };
};

export const TimePicker: ComposedTimePicker = connect(
  ArcoTimePicker,
  mapProps(mapTimeFormat()),
  mapReadPretty(PreviewText.TimePicker)
);

TimePicker.RangePicker = connect(
  ArcoTimePicker.RangePicker,
  mapProps(mapTimeFormat()),
  mapReadPretty(PreviewText.TimeRangePicker)
);

export default TimePicker;
