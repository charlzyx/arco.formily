import { ArrayField, isArrayField } from "@formily/core";
import { Schema } from "@formily/json-schema";
import { RecursionField, useField, useFieldSchema } from "@formily/react";
import { isArr } from "@formily/shared";
import { useState } from "react";
import { ArrayBase } from "../../array-base";
import {
  ColumnProps,
  ObservableColumnSource,
  isAdditionComponent,
  isColumnComponent,
} from "../utils";

const parseSources = (
  arrayField: ArrayField,
  schema: Schema,
): ObservableColumnSource[] => {
  if (isColumnComponent(schema) || isAdditionComponent(schema)) {
    if (!schema["x-component-props"]?.dataIndex && !schema.name) return [];
    const name = schema["x-component-props"]?.dataIndex || schema.name;
    const field = arrayField.query(arrayField.address.concat(name)).take();
    const columnProps =
      (field?.component as any)?.[1] || schema["x-component-props"] || {};
    const display = field?.display || schema["x-display"];
    return [
      {
        name,
        display,
        field,
        schema,
        columnProps,
      },
    ];
  } else if (schema.properties) {
    return schema.reduceProperties<
      ObservableColumnSource[],
      ObservableColumnSource[]
    >((buf, schema) => {
      return buf.concat(parseSources(arrayField, schema));
    }, []);
  }
  return [];
};
const parseArrayItems = (arrayField: ArrayField, schema: Schema["items"]) => {
  if (!schema) return [];
  const sources: ObservableColumnSource[] = [];
  const items = isArr(schema) ? schema : [schema];
  return items.reduce((columns, schema) => {
    const item = parseSources(arrayField, schema);
    if (item) {
      return columns.concat(item);
    }
    return columns;
  }, sources);
};

export const useArrayTableSources = () => {
  const arrayField = useField<ArrayField>();
  const schema = useFieldSchema();
  const sources = parseArrayItems(arrayField, schema.items);
  return sources;
};

export const useArrayTableColumns = (
  arrayField: ArrayField,
  sources: ObservableColumnSource[],
  dataSource: any[],
) => {
  const columns = sources.reduce<ColumnProps<any>[]>(
    (buf, { name, columnProps, schema, display }, key) => {
      if (display !== "visible" || !isColumnComponent(schema)) {
        return buf;
      }
      return buf.concat({
        ...columnProps,
        key,
        dataIndex: name,
        render: (value: any, record: any) => {
          /**
           * 优化笔记：
           * 这里用传入的 dataSoruce 比使用 arrayField.value 要快得多， 在10w条数据测试中感受明显
           * 在外部的 slice 创造了一个浅拷贝, 即这里的 dataSource 是个浅拷贝， 那么这个浅拷贝的 indexOf 在内部的遍历
           * 就能够减少那一堆本来 Observer 的 get handle;
           * 跟这里有异曲同工之妙 @link https://github.com/alibaba/formily/pull/3863#discussion_r1234706804
           */
          // const index = arrayField.value.indexOf(record);
          const index = dataSource.indexOf(record);
          const children = (
            <ArrayBase.Item
              index={index}
              record={() => arrayField?.value?.[index]}
            >
              <RecursionField
                schema={schema}
                name={index}
                onlyRenderProperties
              />
            </ArrayBase.Item>
          );
          return children;
        },
      });
    },
    [],
  );

  return columns;
};

export const useAddition = () => {
  const schema = useFieldSchema();
  return schema.reduceProperties((addition, schema, key) => {
    if (isAdditionComponent(schema)) {
      return <RecursionField schema={schema} name={key} />;
    }
    return addition;
  }, null);
};

export const useArrayField = () => {
  const field = useField();
  let array = field;
  while (array && !isArrayField(array)) {
    array = array.parent;
  }
  return array;
};
