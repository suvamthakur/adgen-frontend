import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen text-lightest overflow-hidden">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex h-full pb-8">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 mb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
