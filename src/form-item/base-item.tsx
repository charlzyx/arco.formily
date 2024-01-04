import {
  FormItemProps as ArcoFormItemProps,
  Tooltip,
  TooltipProps,
} from "@arco-design/web-react";
import {
  IconCheckCircleFill,
  IconCloseCircleFill,
  IconExclamationCircleFill,
  IconLoading,
  IconQuestionCircle,
} from "@arco-design/web-react/icon";
import { Field } from "@formily/core";
import { useField } from "@formily/react";
import { isObj } from "@formily/shared";
import cls from "classnames";
import React, { useCallback } from "react";
import { CSSTransition } from "react-transition-group";
import { pickDataProps, usePrefixCls } from "../__builtins__";
import {
  FormLayoutShallowContext,
  IFormilyLayoutProps,
  useFormLayout,
} from "../form-layout";
import { useOverflow } from "./useOverflow";
import "./style";

export interface IFormItemProps
  extends Omit<
      ArcoFormItemProps,
      | "value"
      | "onChange"
      | "prefixCls"
      | "className"
      | "colon"
      | "size"
      | "requiredSymbol"
      | "labelCol"
      | "wrapperCol"
      | "layout"
    >,
    IFormilyLayoutProps {
  // formily field 模型
  feedbackStatus?: Field["validateStatus"];
  feedbackText?: string | string[];
  tooltipLayout?: "icon" | "text";
  labelFor?: string;
  addonBefore?: string | React.ReactNode;
  addonAfter?: string | React.ReactNode;
}

const usePropsWithFormLayout = (props: IFormItemProps) => {
  const layout = useFormLayout();
  const layoutType = props.layout ?? layout.layout ?? "horizontal";
  let requiredSymbol = props.requiredSymbol ?? layout.requiredSymbol;

  if (props.requiredSymbol === true && isObj(layout.requiredSymbol)) {
    requiredSymbol = layout.requiredSymbol;
  }

  const final: IFormItemProps = {
    ...props,
    layout: layoutType,
    colon: props.colon ?? layout.colon,
    labelAlign:
      layoutType === "vertical"
        ? props.labelAlign ?? "left"
        : props.labelAlign ?? layout.labelAlign ?? "right",
    labelWrap: props.labelWrap ?? layout.labelWrap,
    labelWidth: props.labelWidth ?? layout.labelWidth,
    wrapperWidth: props.wrapperWidth ?? layout.wrapperWidth,
    labelCol: props.labelCol ?? layout.labelCol,
    wrapperCol: props.wrapperCol ?? layout.wrapperCol,
    wrapperAlign: props.wrapperAlign ?? layout.wrapperAlign,
    wrapperWrap: props.wrapperWrap ?? layout.wrapperWrap,
    size: props.size ?? layout.size,
    tooltipLayout: props.tooltipLayout ?? layout.tooltipLayout ?? "icon",
    requiredSymbol,
  };
  return final;
};
export const ID_SUFFIX = "_input";

// 错误提示文字
const FormItemTip: React.FC<
  Pick<IFormItemProps, "feedbackStatus" | "feedbackText"> & {
    prefixCls: string;
  }
> = ({ prefixCls, feedbackText }) => {
  const visible = Boolean(feedbackText);

  const renderTxt = useCallback((text: string, k: number) => {
    return (
      <div
        key={k}
        className={cls(`${prefixCls}-message ${prefixCls}-message-help`)}
      >
        {text}
      </div>
    );
  }, []);

  return (
    visible && (
      <CSSTransition
        in={visible}
        appear
        classNames="formblink"
        timeout={300}
        unmountOnExit
      >
        <React.Fragment>
          {Array.isArray(feedbackText)
            ? feedbackText.map(renderTxt)
            : renderTxt(feedbackText!, 1)}
        </React.Fragment>
      </CSSTransition>
    )
  );
};

