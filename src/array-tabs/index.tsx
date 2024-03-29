import { Badge, Tabs, TabsProps } from "@arco-design/web-react";
import { ArrayField } from "@formily/core";
import {
  ReactFC,
  RecursionField,
  observer,
  useField,
  useFieldSchema,
} from "@formily/react";
import React, { Fragment, useState } from "react";
import { usePrefixCls } from "../__builtins__";

interface IFeedbackBadgeProps {
  index: number;
}

const FeedbackBadge: ReactFC<IFeedbackBadgeProps> = observer(
  (props) => {
    const field = useField<ArrayField>();
    const tab = `${field.title || "Untitled"} ${props.index + 1}`;
    const errors = field.errors.filter((error: any) =>
      error.address.includes(`${field.address}.${props.index}`),
    );
    if (errors.length) {
      return (
        <Badge className="errors-badge" count={errors.length}>
          {tab}
        </Badge>
      );
    }
    return <Fragment>{tab}</Fragment>;
  },
  {
    scheduler(request) {
      requestAnimationFrame(request);
    },
  },
);

export const ArrayTabs: React.FC<React.PropsWithChildren<TabsProps>> = observer(
  (props) => {
    const field = useField<ArrayField>();
    const schema = useFieldSchema();
    const [activeTab, setActiveTab] = useState("tab-0");
    const prefixCls = usePrefixCls("formily-array-tabs");
    const value = Array.isArray(field.value) ? field.value : [];
    const dataSource = value?.length ? value : [{}];
    const onEdit = (targetKey: any, type: "add" | "remove") => {
      if (type === "add") {
        const id = dataSource.length;
        if (field?.value?.length) {
          field.push(null);
        } else {
          field.push(null, null);
        }
        setActiveTab(`tab-${id}`);
      } else if (type === "remove") {
        const index = Number(targetKey.match(/-(\d+)/)?.[1]);
        if (index - 1 > -1) {
          setActiveTab(`tab-${index - 1}`);
        }
        field.remove(index);
        // 只剩下一个的时候删除
        if (index === 0 && field.value.length === 1) {
          field.reset({ forceClear: true });
        }
      }
    };
    return (
      <Tabs
        type="card"
        {...props}
        activeTab={activeTab}
        onChange={(key) => {
          setActiveTab(key);
        }}
        editable={field.editable}
        onAddTab={() => onEdit(null, "add")}
        onDeleteTab={(key) => onEdit(key, "remove")}
      >
        {dataSource?.map((item, index) => {
          const items = Array.isArray(schema.items)
            ? schema.items[index]
            : schema.items!;
          const key = `tab-${index}`;
          return (
            <Tabs.TabPane
              key={key}
              title={<FeedbackBadge index={index} />}
              className={`${prefixCls}-panel`}
            >
              <RecursionField schema={items} name={index} />
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    );
  },
  {
    scheduler(request) {
      requestAnimationFrame(request);
    },
  },
);

export default ArrayTabs;
