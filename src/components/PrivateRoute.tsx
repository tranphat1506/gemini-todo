import { useAppSelector } from "@/hooks/storeHooks";
import { Outlet, Navigate } from "react-router";
import SplashScreen from "./SplashScreen";

const PrivateRoute = () => {
  const { user, isAuthReady } = useAppSelector((state) => state.auth);

  if (!isAuthReady) {
    return <SplashScreen />;
  }

  if (user) {
    return <Outlet />;
  } else {
    return <Navigate to="/welcome" />;
  }
};

export default PrivateRoute;
