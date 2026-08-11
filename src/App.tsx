import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ErrorBoundary } from "./components/errors/ErrorBoundary";
import { SessionExpiredHandler } from "./components/errors/SessionExpiredHandler";
import ToastContainer from "./components/ui/Toast";

export const App = () => {
  return (
    <>
      <ErrorBoundary>
        <SessionExpiredHandler />
        <RouterProvider router={router} />
      </ErrorBoundary>

      <ToastContainer />
    </>
  );
};

export default App;