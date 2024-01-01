import { ArrayBase as AntdArrayBase } from "../../array-base";
import type {
  ArrayField,
  FieldDisplayTypes,
  GeneralField,
} from "@formily/core";
import type { Schema } from "@formily/react";
import { RecursionField, useFieldSchema } from "@formily/react";
import { isArr } from "@formily/shared";
import {
  TableColumnProps,
  Dropdown,
  Menu,
  Space,
} from "@arco-design/web-react";
import React from "react";

import { isAdditionComponent, isColumnComponent } from "./utils";

const ArrayBase = AntdArrayBase as Required<typeof AntdArrayBase>;

export interface ObservableColumnSource {
  field: GeneralField;
  columnProps: TableColumnProps<any>;
  schema: Schema;
  display: FieldDisplayTypes;
  name: string;
}

const parseArrayItems = (
  schema: Schema["items"],
  parser: (subSchema: Schema) => any
): ObservableColumnSource[] => {
  if (!schema) return [];
  const sources: ObservableColumnSource[] = [];
  const items = isArr(schema) ? schema : [schema];
  return items.reduce((columns, subSchema) => {
    const item = parser(subSchema);
    if (item) {
      return columns.concat(item);
    }
    return columns;
  }, sources);
};

const renderOperations = (
  props: any,
  schema: Schema,
  index: number,
  field: ArrayField
) => {
  const propLength = Object.keys(schema.properties || {}).length;
  const max = props.maxItems || 2;
  const menu =
    propLength > max
      ? schema
          .mapProperties((propSchema, key, idx) => {
            if (idx < max) return null;
            return {
              key: idx,
              label: (
                <RecursionField schema={propSchema} name={`${index}.${key}`} />
              ),
            };
          })
          .filter(Boolean)
      : undefined;

  return (
    <ArrayBase.Item index={index} record={() => field?.value?.[index]}>
      <Space size="small">
        {schema.mapProperties((propSchema, key, idx) => {
          if (idx >= max) return null;
          return (
            <RecursionField
              key={`${index}.${key}`}
              schema={propSchema}
              name={`${index}.${key}`}
            />
          );
        })}
      </Space>
    </ArrayBase.Item>
  );
};

export const useColumnsAndSourceRender = (arrayField: ArrayField) => {
  const schema = useFieldSchema();
  const parseSources = (subSchema: Schema): ObservableColumnSource[] => {
    if (isColumnComponent(subSchema) || isAdditionComponent(subSchema)) {
      if (!subSchema["x-component-props"]?.dataIndex && !subSchema.name)
        return [];

      const name = subSchema["x-component-props"]?.dataIndex || subSchema.name;

      const field = arrayField.query(arrayField.address.concat(name)).take()!;

      const columnProps =
        (field?.component as any)?.[1] || subSchema["x-component-props"] || {};

      const display = field?.display || subSchema["x-display"];

      return [
        {
          name,
          display,
          field,
          schema: subSchema,
          columnProps,
        },
      ];
    } else if (subSchema.properties) {
      return subSchema.reduceProperties((buf, childSchema) => {
        return buf.concat(parseSources(childSchema));
      }, [] as ObservableColumnSource[]);
    } else {
      return [];
    }
  };

  if (!schema) throw new Error("can not found schema object");

  const sources = parseArrayItems(schema.items as any, parseSources);

  const columns = sources.reduce(
    (buf, { name, columnProps, schema: subSchema, display }, key) => {
      if (display === "hidden") return buf;

      if (!isColumnComponent(subSchema)) return buf;

      return buf.concat({
        ...columnProps,
        filters: Array.isArray(columnProps.filters)
          ? columnProps.filters
          : undefined,
        key: name,
        dataIndex: name,
        render: (value: any, record: any) => {
          const index = arrayField?.value?.indexOf(record);
          const children = (
            <ArrayBase.Item
              index={index}
              record={() => arrayField?.value?.[index]}
            >
              <RecursionField
                schema={subSchema}
                name={index}
                onlyRenderProperties
              />
            </ArrayBase.Item>
          );
          return children;
        },
      });
    },
    [] as TableColumnProps<any>[]
  );

  const renderSources = () => {
    return sources.map((column, key) => {
      //专门用来承接对Column的状态管理
      if (!isColumnComponent(column.schema)) return null;

      return (
        <RecursionField
          key={key}
          schema={column.schema}
          name={column.name}
          onlyRenderSelf
        />
      );
    });
  };

  return [columns, renderSources] as const;
};
