import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetUserDetailsQuery,
  useLoginMutation,
} from "../../store/api/authApi";
import { toast } from "react-hot-toast";

const Login = () => {
  const { data } = useGetUserDetailsQuery();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [login, { isLoading }] = useLoginMutation();

  // Navigate to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData).unwrap();
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center bg-darkest">
      <div className="bg-darker p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-lightest mb-6">
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-lightest mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-darkest text-lightest border border-lighter rounded-md focus:outline-none focus:ring-2 focus:ring-lighter"
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-lightest mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-darkest text-lightest border border-lighter rounded-md focus:outline-none focus:ring-2 focus:ring-lighter"
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-lighter hover:bg-opacity-90 text-lightest font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-lightest mr-2"></div>
                <span>Logging in...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-lightest">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-lighter hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
