import { isArr, isValid } from "@formily/shared";
import { useEffect, useRef, useState } from "react";

/**
 * 这些属性会根据 response 来响应式的配置
 */
export type IComputedProps = {
  layout?: "vertical" | "horizontal" | "inline";
  labelCol?: number;
  labelAlign?: "right" | "left";
  wrapperCol?: number;
  wrapperAlign?: "right" | "left";
};

/**
 * 传入的配置是数组形式
 */
export type IResponsiveFormLayoutProps<T> = T & {
  [K in keyof IComputedProps]: IComputedProps[K] | IComputedProps[K][];
} & {
  breakpoints?: number[];
};

interface ICalcBreakpointIndex {
  (originalBreakpoints: number[], width: number): number;
}

/** @ts-ignore */
const calcBreakpointIndex: ICalcBreakpointIndex = (breakpoints, width) => {
  for (let i = 0; i < breakpoints.length; i++) {
    if (width <= breakpoints[i]) {
      return i;
    }
  }
};

const calcFactor = <T>(value: T | T[], breakpointIndex: number): T => {
  if (Array.isArray(value)) {
    if (breakpointIndex === -1) return value[0];
    return value[breakpointIndex] ?? value[value.length - 1];
  } else {
    return value;
  }
};

const factor = <T>(value: T | T[], breakpointIndex: number): T =>
  isValid(value) ? calcFactor(value as any, breakpointIndex) : value;

const calculateProps = <T>(
  target: HTMLElement | null,
  props: IResponsiveFormLayoutProps<T>,
) => {
  if (!target) return props as IComputedProps & T;
  const { clientWidth } = target;
  const {
    breakpoints,
    layout,
    labelAlign,
    wrapperAlign,
    labelCol,
    wrapperCol,
    ...otherProps
  } = props;
  const breakpointIndex = calcBreakpointIndex(breakpoints!, clientWidth);

  return {
    layout: factor(layout, breakpointIndex),
    labelAlign: factor(labelAlign, breakpointIndex),
    wrapperAlign: factor(wrapperAlign, breakpointIndex),
    labelCol: factor(labelCol, breakpointIndex),
    wrapperCol: factor(wrapperCol, breakpointIndex),
    ...otherProps,
  } as IComputedProps & T;
};

export const useResponsiveFormLayout = <T>(
  props: IResponsiveFormLayoutProps<T>,
) => {
  const ref = useRef<HTMLDivElement>(null);
  const { breakpoints } = props;
  if (!isArr(breakpoints)) {
    return { ref, props };
  }
  const [layoutProps, setLayout] = useState(props);

  const updateUI = () => {
    if (ref.current) {
      setLayout(calculateProps(ref.current, props));
    }
  };

  useEffect(() => {
    const observer = () => {
      updateUI();
    };
    const resizeObserver = new ResizeObserver(observer);
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }
    updateUI();
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return {
    ref,
    props: layoutProps as IComputedProps & T,
  };
};
