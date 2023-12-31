import { ConfigProvider, FormProps, SpaceProps } from "@arco-design/web-react";
import "@arco-design/web-react/lib/Form/style/index";
import { IGridOptions } from "@formily/grid";
import cls from "classnames";
import React, { createContext, useContext } from "react";
import { usePrefixCls } from "../__builtins__";
import {
  IComputedProps,
  IResponsiveFormLayoutProps,
  useResponsiveFormLayout,
} from "./useResponsiveFormLayout";

type ArcoFormLayout = Pick<
  FormProps,
  "colon" | "size" | "style" | "className" | "prefixCls"
> & { shallow?: boolean };

// formily 增强
export interface FormLayoutPro {
  labelWrap?: boolean;
  labelWidth?: React.CSSProperties["width"];
  wrapperWrap?: boolean;
  wrapperWidth?: React.CSSProperties["width"];
  labelStyle?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
}

export interface IFormilyLayoutContext
  extends IComputedProps,
    Pick<
      FormProps,
      "prefixCls" | "className" | "style" | "colon" | "size" | "requiredSymbol"
    >,
    FormLayoutPro,
    // @formily/grid
    IGridOptions {
  gridSpan?: number;
  gridColumnGap?: number;
  gridRowGap?: number;
  spaceGap?: SpaceProps["size"];
}

export interface IFormilyLayoutProps extends IFormilyLayoutContext {}

export const FormLayoutDeepContext = createContext<IFormilyLayoutContext>(
  null as unknown as IFormilyLayoutContext
);

export const FormLayoutShallowContext = createContext<IFormilyLayoutContext>(
  null as unknown as IFormilyLayoutContext
);

export const useFormDeepLayout = () => useContext(FormLayoutDeepContext);

export const useFormShallowLayout = () => useContext(FormLayoutShallowContext);

export const useFormLayout = () => ({
  ...useFormDeepLayout(),
  ...useFormShallowLayout(),
});

export const FormLayout: React.FC<
  React.PropsWithChildren<IResponsiveFormLayoutProps<ArcoFormLayout>>
> & {
  useFormLayout: () => IFormilyLayoutContext;
  useFormDeepLayout: () => IFormilyLayoutContext;
  useFormShallowLayout: () => IFormilyLayoutContext;
} = ({ shallow, children, prefixCls, className, style, ...otherProps }) => {
  const ctx = useContext(ConfigProvider.ConfigContext);
  const { ref, props } = useResponsiveFormLayout<ArcoFormLayout>({
    breakpoints: [],
    labelCol: [5],
    wrapperCol: [19],
    ...otherProps,
  });
  console.log("ffprops", props);
  const deepLayout = useFormDeepLayout();
  const formPrefixCls = usePrefixCls("form", { prefix: prefixCls });
  const layoutPrefixCls = usePrefixCls("formily-layout", { prefix: prefixCls });
  const layoutClassName = cls(
    layoutPrefixCls,
    formPrefixCls,
    {
      [`${formPrefixCls}-${props.layout}`]: true,
      [`${formPrefixCls}-rtl`]: ctx.rtl,
      [`${formPrefixCls}-size-${props.size || "default"}`]:
        props.size || ctx.size,
    },
    className
  );
  const renderChildren = () => {
    const newDeepLayout = {
      ...deepLayout,
    };
    if (!shallow) {
      Object.assign(newDeepLayout, props);
    } else {
      if (props.size) {
        newDeepLayout.size = props.size;
      }
      if (props.colon) {
        newDeepLayout.colon = props.colon;
      }
    }

    return (
      <FormLayoutDeepContext.Provider value={newDeepLayout}>
        <FormLayoutShallowContext.Provider
          value={shallow ? props : (undefined as any)}
        >
          {children}
        </FormLayoutShallowContext.Provider>
      </FormLayoutDeepContext.Provider>
    );
  };
  return (
    <div ref={ref} className={layoutClassName} style={style}>
      {renderChildren()}
    </div>
  );
};

FormLayout.defaultProps = {
  shallow: true,
};

FormLayout.useFormDeepLayout = useFormDeepLayout;
FormLayout.useFormShallowLayout = useFormShallowLayout;
FormLayout.useFormLayout = useFormLayout;

export default FormLayout;
