import { useEffect, useRef, useState } from "react";
import BottomNavBar from "@/sections/BottomNavBar";
import Footer from "@/sections/Footer";
import Header, { type HeaderProps } from "@/sections/Header";
import { Outlet } from "react-router";
import SideBar from "@/sections/SideBar";

interface LayoutProps {
  children?: React.ReactNode;
  headerProps?: HeaderProps;
}

const MainLayout: React.FC<LayoutProps> = ({ children, headerProps }) => {
  const bottomNavRef = useRef<HTMLDivElement | null>(null);
  const [bottomNavHeight, setBottomNavHeight] = useState(0);

  useEffect(() => {
    if (bottomNavRef.current) {
      setBottomNavHeight(bottomNavRef.current.offsetHeight);
    }
  }, []);

  return (
    <div className="grid grid-cols-[auto_1fr] min-h-screen">
      <SideBar className="hidden sm:block" />
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
    </div>
  );
};

export default MainLayout;
