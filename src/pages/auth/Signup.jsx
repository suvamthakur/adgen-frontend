import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetUserDetailsQuery,
  useSendOtpMutation,
  useSignupMutation,
  useVerifyOtpAndSignupMutation,
} from "../../store/api/authApi";
import { toast } from "react-hot-toast";

const Signup = () => {
  const { data } = useGetUserDetailsQuery();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [signup, { isLoading }] = useSignupMutation();
  const [verifyOtp, { isLoading: isOtpLoading }] =
    useVerifyOtpAndSignupMutation();
  const [sendOtp] = useSendOtpMutation();

  const [otp, setOtp] = useState("");
  const [isVerifyOtp, setIsVerifyOtp] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

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
      await signup(formData);
      setIsVerifyOtp(true);
    } catch (error) {
      toast.error(error?.data?.message || "Signup failed. Please try again.");
    }
  };

  const handleVerifyOtpAndSignup = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp({ email: formData.email, otp });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.log(error?.data?.message || "Something Went Wrong");
    }
  };

  const resendOtp = async () => {
    try {
      await sendOtp(formData.email);
    } catch (error) {
      console.log(error?.data?.message || "Something Went Wrong");
    }
  };

  return (
    <div className="bg-darker rounded-lg shadow-lg p-8">
      {!isVerifyOtp ? (
        <>
          <h2 className="text-2xl font-bold text-center text-lightest mb-6">
            Create an Account
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block text-lightest mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-darkest text-lightest border border-lighter rounded-md focus:outline-none focus:ring-2 focus:ring-lighter"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-lightest mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-darkest text-lightest border border-lighter rounded-md focus:outline-none focus:ring-2 focus:ring-lighter"
                  required
                />
              </div>
            </div>

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
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </>
      ) : (
        <VerifyOtp
          otp={otp}
          setOtp={setOtp}
          isLoading={isOtpLoading}
          setIsVerifyOtp={setIsVerifyOtp}
          handleSubmit={handleVerifyOtpAndSignup}
          resendOtp={resendOtp}
        />
      )}

      <div className="mt-4 text-center">
        <p className="text-lightest">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-lighter hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

const VerifyOtp = ({
  otp,
  setOtp,
  isLoading,
  handleSubmit,
  resendOtp,

  setIsVerifyOtp,
  ...props
}) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    // Start initial timer
    setTimer(30);
  }, []);

  useEffect(() => {
    // Set up countdown timer
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = () => {
    if (timer === 0) {
      resendOtp();
      setTimer(30);
    }
  };

  return (
    <div className="" {...props}>
      <h2 className="text-2xl font-bold text-center text-lightest mb-4">
        Verify OTP
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label htmlFor="otp" className="block text-lightest mb-2">
            Enter OTP
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 py-2 bg-darkest text-lightest border border-lighter rounded-md focus:outline-none focus:ring-2 focus:ring-lighter"
            required
            maxLength={6}
            pattern="\d{6}"
            placeholder="Enter 6-digit OTP"
          />
        </div>
        <div className="mb-4 text-center">
          <p
            onClick={handleResendOtp}
            disabled={timer > 0}
            className={`${
              timer > 0 ? "" : "cursor-pointer"
            } text-left text-lighter font-medium disabled:opacity-50 disabled:no-underline`}
          >
            Resend OTP {timer > 0 && `in ${timer}s`}
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-lighter hover:bg-opacity-90 text-lightest font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-lightest mr-2"></div>
              <span>Verifying...</span>
            </div>
          ) : (
            "Verify OTP"
          )}
        </button>
      </form>

      <div className="mt-2">
        <p className="text-sm text-center">
          Want to change your Email?{" "}
          <span
            className="text-base text-lighter hover:underline font-medium cursor-pointer"
            onClick={() => setIsVerifyOtp(false)}
          >
            Change Email
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
