import { RecursionField, useFieldSchema } from "@formily/react";
import React from "react";
import { isAdditionComponent } from "./utils";

export const useAddition = () => {
  const schema = useFieldSchema();
  return schema.reduceProperties((addition, subSchema, key) => {
    if (isAdditionComponent(subSchema)) {
      return <RecursionField schema={subSchema} name={key} />;
    }
    return addition;
  }, null);
};
