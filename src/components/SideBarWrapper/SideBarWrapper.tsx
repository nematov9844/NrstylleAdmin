import { useEffect } from "react";
import { useState } from "react";
import MobileSidebar from "../MobilSidebar/MobileSideBar";
import AppSidebar from "../SideBar/SideBar";


export default function SidebarWrapper({ collapsed }: { collapsed: boolean }) {
    const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
      const updateSidebar = () => {
        setIsMobile(window.innerWidth <= 767);
      };
  
      // Initial check
      updateSidebar();
  
      // Resize listener
      window.addEventListener("resize", updateSidebar);
  
      return () => {
        window.removeEventListener("resize", updateSidebar);
      };
    }, []);
  
    return isMobile ? (
      <MobileSidebar />
    ) : (
      <AppSidebar collapsed={collapsed} />
    );
  }
