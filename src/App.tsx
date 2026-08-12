import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ErrorBoundary } from "./components/errors/ErrorBoundary";
import { SessionExpiredHandler } from "./components/errors/SessionExpiredHandler";
import ToastContainer from "./components/ui/Toast";

export const App = () => {
  return (
<<<<<<< HEAD
    <>
      <ErrorBoundary>
        <SessionExpiredHandler />
        <RouterProvider router={router} />
      </ErrorBoundary>

      <ToastContainer />
    </>
=======
    <ErrorBoundary>
      <SessionExpiredHandler />
      <RouterProvider router={router} />
      <ToastContainer />
    </ErrorBoundary>
>>>>>>> d4c0e86 (feat: add notification center)
  );
};

export default App;
