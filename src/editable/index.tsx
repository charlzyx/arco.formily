import React from "react";
import { Space as ArcoSpace, SpaceProps } from "@arco-design/web-react";
import { useFormLayout } from "../form-layout";

export const Editable: React.FC<React.PropsWithChildren<SpaceProps>> = (
  props
) => {
  const layout = useFormLayout();
  return (
    <ArcoSpace {...props} size={props.size || layout.spaceGap}>
      {props.children}
    </ArcoSpace>
  );
};

export default Editable;
