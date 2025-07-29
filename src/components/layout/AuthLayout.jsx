import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-darkest p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-3xl font-bold text-lightest">
            AI Video Ads Generator
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
