import React from "react";
import Container from "@/components/Container";
import IconButton, { type IconButtonProps } from "@/components/IconButton";
import clsx from "clsx";
import { FaTasks } from "react-icons/fa";
import { LuAlarmClockCheck } from "react-icons/lu";
import { PiUserBold } from "react-icons/pi";
import { RiHome9Fill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router";

interface BottomNavButtonProps extends IconButtonProps {
  routeEndpoint: string;
}
const BottomNavButton: React.FC<BottomNavButtonProps> = ({
  routeEndpoint,
  style,
  ...props
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const handleNavToRoute = () => {
    if (routeEndpoint !== currentPath) navigate(routeEndpoint);
  };
  const isOnRoute = routeEndpoint === currentPath;
  const buttonStyles: React.CSSProperties | undefined = isOnRoute
    ? { ...style, color: "white" }
    : style;

  return (
    <IconButton onClick={handleNavToRoute} style={buttonStyles} {...props} />
  );
};

interface BottomNavBarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const BottomNavBar = React.forwardRef<HTMLDivElement, BottomNavBarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={clsx(
          "bg-black border-t border-t-[#1b1b1b] w-full z-10",
          className
        )}
      >
        <Container className="flex px-4 justify-between relative z-10">
          <BottomNavButton
            routeEndpoint="/"
            className="flex-1 px-2 py-5"
            icon={<RiHome9Fill className="mx-auto" size={"1.25rem"} />}
            subTitle={
              <span className="mx-auto text-sm font-medium leading-none">
                Home
              </span>
            }
          />
          <BottomNavButton
            routeEndpoint="/todos"
            className="flex-1 px-2 py-5"
            icon={<FaTasks className="mx-auto" size={"1.25rem"} />}
            subTitle={
              <span className="mx-auto text-sm font-medium leading-none">
                Todos
              </span>
            }
          />
          <BottomNavButton
            routeEndpoint="/pomodoro"
            className="flex-1 px-2 py-5"
            icon={<LuAlarmClockCheck className="mx-auto" size={"1.25rem"} />}
            subTitle={
              <span className="mx-auto text-sm font-medium leading-none">
                Pomodoro
              </span>
            }
          />
          <BottomNavButton
            routeEndpoint="/profile"
            className="flex-1 px-2 py-5"
            icon={<PiUserBold className="mx-auto" size={"1.25rem"} />}
            subTitle={
              <span className="mx-auto text-sm font-medium leading-none">
                Profile
              </span>
            }
          />
        </Container>
      </div>
    );
  }
);

BottomNavBar.displayName = "BottomNavBar"; // để tránh warning trong dev tools

export default BottomNavBar;
