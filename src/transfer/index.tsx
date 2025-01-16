import { Transfer as ArcoTransfer } from "@arco-design/web-react";
import { isVoidField } from "@formily/core";
import { connect, mapProps } from "@formily/react";
import "./style";

const renderTitle = (item: any) => item.value;

export const Transfer = connect(
  ArcoTransfer,
  mapProps(
    {
      value: "targetKeys",
    },
    (props, field) => {
      if (isVoidField(field)) return props;
      return {
        ...props,
        render: props.render ?? renderTitle,
        dataSource:
          field.dataSource?.map((item) => {
            return {
              ...item,
              value: item.title || item.label,
              key: item.key || item.value,
            };
          }) || [],
      };
    }
  )
);

export default Transfer;
