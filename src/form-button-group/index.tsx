/**
 * 1. FormItem网格布局
 * 2. 居中，居右，居左布局
 * 3. 行内布局
 * 4. 吸底布局
 */
import { Space, SpaceProps } from "@arco-design/web-react";
import { ReactFC } from "@formily/react";
import cls from "classnames";
import React, { useLayoutEffect, useRef, useState } from "react";
import StickyBox from "react-sticky-box";
import { usePrefixCls } from "../__builtins__";
import { BaseItem, IFormItemProps } from "../form-item";
import { useFormLayout } from "../form-layout";
import "./style";
interface IStickyProps extends React.ComponentProps<typeof StickyBox> {
  align?: React.CSSProperties["textAlign"];
}

type IFormButtonGroupProps = Omit<SpaceProps, "align" | "size"> & {
  align?: React.CSSProperties["textAlign"];
  gutter?: number;
};

type ComposedButtonGroup = ReactFC<IFormButtonGroupProps> & {
  Sticky: ReactFC<React.PropsWithChildren<IStickyProps>>;
  FormItem: ReactFC<
    IFormItemProps & {
      gutter?: number;
    }
  >;
};

function getInheritedBackgroundColor(el: HTMLElement): string {
  // get default style for current browser
  const defaultStyle = getDefaultBackground(); // typically "rgba(0, 0, 0, 0)"

  // get computed color for el
  const backgroundColor = window.getComputedStyle(el).backgroundColor;

  // if we got a real value, return it
  if (backgroundColor !== defaultStyle) return backgroundColor;

  // if we've reached the top parent el without getting an explicit color, return default
  if (!el.parentElement) return defaultStyle;

  // otherwise, recurse and try again on parent element
  return getInheritedBackgroundColor(el.parentElement);
}

function getDefaultBackground() {
  // have to add to the document in order to use getComputedStyle
  const div = document.createElement("div");
  document.head.appendChild(div);
  const bg = window.getComputedStyle(div).backgroundColor;
  document.head.removeChild(div);
  return bg;
}

export const FormButtonGroup: ComposedButtonGroup = ({
  align = "left",
  gutter,
  ...props
}) => {
  const prefixCls = usePrefixCls("formily-button-group");
  return (
    <Space
      {...props}
      size={gutter}
      className={cls(prefixCls, props.className)}
      style={{
        ...props.style,
        justifyContent:
          align === "left"
            ? "flex-start"
            : align === "right"
            ? "flex-end"
            : "center",
        display: "flex",
      }}
    >
      {props.children}
    </Space>
  );
};

FormButtonGroup.FormItem = ({ gutter, ...props }) => {
  const formLayout = useFormLayout();
  return (
    <BaseItem
      label=" "
      {...props}
      style={{
        margin: 0,
        padding: 0,
        ...props.style,
        width: "100%",
      }}
      colon={false}
    >
      {(props.children as any)?.length ? (
        <Space size={gutter}>{props.children as React.ReactNode}</Space>
      ) : (
        (props.children as React.ReactNode)
      )}
    </BaseItem>
  );
};

FormButtonGroup.Sticky = ({ align = "left", ...props }) => {
  const ref = useRef(null);
  const [color, setColor] = useState("transparent");
  const prefixCls = usePrefixCls("formily-button-group");

  useLayoutEffect(() => {
    if (ref.current) {
      const computed = getInheritedBackgroundColor(ref.current);
      if (computed !== color) {
        setColor(computed);
      }
    }
  });
  return (
    <StickyBox
      {...props}
      className={cls(`${prefixCls}-sticky`, props.className)}
      style={{
        backgroundColor: color,
        ...props.style,
      }}
      bottom
    >
      <div
        ref={ref}
        className={`${prefixCls}-sticky-inner`}
        style={{
          ...props.style,
          justifyContent:
            align === "left"
              ? "flex-start"
              : align === "right"
              ? "flex-end"
              : "center",
        }}
      >
        {props.children}
      </div>
    </StickyBox>
  );
};

export default FormButtonGroup;
