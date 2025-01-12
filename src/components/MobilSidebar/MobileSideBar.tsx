import { useContext, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from '../../context/ThemeContext';
import { 
  HomeOutlined, 
  UserOutlined, 
  TeamOutlined,
  FileOutlined,
  LockOutlined,
  SettingOutlined
} from "@ant-design/icons";

export default function MobileSidebar() {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();
  const { isDarkMode } = useContext(ThemeContext);

  const menuItems = useMemo(() => [
    { key: "umumiy", icon: <HomeOutlined />, path: "/app/umumiy" },
    { key: "bloklangan", icon: <LockOutlined />, path: "/app/bloklangan" },
    { key: "managerlar", icon: <TeamOutlined />, path: "/app/managerlar" },
    { key: "hodimlar", icon: <UserOutlined />, path: "/app/employee" },
    { key: "vazifalar", icon: <FileOutlined />, path: "/app/vazifalar" },
    { key: "sozlamalar", icon: <SettingOutlined />, path: "/app/sozlamalar" },
  ], []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: isDarkMode ? "#1f1f2e" : "#ffffff",
        borderTop: `1px solid ${isDarkMode ? "#3a3a4d" : "#d9e6ff"}`,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          backgroundColor: isDarkMode ? "#1f1f2e" : "#ffffff",
          padding: "10px 0",
        }}
      >
        {menuItems.map(({ key, icon, path }) => (
          <Link
            key={key}
            to={path}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: currentPath === key ? "#1890ff" : isDarkMode ? "#ffffff" : "#000000",
              textDecoration: "none",
              fontSize: "20px",
            }}
          >
            {icon}
          </Link>
        ))}
      </div>
    </div>
  );
}
