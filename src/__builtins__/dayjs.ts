import { GeneralField } from "@formily/core";
import { isArr, isObj, isBool, isFn, isEmpty } from "@formily/shared";
import { markRaw } from "@formily/reactive";
import { dayjs } from "@arco-design/web-react/es/_util/dayjs";
import type { Dayjs } from "dayjs";

export const dayjsable = (value: any, format?: string) => {
  return Array.isArray(value)
    ? value.map((val) => (dayjs.isDayjs(val) ? val : dayjs(val, format)))
    : value
    ? dayjs.isDayjs(value)
      ? value
      : dayjs(value, format)
    : value;
};

export const formatDayjsValue = (
  value: any,
  format: any,
  locale: string,
  placeholder?: string
): string | string[] => {
  dayjs.locale(locale);
  const formatDate = (date: any, format: any, i = 0) => {
    if (!date) return placeholder;
    if (dayjs.isDayjs(value)) {
      return value.format(format);
    }
    const TIME_REG = /^(?:[01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;
    let _format = format;
    if (isArr(format)) {
      _format = format[i];
    }
    if (isFn(_format)) {
      return _format(date);
    }
    if (isEmpty(_format)) {
      return date;
    }
    // moment '19:55:22' 下需要传入第二个参数
    // if (TIME_REG.test(date)) {
    //   return dayjs(date, _format).format(_format);
    // }
    return dayjs(date, _format).format(_format);
    // return dayjs(date).format(_format);
  };
  if (isArr(value)) {
    return value.map((val, index) => {
      return formatDate(val, format, index);
    });
  } else {
    return value ? formatDate(value, format) : value || placeholder;
  }
};

type PcikerMode = "time" | "date" | "week" | "month" | "quarter" | "year";
export const getDefaultFormat = (
  mode: PcikerMode = "date",
  showTime?: boolean | { format?: string }
) => {
  if (mode === "time") {
    return "HH:mm:ss";
  } else if (mode === "week") {
    return "gggg-wo";
  } else if (mode === "month") {
    return "YYYY-MM";
  } else if (mode === "quarter") {
    return "YYYY-[Q]Q";
  } else if (mode === "year") {
    return "YYYY";
  } else if (showTime) {
    return (
      "YYYY-MM-DD " +
      (isBool(showTime) ? "HH:mm:ss" : showTime.format ?? "HH:mm:ss")
    );
  }
  // default date
  return "YYYY-MM-DD";
};

// 我也不知道为什么
// - DatePicker: arco.design 在 DatePicker 的format 是 string | Fn, 而且源码里准者 DatePicker 做了 Fn 的解析
// - DatePicker.RangePicker:  上回退成  string | string[]
// - TimePicker: 而号称跟 DatePicker 用的同一个 InnerPicker 的 TimePicker 其实不是同一个, 所以 TimePicker format类型是  string,
// - TimePicker.RangePicker:  文档没写, 但其实跟 TimePicker 一样是 string
// What else can i say? ┓( ´∀` )┏
type DateFormatter = string | ((dayjsValue: Dayjs) => string);

const eqeq = (
  s: string | string[],
  d?: Dayjs | Dayjs[],
  format?: DateFormatter | DateFormatter[]
): boolean => {
  if (!d) return false;
  if (Array.isArray(d)) {
    const hasNotEq = d.find((dd, i) => {
      const myFormat = Array.isArray(format) ? format[i] : format;
      return !eqeq(s[i], dd, myFormat);
    });
    return !hasNotEq;
  }

  // DatePicker format 支持 函数
  return typeof format === "function"
    ? format(d) === s
    : d.format(format as string) === s;
};

const getValue = (props: any, field: GeneralField, format: string) => {
  return eqeq(props.value, field.data?._dayjsvalue, format)
    ? field.data?._dayjsvalue
    : props.value;
};

export const getDateTimePickerMapper = (mode: PcikerMode) => {
  return (props: any, field: GeneralField) => {
    // DatePicker.RangePicker 支持传入mode
    const rankMode = props.mode ?? mode;
    const value = getValue(
      props,
      field,
      props.format ?? getDefaultFormat(rankMode, props.showTime)
    );

    const _onChange = props.onChange;

    const final: typeof props = {
      ...props,
      value,
      onChange(
        dateStringOrList: string | string[],
        dayjsValueOrList: Dayjs | Dayjs[]
      ) {
        if (!field.data) {
          field.data = {
            _dayjsvalue: markRaw(dayjsValueOrList),
          };
        } else {
          field.data._dayjsvalue = markRaw(dayjsValueOrList);
        }
        if (_onChange) {
          _onChange?.(dateStringOrList, dayjsValueOrList);
        }
      },
    };
    return final;
  };
};
