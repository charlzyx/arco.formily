import { connect, mapProps } from "@formily/react";
import { Transfer as ArcoTransfer } from "@arco-design/web-react";
import { isVoidField } from "@formily/core";

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

Transfer.defaultProps = {
  render: (item) => item.value,
};

export default Transfer;
