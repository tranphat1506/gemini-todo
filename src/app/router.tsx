import PrivateRoute from "@/components/PrivateRoute";
import SplashScreen from "@/components/SplashScreen";
import WelcomeScreen from "@/components/WelcomeScreen";
import MainLayout from "@/layouts/MainLayout";
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
const HomePage = lazy(() => import("@/pages/HomePage"));

export const router = createBrowserRouter([
  // Public Routes
  {
    path: "/welcome",
    element: <WelcomeScreen />,
  },
  // Private Routes
  {
    element: <PrivateRoute />,
    children: [
      // Home
      {
        path: "/",
        element: (
          <MainLayout
            headerProps={{
              buttonState: {
                time: true,
              },
            }}
          >
            <HomePage />
          </MainLayout>
        ),
      },
      // Todos
      {
        path: "/todos",
        element: (
          <MainLayout
            headerProps={{
              buttonState: {
                search: true,
              },
            }}
          >
            <div>Todos Page</div>
          </MainLayout>
        ),
      },
    ],
  },
]);
