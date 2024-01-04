import { SpaceProps } from "@arco-design/web-react";
import React from "react";
import { useFormLayout } from "../form-layout";
import { InnerSpace } from "./inner-space";
import "./style";

export const Space: React.FC<React.PropsWithChildren<SpaceProps>> = (props) => {
  const layout = useFormLayout();
  return (
    <InnerSpace {...props} size={props.size || layout.spaceGap}>
      {props.children}
    </InnerSpace>
  );
};

export default Space;
