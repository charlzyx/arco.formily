import dayjs from "dayjs";
import { connect, mapProps, mapReadPretty } from "@formily/react";
import {
  DatePicker as ArcoDatePicker,
  DatePickerProps as ArcoDatePickerProps,
  WeekPickerProps,
  MonthPickerProps,
  QuarterPickerProps,
  YearPickerProps,
  RangePickerProps,
} from "@arco-design/web-react";
import { PreviewText } from "../preview-text";
import { formatMomentValue, momentable } from "../__builtins__";

type DatePickerProps<PickerProps> = Exclude<
  PickerProps,
  "value" | "onChange"
> & {
  mode: RangePickerProps["mode"];
  value: string;
  onChange: (value: string | string[]) => void;
};

type ComposedDatePicker = React.FC<
  React.PropsWithChildren<ArcoDatePickerProps>
> & {
  RangePicker?: React.FC<React.PropsWithChildren<RangePickerProps>>;
  WeekPicker?: React.FC<React.PropsWithChildren<WeekPickerProps>>;
  MonthPicker?: React.FC<React.PropsWithChildren<MonthPickerProps>>;
  QuarterPicker?: React.FC<React.PropsWithChildren<QuarterPickerProps>>;
  YearPicker?: React.FC<React.PropsWithChildren<YearPickerProps>>;
};

const mapDateFormat = function (
  pickermode?: "week" | "month" | "year" | "quarter"
) {
  const getDefaultFormat = (
    props: DatePickerProps<ArcoDatePickerProps | RangePickerProps>
  ) => {
    const mode = pickermode || props.mode;
    if (mode === "month") {
      return "YYYY-MM";
    } else if (mode === "quarter") {
      return "YYYY-[Q]Q";
    } else if (mode === "year") {
      return "YYYY";
    } else if (mode === "week") {
      return "gggg-wo";
    }
    return props["showTime"] ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD";
  };

  return (props: any) => {
    const mode = pickermode || props.mode;
    // FIXME
    if (mode == "quarter") {
      return {
        props,
      };
    }

    const format = props["format"] || getDefaultFormat(props);
    const onChange = props.onChange;
    return {
      ...props,
      format,
      value: momentable(props.value, format === "gggg-wo" ? "gggg-ww" : format),
      onChange: (value: dayjs.Dayjs | dayjs.Dayjs[]) => {
        if (onChange) {
          onChange(formatMomentValue(value, format));
        }
      },
    };
  };
};

export const DatePicker: ComposedDatePicker = connect(
  ArcoDatePicker,
  mapProps(mapDateFormat()),
  mapReadPretty(PreviewText.DatePicker)
);

DatePicker.RangePicker = connect(
  ArcoDatePicker.RangePicker,
  mapProps(mapDateFormat()),
  mapReadPretty(PreviewText.DateRangePicker)
);

DatePicker.WeekPicker = connect(
  ArcoDatePicker.WeekPicker,
  mapProps(mapDateFormat("week")),
  mapReadPretty(PreviewText.DatePicker)
);

DatePicker.MonthPicker = connect(
  ArcoDatePicker.MonthPicker,
  mapProps(mapDateFormat("month")),
  mapReadPretty(PreviewText.DatePicker)
);

DatePicker.QuarterPicker = connect(
  ArcoDatePicker.QuarterPicker,
  mapProps(mapDateFormat("quarter")),
  mapReadPretty(PreviewText.DatePicker)
);
DatePicker.YearPicker = connect(
  ArcoDatePicker.YearPicker,
  mapProps(mapDateFormat("year")),
  mapReadPretty(PreviewText.DatePicker)
);

export default DatePicker;
