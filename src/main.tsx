import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./app/router.tsx";
import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { store } from "./app/stores.ts";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import { useAppDispatch } from "./hooks/storeHooks.ts";
import { listenToAuthChanges } from "./features/auths/auth.slice.tsx";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(listenToAuthChanges());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
