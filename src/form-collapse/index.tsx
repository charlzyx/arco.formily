import {
  Badge,
  Collapse,
  CollapseItemProps,
  CollapseProps,
} from "@arco-design/web-react";
import { Schema, SchemaKey } from "@formily/json-schema";
import {
  RecursionField,
  observer,
  useField,
  useFieldSchema,
} from "@formily/react";
import { markRaw, model } from "@formily/reactive";
import { toArr } from "@formily/shared";
import cls from "classnames";
import React, { Fragment, useMemo } from "react";
import { usePrefixCls } from "../__builtins__";
import "./style";

type ActiveKeys = string | Array<string>;

type ActiveKey = string;
export interface IFormCollapse {
  activeKeys: ActiveKeys;
  hasActiveKey(key: ActiveKey): boolean;
  setActiveKeys(key: ActiveKeys): void;
  addActiveKey(key: ActiveKey): void;
  removeActiveKey(key: ActiveKey): void;
  toggleActiveKey(key: ActiveKey): void;
}

export interface IFormCollapseProps extends CollapseProps {
  formCollapse?: IFormCollapse;
}

type ComposedFormCollapse = React.FC<
  React.PropsWithChildren<IFormCollapseProps>
> & {
  CollapsePanel?: React.FC<React.PropsWithChildren<CollapseItemProps>>;
  createFormCollapse?: (defaultActiveKeys?: ActiveKeys) => IFormCollapse;
};

const usePanels = () => {
  const collapseField = useField();
  const schema = useFieldSchema();
  const panels: { name: string; props: any; schema: Schema }[] = [];
  schema.mapProperties((schema, name) => {
    const field = collapseField
      .query(collapseField.address.concat(name))
      .take();
    if (field?.display === "none" || field?.display === "hidden") return;
    if (schema["x-component"]?.indexOf("CollapsePanel") > -1) {
      const componentProps = field?.componentProps;
      panels.push({
        name: name as string,
        props: {
          ...componentProps,
          key: componentProps?.key || name,
        },
        schema,
      });
    }
  });
  return panels;
};

const createFormCollapse = (defaultActiveKeys: ActiveKeys = []) => {
  const formCollapse = model({
    activeKeys: defaultActiveKeys,
    setActiveKeys(keys: ActiveKeys) {
      formCollapse.activeKeys = keys;
    },
    hasActiveKey(key: ActiveKey) {
      if (Array.isArray(formCollapse.activeKeys)) {
        if (formCollapse.activeKeys.includes(key)) {
          return true;
        }
      } else if (formCollapse.activeKeys == key) {
        return true;
      }
      return false;
    },
    addActiveKey(key: ActiveKey) {
      if (formCollapse.hasActiveKey(key)) return;
      formCollapse.activeKeys = toArr(formCollapse.activeKeys).concat(key);
    },
    removeActiveKey(key: ActiveKey) {
      if (Array.isArray(formCollapse.activeKeys)) {
        formCollapse.activeKeys = formCollapse.activeKeys.filter(
          (item) => item != key
        );
      } else {
        formCollapse.activeKeys = "";
      }
    },
    toggleActiveKey(key: ActiveKey) {
      if (formCollapse.hasActiveKey(key)) {
        formCollapse.removeActiveKey(key);
      } else {
        formCollapse.addActiveKey(key);
      }
    },
  });
  return markRaw(formCollapse);
};

export const FormCollapse: ComposedFormCollapse = observer(
  ({ formCollapse, ...props }) => {
    const field = useField();
    const panels = usePanels();
    const prefixCls = usePrefixCls("formily-collapse");
    const _formCollapse = useMemo(() => {
      return formCollapse
        ? formCollapse
        : createFormCollapse(props.defaultActiveKey);
    }, []);

    const takeActiveKeys = () => {
      if (props.activeKey) return props.activeKey;
      if (_formCollapse?.activeKeys) return _formCollapse?.activeKeys;
      if (props.accordion) return panels[0]?.name;
      return panels.map((item) => item.name.toString());
    };

    const badgedHeader = (key: SchemaKey, props: any) => {
      const errors = field.form.queryFeedbacks({
        type: "error",
        address: `${field.address.concat(key)}.*`,
      });
      if (errors.length) {
        return (
          <Badge className="errors-badge" count={errors.length}>
            {props.header}
          </Badge>
        );
      }
      return props.header;
    };
    return (
      <Collapse
        {...props}
        lazyload={false}
        className={cls(prefixCls, props.className)}
        activeKey={takeActiveKeys()}
        onChange={(key, keys, e) => {
          props?.onChange?.(key, keys, e);
          _formCollapse?.setActiveKeys?.(key);
        }}
      >
        {panels.map(({ props, schema, name }, index) => (
          <Collapse.Item
            name={name}
            {...props}
            header={badgedHeader(name, props)}
            // forceRender
          >
            <RecursionField schema={schema} name={name} />
          </Collapse.Item>
        ))}
      </Collapse>
    );
  }
);

const CollapsePanel: React.FC<React.PropsWithChildren<CollapseItemProps>> = ({
  children,
}) => {
  return <Fragment>{children}</Fragment>;
};

FormCollapse.CollapsePanel = CollapsePanel;
FormCollapse.createFormCollapse = createFormCollapse;

export default FormCollapse;
