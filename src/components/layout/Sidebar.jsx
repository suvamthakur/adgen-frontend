import { NavLink } from "react-router-dom";
import { FaHome, FaVideo, FaHistory } from "react-icons/fa";

const Sidebar = ({ isOpen }) => {
  console.log("isOpen: ", isOpen);
  const navItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <FaHome />,
    },
    {
      path: "/generate-ads",
      name: "Generate Ads",
      icon: <FaVideo />,
    },
    {
      path: "/previous-orders",
      name: "Previous Orders",
      icon: <FaHistory />,
    },
  ];

  return (
    <aside
      className={`my-8 rounded-lg transform bg-darker min-h-screen transition-all duration-300 ${
        isOpen ? "w-64 " : "w-max "
      } md:translate-x-0 fixed md:relative z-10`}
    >
      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="px-4 py-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-lighter text-lightest"
                      : "text-lightest hover:bg-lighter"
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>
                {isOpen && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
