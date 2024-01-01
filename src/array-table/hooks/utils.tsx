import type { Schema } from "@formily/react";

export const hasSortable = (schema: Schema): any => {
  const canMap = (schema.items || (schema as any)) as Schema;
  const ret = canMap.reduceProperties((sortable, propSchema) => {
    if (sortable) {
      // 被上面条件阻止的
      return sortable;
    }
    /** 嵌套的 子 QueryTable 忽略 */
    if (propSchema["x-component"] === "QueryTable") {
      return null;
    } else if (propSchema["x-component"]?.indexOf("SortHandle") > -1) {
      return propSchema;
    } else if (propSchema.properties || propSchema.items) {
      return hasSortable(propSchema as any);
    }
    return sortable;
  });
  return ret;
};

export const isColumnComponent = (schema: Schema) => {
  return schema["x-component"]?.indexOf("Column") > -1;
};

export const isAdditionComponent = (schema: Schema) => {
  return schema["x-component"]?.indexOf("Addition") > -1;
};