export const BaseItem: React.FC<React.PropsWithChildren<IFormItemProps>> = ({
  children,
  ...props
}) => {
  const layoutProps = usePropsWithFormLayout(props);

  const {
    label,
    style,
    layout,
    colon = true,
    addonBefore,
    addonAfter,
    requiredSymbol,
    feedbackStatus,
    feedbackText,
    extra,
    labelFor,
    labelWidth,
    wrapperWidth,
    labelCol,
    wrapperCol,
    labelAlign,
    hidden,
    wrapperAlign = "left",
    labelWrap,
    wrapperWrap,
    size,
    tooltipLayout,
    tooltip,
  } = layoutProps;

  const labelStyle = { ...layoutProps.labelStyle };
  const wrapperStyle = { ...layoutProps.wrapperStyle };
  const { containerRef, contentRef, overflow } = useOverflow();
  const field = useField();
  // 固定宽度
  let enableCol = false;
  if (labelWidth || wrapperWidth) {
    if (labelWidth) {
      labelStyle.width = labelWidth === "auto" ? undefined : labelWidth;
      labelStyle.maxWidth = labelWidth === "auto" ? undefined : labelWidth;
    }
    if (wrapperWidth) {
      wrapperStyle.width = wrapperWidth === "auto" ? undefined : wrapperWidth;
      wrapperStyle.maxWidth =
        wrapperWidth === "auto" ? undefined : wrapperWidth;
    }
    // 栅格模式
  }
  if (labelCol || wrapperCol) {
    if (!labelStyle.width && !wrapperStyle.width && layout !== "vertical") {
      enableCol = true;
    }
  }

  const prefixCls = usePrefixCls("form");
  const formilyItemPrefixCls = usePrefixCls("formily-item");

  const gridStyles: React.CSSProperties = {};

  const tooltipIconClassName = usePrefixCls("form-item-tooltip");

  const getOverflowTooltip = () => {
    const renderTooltip = () => {
      if (!tooltip) {
        return null;
      }
      let tooltipProps: TooltipProps = {};
      let tooltipIcon = <IconQuestionCircle className={tooltipIconClassName} />;
      if (!isObj(tooltip) || React.isValidElement(tooltip)) {
        tooltipProps = {
          content: tooltip,
        };
      } else {
        const { icon, ...rest } = tooltip as TooltipProps & {
          icon?: React.ReactElement;
        };
        tooltipProps = rest;
        if (icon) {
          tooltipIcon = React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement, {
                className: cls(
                  tooltipIconClassName,
                  (icon as React.ReactElement).props.className
                ),
              })
            : icon;
        }
      }
      return <Tooltip {...tooltipProps}>{tooltipIcon}</Tooltip>;
    };
    if (overflow) {
      return (
        <div>
          <div>{label}</div>
          <div>{renderTooltip()}</div>
        </div>
      );
    }
    return renderTooltip();
  };

  const renderLabelText = () => {
    const labelChildren = (
      <div
        className={`${formilyItemPrefixCls}-label-content`}
        ref={containerRef as any}
      >
        <span ref={contentRef}>
          {requiredSymbol && (requiredSymbol as any)?.position !== "end" && (
            <span className={`${formilyItemPrefixCls}-asterisk-at-start`}>
              {"*"}
            </span>
          )}
          <label
            htmlFor={labelFor}
            style={{
              whiteSpace: label === " " ? "break-spaces" : undefined,
            }}
          >
            {label}
          </label>
          {isObj(requiredSymbol) && requiredSymbol?.position === "end" && (
            <span className={`${formilyItemPrefixCls}-asterisk-at-end`}>
              {"*"}
            </span>
          )}
        </span>
      </div>
    );

    if ((tooltipLayout === "text" && tooltip) || overflow) {
      return (
        <Tooltip position="top" content={getOverflowTooltip()}>
          {labelChildren}
        </Tooltip>
      );
    }
    return labelChildren;
  };
  const renderLabel = () => {
    if (!label) return null;
    return (
      <div
        className={cls({
          [`${prefixCls}-label-item`]: true,
          [`${formilyItemPrefixCls}-label`]: true,
          [`${formilyItemPrefixCls}-label-tooltip`]:
            (tooltip && tooltipLayout === "text") || overflow,
          [`${formilyItemPrefixCls}-col-${labelCol}`]: enableCol && !!labelCol,
        })}
        style={labelStyle}
      >
        {renderLabelText()}
        {label !== " " && (
          <span className={`${formilyItemPrefixCls}-colon`}>
            {colon ? ":" : ""}
          </span>
        )}
      </div>
    );
  };

  const itemCls = cls(
    formilyItemPrefixCls,
    `${prefixCls}-item`,
    {
      [`${prefixCls}-size-${size}`]: size,
      [`${prefixCls}-item-error`]: feedbackText && feedbackStatus == "error",
      [`${prefixCls}-item-status-${
        feedbackStatus === "validating" ? "loading" : feedbackStatus
      }`]: feedbackStatus,
      [`${prefixCls}-item-has-help`]: feedbackText,
      [`${prefixCls}-item-hidden`]: hidden,
      [`${prefixCls}-item-has-feedback`]: feedbackStatus && props.hasFeedback,
      [`${formilyItemPrefixCls}-label-align-${labelAlign}`]: true,
      [`${formilyItemPrefixCls}-control-align-${wrapperAlign}`]: true,
      [`${formilyItemPrefixCls}-label-wrap`]: !!labelWrap,
      [`${formilyItemPrefixCls}-control-wrap`]: !!wrapperWrap,
    },
    `${prefixCls}-layout-${layout}`,
    props.className
  );

  const layoutWrapperCls = cls(`${formilyItemPrefixCls}-layout-wrapper`, {
    [`${formilyItemPrefixCls}-col-${wrapperCol}`]:
      enableCol && !!wrapperCol && label,
  });

  // item -> { label, layout-wrapper -> {wrapper,feedbackText, extra}}

  return (
    <div
      {...pickDataProps(props)}
      style={{
        ...style,
        ...gridStyles,
      }}
      data-grid-span={props.gridSpan}
      className={itemCls}
    >
      {!label && layout !== "vertical" ? null : renderLabel()}
      <div className={layoutWrapperCls}>
        <div style={wrapperStyle} className={`${prefixCls}-item-wrapper`}>
          <div className={cls(`${prefixCls}-item-control-wrapper`)}>
            <div className={cls(`${prefixCls}-item-control`)}>
              {addonBefore && (
                <div className={cls(`${formilyItemPrefixCls}-addon-before`)}>
                  {addonBefore}
                </div>
              )}
              <div className={cls(`${prefixCls}-item-control-children`)}>
                <FormLayoutShallowContext.Provider value={undefined!}>
                  <div
                    className={`${formilyItemPrefixCls}-component ${
                      field?.componentProps?.className || ""
                    }`}
                    style={field?.componentProps?.style}
                  >
                    {children}
                    {feedbackStatus ? (
                      <div
                        className={`${prefixCls}-item-feedback ${prefixCls}-item-feedback-${feedbackStatus}`}
                      >
                        {feedbackStatus === "warning" && (
                          <IconExclamationCircleFill />
                        )}
                        {feedbackStatus === "success" && (
                          <IconCheckCircleFill />
                        )}
                        {feedbackStatus === "error" && <IconCloseCircleFill />}
                        {feedbackStatus === "validating" && <IconLoading />}
                      </div>
                    ) : null}
                  </div>
                </FormLayoutShallowContext.Provider>
              </div>
              {addonAfter && (
                <div className={cls(`${formilyItemPrefixCls}-addon-after`)}>
                  {addonAfter}
                </div>
              )}
            </div>
          </div>
          {!!feedbackText && (
            <FormItemTip
              prefixCls={prefixCls}
              feedbackStatus={feedbackStatus}
              feedbackText={feedbackText}
            ></FormItemTip>
          )}
          {extra && <div className={cls(`${prefixCls}-extra`)}>{extra}</div>}
        </div>
      </div>
    </div>
  );
};
