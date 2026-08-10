<<<<<<< HEAD
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ErrorBoundary } from './components/errors/ErrorBoundary';
import { SessionExpiredHandler } from './components/errors/SessionExpiredHandler';

export const App = () => {
  return (
    <ErrorBoundary>
      <SessionExpiredHandler />
      <RouterProvider router={router} />
    </ErrorBoundary>
=======
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import ToastContainer from "./components/ui/Toast";

export const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
>>>>>>> 3cefa1e (feat: complete dashboard reports and UX improvements)
  );
};

export default App;