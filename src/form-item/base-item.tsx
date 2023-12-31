import {
  ConfigProvider,
  FormItemProps as ArcoFormItemProps,
  Grid,
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
import { isObj, isUndef } from "@formily/shared";
import cls from "classnames";
import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CSSTransition } from "react-transition-group";
import { pickDataProps, usePrefixCls } from "../__builtins__";
import {
  FormLayoutShallowContext,
  IFormilyLayoutProps,
  useFormLayout,
} from "../form-layout";
import "./style";
import { Field } from "@formily/core";

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
}

const useFormItemLayout = (props: IFormilyLayoutProps) => {
  const layout = useFormLayout();
  const layoutType = props.layout ?? layout.layout ?? "horizontal";
  const labelAlign =
    layoutType === "vertical"
      ? props.labelAlign ?? "left"
      : props.labelAlign ?? layout.labelAlign ?? "left";
  return {
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
    // fullness: props.fullness ?? layout.fullness,
    // inset: props.inset ?? layout.inset,
    // asterisk: props.asterisk,
    // requiredMark: layout.requiredMark,
    // optionalMarkHidden: props.optionalMarkHidden,
    // bordered: props.bordered ?? layout.bordered,
    // feedbackIcon: props.feedbackIcon,
    // feedbackLayout: props.feedbackLayout ?? layout.feedbackLayout ?? "loose",
    // tooltipLayout: props.tooltipLayout ?? layout.tooltipLayout ?? "icon",
    // tooltipIcon: props.tooltipIcon ?? layout.tooltipIcon ?? (
    //   <QuestionCircleOutlined />
    // ),
  };
};
export const ID_SUFFIX = "_input";

// function useOverflow<
//   Container extends HTMLElement,
//   Content extends HTMLElement
// >() {
//   const [overflow, setOverflow] = useState(false);
//   const containerRef = useRef<Container>(null);
//   const contentRef = useRef<Content>(null);
//   const layout = useFormLayout();
//   const labelCol = JSON.stringify(layout.labelCol);

//   useEffect(() => {
//     requestAnimationFrame(() => {
//       if (containerRef.current && contentRef.current) {
//         const contentWidth = contentRef.current.getBoundingClientRect().width;
//         const containerWidth =
//           containerRef.current.getBoundingClientRect().width;
//         if (contentWidth && containerWidth && containerWidth < contentWidth) {
//           if (!overflow) setOverflow(true);
//         } else {
//           if (overflow) setOverflow(false);
//         }
//       }
//     });
//   }, [labelCol]);

//   return {
//     overflow,
//     containerRef,
//     contentRef,
//   };
// }

// 错误提示文字
const FormItemTip: React.FC<
  Pick<IFormItemProps, "feedbackStatus" | "feedbackText"> & {
    prefixCls: string;
  }
> = ({ prefixCls, feedbackStatus, feedbackText }) => {
  const visible = Boolean(!isUndef(feedbackStatus) && feedbackText);

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
            : feedbackText}
        </React.Fragment>
      </CSSTransition>
    )
  );
};

interface FormItemLabelProps
  extends Pick<
    IFormItemProps,
    "tooltip" | "label" | "requiredSymbol" | "required" | "rules"
  > {
  showColon: boolean | ReactNode;
  prefix: string;
  htmlFor?: string;
}

