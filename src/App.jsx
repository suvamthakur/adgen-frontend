import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { useGetUserDetailsQuery } from "./store/api/authApi";
import MainLayout from "./components/layout/MainLayout";

function App() {
  const { user, isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const { isError } = useGetUserDetailsQuery();

  useEffect(() => {
    // If not loading and no user and not on auth pages, redirect to login
    if (
      !isLoading &&
      !user &&
      !location.pathname.includes("/login") &&
      !location.pathname.includes("/signup")
    ) {
      navigate("/login");
    }
  }, [user, isLoading, navigate, location]);

  return (
    <>
      <MainLayout />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
