import { ConfigProvider, SpaceProps } from "@arco-design/web-react";
import { isArr as isArray, isNum as isNumber } from "@formily/shared";
import cs from "classnames";
import { Fragment, ReactElement, forwardRef, useContext, useMemo } from "react";
import { toArray, usePrefixCls } from "../__builtins__";

const defaultProps: SpaceProps = {
  size: "small",
  direction: "horizontal",
};
export type SpaceSize = "mini" | "small" | "medium" | "large" | number;

export const InnerSpace = forwardRef<HTMLDivElement, SpaceProps>(
  (baseProps, ref) => {
    const { componentConfig, rtl } = useContext(ConfigProvider.ConfigContext);
    const props = useMemo<SpaceProps>(() => {
      return {
        ...baseProps,
        ...defaultProps,
        ...(componentConfig?.Space || {}),
      };
    }, [baseProps, defaultProps, componentConfig?.Space]);

    const {
      className,
      style,
      children,
      size,
      direction,
      align,
      wrap,
      split,
      ...rest
    } = props;

    const prefixCls = usePrefixCls("space");

    const innerAlign = align || (direction === "horizontal" ? "center" : "");

    const classNames = cs(
      prefixCls,
      {
        [`${prefixCls}-${direction}`]: direction,
        [`${prefixCls}-align-${innerAlign}`]: innerAlign,
        [`${prefixCls}-wrap`]: wrap,
        [`${prefixCls}-rtl`]: rtl,
      },
      className,
    );

    function getMargin(size: SpaceSize) {
      if (isNumber(size)) {
        return size;
      }
      switch (size) {
        case "mini":
          return 4;
        case "small":
          return 8;
        case "medium":
          return 16;
        case "large":
          return 24;
        default:
          return 8;
      }
    }

    const childrenList = toArray(children);

    function getMarginStyle(index: number) {
      // const isLastOne =
      //   rtl && direction === 'horizontal' ? index === 0 : childrenList.length === index + 1;
      const isLastOne = childrenList.length === index + 1;
      const marginDirection = rtl ? "marginLeft" : "marginRight";

      if (typeof size === "string" || typeof size === "number") {
        const margin = getMargin(size as SpaceSize);
        if (wrap) {
          return isLastOne
            ? { marginBottom: margin }
            : {
                [`${marginDirection}`]: margin,
                marginBottom: margin,
              };
        }
        return !isLastOne
          ? {
              [direction === "vertical" ? "marginBottom" : marginDirection]:
                margin,
            }
          : {};
      }
      if (isArray(size)) {
        const marginHorizontal = getMargin(size[0]);
        const marginBottom = getMargin(size[1]);
        if (wrap) {
          return isLastOne
            ? { marginBottom }
            : {
                [`${marginDirection}`]: marginHorizontal,
                marginBottom,
              };
        }
        if (direction === "vertical") {
          return { marginBottom };
        }
        return { [`${marginDirection}`]: marginHorizontal };
      }
    }

    return (
      <div ref={ref} className={classNames} style={style} {...rest}>
        {childrenList.map((child, index) => {
          // Keep the key passed on the child to avoid additional DOM remounting
          // Related issue: https://github.com/arco-design/arco-design/issues/1320
          const key = (child as ReactElement)?.key || index;
          const shouldRenderSplit =
            split !== undefined && split !== null && index > 0;
          return (
            <Fragment key={key}>
              {shouldRenderSplit && (
                <div className={`${prefixCls}-item-split`}>{split}</div>
              )}
              <div
                className={`${prefixCls}-item`}
                style={getMarginStyle(index)}
              >
                {child}
              </div>
            </Fragment>
          );
        })}
      </div>
    );
  },
);

InnerSpace.displayName = "Space";
