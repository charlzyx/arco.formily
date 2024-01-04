import {
  DatePicker as ArcoDatePicker,
  DatePickerProps as ArcoDatePickerProps,
  MonthPickerProps,
  QuarterPickerProps,
  RangePickerProps,
  WeekPickerProps,
  YearPickerProps,
} from "@arco-design/web-react";
import { connect, mapProps, mapReadPretty } from "@formily/react";
import { getDateTimePickerMapper, getDefaultFormat } from "../__builtins__";
import { PreviewText } from "../preview-text";
import "./style";
type ComposedDatePicker = React.FC<
  React.PropsWithChildren<ArcoDatePickerProps>
> & {
  RangePicker?: React.FC<React.PropsWithChildren<RangePickerProps>>;
  WeekPicker?: React.FC<React.PropsWithChildren<WeekPickerProps>>;
  MonthPicker?: React.FC<React.PropsWithChildren<MonthPickerProps>>;
  QuarterPicker?: React.FC<React.PropsWithChildren<QuarterPickerProps>>;
  YearPicker?: React.FC<React.PropsWithChildren<YearPickerProps>>;
};

export const DatePicker: ComposedDatePicker = connect(
  ArcoDatePicker,
  mapProps(getDateTimePickerMapper("date")),
  mapReadPretty((props) => {
    const format = props.format ?? getDefaultFormat("date", props.showTime);
    return (
      <PreviewText.DatePicker
        {...props}
        format={format}
      ></PreviewText.DatePicker>
    );
  })
);

DatePicker.RangePicker = connect(
  ArcoDatePicker.RangePicker,
  mapProps(getDateTimePickerMapper("date")),
  mapReadPretty((props) => {
    const format =
      props.format ?? getDefaultFormat(props.mode || "date", props.showTime);
    return (
      <PreviewText.DateRangePicker
        {...props}
        format={format}
      ></PreviewText.DateRangePicker>
    );
  })
);

DatePicker.WeekPicker = connect(
  ArcoDatePicker.WeekPicker,
  mapProps(getDateTimePickerMapper("week")),
  mapReadPretty((props) => {
    const format = props.format ?? getDefaultFormat("week", props.showTime);
    return (
      <PreviewText.DatePicker
        {...props}
        format={format}
      ></PreviewText.DatePicker>
    );
  })
);

DatePicker.MonthPicker = connect(
  ArcoDatePicker.MonthPicker,
  mapProps(getDateTimePickerMapper("month")),
  mapReadPretty((props) => {
    const format = props.format ?? getDefaultFormat("month", props.showTime);
    return (
      <PreviewText.DatePicker
        {...props}
        format={format}
      ></PreviewText.DatePicker>
    );
  })
);

DatePicker.QuarterPicker = connect(
  ArcoDatePicker.QuarterPicker,
  mapProps(getDateTimePickerMapper("quarter")),
  mapReadPretty((props) => {
    const format = props.format ?? getDefaultFormat("quarter", props.showTime);
    return (
      <PreviewText.DatePicker
        {...props}
        format={format}
      ></PreviewText.DatePicker>
    );
  })
);

DatePicker.YearPicker = connect(
  ArcoDatePicker.YearPicker,
  mapProps(getDateTimePickerMapper("year")),
  mapReadPretty((props) => {
    const format = props.format ?? getDefaultFormat("year", props.showTime);
    return (
      <PreviewText.DatePicker
        {...props}
        format={format}
      ></PreviewText.DatePicker>
    );
  })
);

export default DatePicker;
