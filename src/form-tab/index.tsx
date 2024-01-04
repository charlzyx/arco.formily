import { Badge, Tabs, TabsProps } from "@arco-design/web-react";
import { Schema, SchemaKey } from "@formily/json-schema";
import {
  ReactFC,
  RecursionField,
  observer,
  useField,
  useFieldSchema,
} from "@formily/react";
import { markRaw, model } from "@formily/reactive";
import cls from "classnames";
import React, { Fragment, useMemo } from "react";
import { usePrefixCls } from "../__builtins__";
import "./style";
export interface IFormTab {
  activeTab: string;
  setActiveTab(key: string): void;
}

export interface IFormTabProps extends TabsProps {
  formTab?: IFormTab;
}

type TabPaneProps = React.ComponentProps<typeof Tabs.TabPane>;
export interface IFormTabPaneProps extends TabPaneProps {
  key: string | number;
}

interface IFeedbackBadgeProps {
  name: SchemaKey;
  tab: React.ReactNode;
}

type ComposedFormTab = React.FC<React.PropsWithChildren<IFormTabProps>> & {
  TabPane: React.FC<React.PropsWithChildren<IFormTabPaneProps>>;
  createFormTab: (defaultActiveTab?: string) => IFormTab;
};

const useTabs = () => {
  const tabsField = useField();
  const schema = useFieldSchema();
  const tabs: { name: SchemaKey; props: any; schema: Schema }[] = [];
  schema.mapProperties((schema, name) => {
    const field = tabsField.query(tabsField.address.concat(name)).take();
    if (field?.display === "none" || field?.display === "hidden") return;
    if (schema["x-component"]?.indexOf("TabPane") > -1) {
      tabs.push({
        name,
        props: {
          key: schema?.["x-component-props"]?.key || name,
          ...schema?.["x-component-props"],
        },
        schema,
      });
    }
  });
  return tabs;
};

const FeedbackBadge: ReactFC<IFeedbackBadgeProps> = observer((props) => {
  const field = useField();
  const errors = field.form.queryFeedbacks({
    type: "error",
    address: `${field.address.concat(props.name)}.*`,
  });
  if (errors.length) {
    return (
      <Badge className="errors-badge" count={errors.length}>
        {props.tab}
      </Badge>
    );
  }
  return <Fragment>{props.tab}</Fragment>;
});

const createFormTab = (defaultActiveTab?: string) => {
  const formTab = model({
    activeTab: defaultActiveTab!,
    setActiveTab(key: string) {
      formTab.activeTab = key;
    },
  });
  return markRaw(formTab);
};

export const FormTab: ComposedFormTab = observer(
  ({ formTab, ...props }: IFormTabProps) => {
    const tabs = useTabs();
    const _formTab = useMemo(() => {
      return formTab ? formTab : createFormTab();
    }, []);
    const prefixCls = usePrefixCls("formily-tab");
    const activeTab = props.activeTab || _formTab?.activeTab;

    return (
      <Tabs
        {...props}
        className={cls(prefixCls, props.className)}
        activeTab={activeTab}
        onChange={(key) => {
          props.onChange?.(key);
          _formTab?.setActiveTab?.(key);
        }}
      >
        {tabs.map(({ props, schema, name }, key) => (
          <Tabs.TabPane
            key={key}
            {...props}
            title={<FeedbackBadge name={name} tab={props.tab} />}
            forceRender
          >
            <RecursionField schema={schema} name={name} />
          </Tabs.TabPane>
        ))}
      </Tabs>
    );
  }
) as unknown as ComposedFormTab;

const TabPane: React.FC<React.PropsWithChildren<IFormTabPaneProps>> = ({
  children,
}) => {
  return <Fragment>{children}</Fragment>;
};

FormTab.TabPane = TabPane;
FormTab.createFormTab = createFormTab;

export default FormTab;
