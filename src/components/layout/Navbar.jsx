import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaBars, FaUser } from "react-icons/fa";
import { useLogoutMutation } from "../../store/api/authApi";

const Navbar = ({ toggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-darker px-4 py-2 h-64 flex items-center justify-between shadow-md">
      <div className="h-full flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-lightest p-2 rounded-md hover:bg-lighter transition-colors"
        >
          <FaBars className="text-xl" />
        </button>
        <Link to="/" className="ml-4 text-xl font-bold text-lightest">
          AI Video Ads Generator
        </Link>
      </div>

      {user && (
        <div className="relative">
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 p-2 rounded-full hover:bg-lighter transition-colors cursor-pointer"
          >
            <div className="bg-lighter rounded-full p-2">
              <FaUser className="text-lightest text-2xl" />
            </div>
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-darker rounded-md shadow-lg py-1 z-10">
              <div className="px-4 py-2">
                <p className="text-lightest font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-lightest text-sm">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-lightest hover:bg-lighter transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
