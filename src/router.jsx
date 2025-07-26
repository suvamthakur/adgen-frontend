import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import GenerateScript from "./pages/GenerateScript";
import GenerateAd from "./pages/GenerateAd";
import PreviousOrders from "./pages/PreviousOrders";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout from "./components/layout/AuthLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "generate-ads",
        element: (
          <ProtectedRoute>
            <GenerateScript />
          </ProtectedRoute>
        ),
      },
      {
        path: "generate-ads/:orderId",
        element: (
          <ProtectedRoute>
            <GenerateAd />
          </ProtectedRoute>
        ),
      },
      {
        path: "previous-orders",
        element: (
          <ProtectedRoute>
            <PreviousOrders />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
]);

export default router;
