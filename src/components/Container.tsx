import clsx from "clsx";
import React from "react";

interface ContainerProps {
  className?: string;
  children?: React.ReactNode;
}
const Container: React.FC<ContainerProps> = ({ className, children }) => {
  return <div className={clsx("w-full mx-auto", className)}>{children}</div>;
};

export default Container;
