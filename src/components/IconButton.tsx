import clsx from "clsx";
import React from "react";

export interface IconButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon: React.ReactNode;
  subTitle?: string | React.ReactNode;
}
const IconButton: React.FC<IconButtonProps> = ({
  icon,
  subTitle,
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        "active:text-white text-gray-400 px-2 py-1 flex flex-col gap-1",
        props.className
      )}
    >
      {icon}
      {subTitle}
    </button>
  );
};

export default IconButton;
