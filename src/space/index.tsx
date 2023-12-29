import React from "react";
import { Space as ArcoSpace, SpaceProps } from "@arco-design/web-react";
import { useFormLayout } from "../form-layout";

export const Space: React.FC<React.PropsWithChildren<SpaceProps>> = (props) => {
  const layout = useFormLayout();
  return React.createElement(ArcoSpace, {
    size: props.size ?? layout?.spaceGap,
    ...props,
  });
};

export default Space;