// 标签
const FormItemLabel: React.FC<FormItemLabelProps> = ({
  htmlFor,
  showColon,
  label,
  requiredSymbol,
  required,
  prefix,
  tooltip,
}) => {
  const symbolPosition = isObj(requiredSymbol)
    ? requiredSymbol?.position
    : "start";

  const symbolNode = required && !!requiredSymbol && (
    <strong className={`${prefix}-form-item-symbol`}>
      <svg fill="currentColor" viewBox="0 0 1024 1024" width="1em" height="1em">
        <path d="M583.338667 17.066667c18.773333 0 34.133333 15.36 34.133333 34.133333v349.013333l313.344-101.888a34.133333 34.133333 0 0 1 43.008 22.016l42.154667 129.706667a34.133333 34.133333 0 0 1-21.845334 43.178667l-315.733333 102.4 208.896 287.744a34.133333 34.133333 0 0 1-7.509333 47.786666l-110.421334 80.213334a34.133333 34.133333 0 0 1-47.786666-7.509334L505.685333 706.218667 288.426667 1005.226667a34.133333 34.133333 0 0 1-47.786667 7.509333l-110.421333-80.213333a34.133333 34.133333 0 0 1-7.509334-47.786667l214.186667-295.253333L29.013333 489.813333a34.133333 34.133333 0 0 1-22.016-43.008l42.154667-129.877333a34.133333 34.133333 0 0 1 43.008-22.016l320.512 104.106667L412.672 51.2c0-18.773333 15.36-34.133333 34.133333-34.133333h136.533334z" />
      </svg>
    </strong>
  );

  const renderTooltip = () => {
    if (!tooltip) {
      return null;
    }
    const tooltipIconClassName = `${prefix}-form-item-tooltip`;
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

  return label ? (
    <label htmlFor={htmlFor && `${htmlFor}${ID_SUFFIX}`}>
      {symbolPosition !== "end" && symbolNode} {label}
      {renderTooltip()}
      {symbolPosition === "end" && <> {symbolNode}</>}
      {showColon ? (showColon === true ? ":" : showColon) : ""}
    </label>
  ) : (
    <label htmlFor={htmlFor && `${htmlFor}${ID_SUFFIX}`}>&nbsp;</label>
  );
};

export const BaseItem: React.FC<React.PropsWithChildren<IFormItemProps>> = ({
  children,
  ...props
}) => {
  const formLayout = useFormItemLayout(props);

  // const { containerRef, contentRef, overflow } = useOverflow<
  //   HTMLDivElement,
  //   HTMLSpanElement
  // >();
  const {
    label,
    style,
    layout,
    colon = true,
    // addonBefore,
    // addonAfter,
    // asterisk,
    requiredSymbol = true,
    // optionalMarkHidden = false,
    feedbackStatus,
    feedbackText,
    extra,
    // fullness,
    // feedbackLayout,
    // feedbackIcon,
    // enableOutlineFeedback = true,
    // getPopupContainer,
    // inset,
    // bordered = true,
    labelWidth,
    wrapperWidth,
    labelCol,
    wrapperCol,
    labelAlign,
    required,
    hidden,
    // wrapperAlign = "left",
    // labelWrap,
    // wrapperWrap,
    // tooltipLayout,
    tooltip,

    // tooltipIcon,
  } = { ...formLayout, ...props };

  const labelStyle = { ...formLayout.labelStyle };
  const wrapperStyle = { ...formLayout.wrapperStyle };
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

  console.log("ffitem", { labelAlign, enableCol, labelCol, wrapperCol });

  const prefixCls = usePrefixCls("form");

  const gridStyles: React.CSSProperties = {};

  const classNames = cls(
    `${prefixCls}-item`,
    {
      [`${prefixCls}-item-error`]: feedbackText && feedbackStatus == "error",
      [`${prefixCls}-item-status-${feedbackStatus}`]: feedbackStatus,
      [`${prefixCls}-item-has-help`]: feedbackText,
      [`${prefixCls}-item-hidden`]: hidden,
      [`${prefixCls}-item-has-feedback`]: feedbackStatus && props.hasFeedback,
    },
    `${prefixCls}-layout-${layout}`,
    props.className
  );

  const labelClassNames = cls(`${prefixCls}-label-item`, {
    [`${prefixCls}-label-item-left`]: labelAlign === "left",
  });

  console.log("base-item", props);

  return (
    <div
      {...pickDataProps(props)}
      style={{
        ...style,
        ...gridStyles,
      }}
      data-grid-span={props.gridSpan}
      className={classNames}
      // onFocus={() => {
      //   // if (feedbackIcon || inset) {
      //   setActive(true);
      //   // }
      // }}
      // onBlur={() => {
      //   // if (feedbackIcon || inset) {
      //   setActive(false);
      //   // }
      // }}
    >
      <div
        style={labelStyle}
        className={cls(labelClassNames, {
          [`${prefixCls}-item-col-${labelCol}`]: enableCol && !!labelCol,
        })}
      >
        <FormItemLabel
          label={label}
          prefix={prefixCls}
          showColon={colon}
          required={!!required}
          requiredSymbol={requiredSymbol}
          tooltip={tooltip}
        ></FormItemLabel>
      </div>
      <div
        style={wrapperStyle}
        className={cls({
          [`${prefixCls}-item-wrapper`]: true,
          [`${prefixCls}-item-col-${wrapperCol}`]:
            enableCol && !!wrapperCol && label,
        })}
      >
        {/* {addonBefore && (
          <div className={cls(`${prefixCls}-addon-before`)}>{addonBefore}</div>
        )} */}
        <div className={cls(`${prefixCls}-item-control-wrapper`)}>
          <div className={cls(`${prefixCls}-item-control`)}>
            <div className={cls(`${prefixCls}-item-control-children`)}>
              <FormLayoutShallowContext.Provider value={undefined!}>
                {children}
              </FormLayoutShallowContext.Provider>
              {feedbackStatus ? (
                <div
                  className={`${prefixCls}-item-feedback ${prefixCls}-item-feedback-${feedbackStatus}`}
                >
                  {feedbackStatus === "warning" && (
                    <IconExclamationCircleFill />
                  )}
                  {feedbackStatus === "success" && <IconCheckCircleFill />}
                  {feedbackStatus === "error" && <IconCloseCircleFill />}
                  {feedbackStatus === "validating" && <IconLoading />}
                </div>
              ) : null}
            </div>
          </div>

          {/* {addonAfter && (
            <div className={cls(`${prefixCls}-addon-after`)}>{addonAfter}</div>
          )} */}
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
  );
};
