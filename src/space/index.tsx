import React from "react";
import { SpaceProps } from "@arco-design/web-react";
import { InnerSpace } from "./inner-space";
import { useFormLayout } from "../form-layout";

export const Space: React.FC<React.PropsWithChildren<SpaceProps>> = (props) => {
  const layout = useFormLayout();
  return (
    <InnerSpace {...props} size={props.size || layout.spaceGap}>
      {props.children}
    </InnerSpace>
  );
};

export default Space;
