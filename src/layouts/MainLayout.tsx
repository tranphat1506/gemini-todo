import { useEffect, useRef, useState } from "react";
import BottomNavBar from "@/sections/BottomNavBar";
import Footer from "@/sections/Footer";
import Header, { type HeaderProps } from "@/sections/Header";
import { Outlet } from "react-router";
import SideBar from "@/sections/SideBar";
import RightSideBar from "@/sections/RightSideBar";
import { useAppSelector } from "@/hooks/storeHooks";

interface LayoutProps {
  children?: React.ReactNode;
  headerProps?: HeaderProps;
}

const MainLayout: React.FC<LayoutProps> = ({ children, headerProps }) => {
  const bottomNavRef = useRef<HTMLDivElement | null>(null);
  const [bottomNavHeight, setBottomNavHeight] = useState(0);
  const { isOpen: isRightSidebarOpen } = useAppSelector(
    (state) => state.rightSidebar
  );

  useEffect(() => {
    if (bottomNavRef.current) {
      setBottomNavHeight(bottomNavRef.current.offsetHeight);
    }
  }, []);

  return (
    <div className="grid grid-cols-[auto_1fr_auto] min-h-screen">
      {/* Left Sidebar */}
      <SideBar className="hidden sm:block" />

      {/* Main Content */}
      <div className="sm:w-auto w-screen flex flex-col">
        <Header className="sm:hidden" {...headerProps} />
        <div
          className="w-full overflow-auto sm:rounded-2xl max-sm:bg-black"
          style={{ marginBottom: bottomNavHeight }}
        >
          {children}
          <Outlet />
        </div>
        <BottomNavBar
          ref={bottomNavRef}
          className="sm:hidden fixed bottom-0 left-0 w-full z-50"
        />
        <Footer />
      </div>

      {/* Right Sidebar - Desktop */}
      <div
        className={`hidden md:block ${
          isRightSidebarOpen ? "w-80 lg:w-96" : "w-0"
        } transition-all duration-300`}
      >
        <RightSideBar />
      </div>

      {/* Right Sidebar - Mobile Full Screen */}
      {isRightSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black">
          <RightSideBar className="w-full h-full m-0 rounded-none" />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
