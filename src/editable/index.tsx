import { Popover, PopoverProps } from "@arco-design/web-react";
import {
  IconClose as CloseOutlined,
  IconEdit as EditOutlined,
  IconMessage as MessageOutlined,
} from "@arco-design/web-react/icon";
import { Field, isVoidField } from "@formily/core";
import { observer, useField } from "@formily/react";
import cls from "classnames";
import React, { useLayoutEffect, useRef, useState } from "react";
import { useClickAway, usePrefixCls } from "../__builtins__";
import { BaseItem, IFormItemProps } from "../form-item";
import "./style";
type IPopoverProps = PopoverProps;

type ComposedEditable = React.FC<React.PropsWithChildren<IFormItemProps>> & {
  Popover?: React.FC<
    React.PropsWithChildren<IPopoverProps & { title?: React.ReactNode }>
  >;
};

const useParentPattern = () => {
  const field = useField<Field>();
  return field?.parent?.pattern || field?.form?.pattern;
};

const useEditable = (): [boolean, (payload: boolean) => void] => {
  const pattern = useParentPattern();
  const field = useField<Field>();
  useLayoutEffect(() => {
    if (pattern === "editable") {
      return field.setPattern("readPretty");
    }
  }, [pattern]);
  return [
    field.pattern === "editable",
    (payload: boolean) => {
      if (pattern !== "editable") return;
      field.setPattern(payload ? "editable" : "readPretty");
    },
  ];
};

const useFormItemProps = (): IFormItemProps => {
  const field = useField();
  if (isVoidField(field)) return {};
  if (!field) return {};
  const takeMessage = () => {
    if (field.selfErrors.length) return field.selfErrors;
    if (field.selfWarnings.length) return field.selfWarnings;
    if (field.selfSuccesses.length) return field.selfSuccesses;
  };

  return {
    feedbackStatus: field.validateStatus,
    feedbackText: takeMessage(),
    extra: field.description,
  };
};

export const Editable: ComposedEditable = observer((props) => {
  const [editable, setEditable] = useEditable();
  const pattern = useParentPattern();
  const itemProps = useFormItemProps();
  const field = useField<Field>();
  const basePrefixCls = usePrefixCls();
  const prefixCls = usePrefixCls("formily-editable");
  const ref = useRef<boolean>();
  const innerRef = useRef<HTMLDivElement>(null);
  const recover = () => {
    if (ref.current && !field?.errors?.length) {
      setEditable(false);
    }
  };
  const renderEditHelper = () => {
    if (editable) return;
    return (
      <BaseItem {...props} {...itemProps}>
        {pattern === "editable" && (
          <EditOutlined className={`${prefixCls}-edit-btn`} />
        )}
        {pattern !== "editable" && (
          <MessageOutlined className={`${prefixCls}-edit-btn`} />
        )}
      </BaseItem>
    );
  };

  const renderCloseHelper = () => {
    if (!editable) return;
    return (
      <BaseItem {...props}>
        <CloseOutlined className={`${prefixCls}-close-btn`} />
      </BaseItem>
    );
  };

  useClickAway((e) => {
    const target = e.target as HTMLElement;
    if (target?.closest(`.${basePrefixCls}-select-dropdown`)) return;
    if (target?.closest(`.${basePrefixCls}-picker-dropdown`)) return;
    if (target?.closest(`.${basePrefixCls}-cascader-menus`)) return;
    recover();
  }, innerRef);

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;
    const close = innerRef.current?.querySelector(`.${prefixCls}-close-btn`);
    if (target?.contains(close!) || close?.contains(target)) {
      recover();
    } else if (!ref.current) {
      setTimeout(() => {
        setEditable(true);
        setTimeout(() => {
          innerRef.current?.querySelector("input")?.focus();
        });
      });
    }
  };

  ref.current = editable;

  return (
    <div className={prefixCls} ref={innerRef} onClick={onClick}>
      <div className={`${prefixCls}-content`}>
        <BaseItem {...props} {...itemProps}>
          {props.children}
        </BaseItem>
        {renderEditHelper()}
        {renderCloseHelper()}
      </div>
    </div>
  );
});

Editable.Popover = observer((props) => {
  const field = useField<Field>();
  const pattern = useParentPattern();
  const [visible, setVisible] = useState(false);
  const prefixCls = usePrefixCls("formily-editable");
  const closePopover = async () => {
    try {
      await field.form.validate(`${field.address}.*`);
    } finally {
      const errors = field.form.queryFeedbacks({
        type: "error",
        address: `${field.address}.*`,
      });
      // biome-ignore lint/correctness/noUnsafeFinally: <explanation>
      if (errors?.length) return;
      setVisible(false);
    }
  };
  const openPopover = () => {
    setVisible(true);
  };
  return (
    <Popover
      {...props}
      title={props.title || field.title}
      popupVisible={visible}
      className={cls(prefixCls, props.className)}
      content={props.children}
      trigger="click"
      unmountOnExit
      onVisibleChange={(visible) => {
        if (visible) {
          openPopover();
        } else {
          closePopover();
        }
      }}
    >
      <div className={cls(prefixCls, props.className)}>
        <BaseItem className={`${prefixCls}-trigger`}>
          <div className={`${prefixCls}-content`}>
            <span className={`${prefixCls}-preview`}>
              {props.title || field.title}
            </span>
            {pattern === "editable" && (
              <EditOutlined className={`${prefixCls}-edit-btn`} />
            )}
            {pattern !== "editable" && (
              <MessageOutlined className={`${prefixCls}-edit-btn`} />
            )}
          </div>
        </BaseItem>
      </div>
    </Popover>
  );
});

export default Editable;
