// Header Component

// Sidebar Component

// Main Layout Component
import React, { useContext } from "react";
import { Layout } from "antd";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import AppHeader from "../components/Header/Header";
import { ThemeContext } from "../context/ThemeContext";
import { useWindowSize } from '../hooks/useWindowSize';
import SidebarWrapper from "../components/SideBarWrapper/SideBarWrapper";

const { Content } = Layout;

export default function AdminLayout() {
  const { isDarkMode } = useContext(ThemeContext);
  const [collapsed, setCollapsed] = React.useState(false);
  const { width } = useWindowSize();
  const isMobile = width < 768;

  if (!Cookies.get("accessToken")) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <Layout style={{ minHeight: "100vh", background: isDarkMode ? '#181824' : '#f0f5ff' }}>
      <SidebarWrapper collapsed={isMobile ? true : collapsed} />
      <Layout style={{ 
        marginLeft: isMobile ? 0 : (collapsed ? 80 : 200),
        background: isDarkMode ? '#181824' : '#f0f5ff',
        transition: 'margin-left 0.6s ease-in-out'
      }}>
        <AppHeader toggleSidebar={() => !isMobile && setCollapsed(!collapsed)} />
        <Content
          style={{
            margin: isMobile ? "16px 8px" : "24px 16px",
            padding: isMobile ? 16 : 24,
            backgroundColor: isDarkMode ? '#1f1f2e' : '#ffffff',
            minHeight: 280,
            boxShadow: `0 1px 3px ${isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
            borderRadius: isMobile ? 8 : 4
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
