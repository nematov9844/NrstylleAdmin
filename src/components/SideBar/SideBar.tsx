import { useContext } from "react";
import { Layout, Menu } from "antd";
import { 
  HomeOutlined, 
  UserOutlined, 
  TeamOutlined,
  FileOutlined,
  LockOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from '../../context/ThemeContext';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

export default function AppSidebar({ collapsed }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();
  const { isDarkMode } = useContext(ThemeContext);

  const menuItems = [
    { 
      key: "umumiy", 
      icon: <HomeOutlined />, 
      label: "Umumiy", 
      path: "/app/umumiy" 
    },
    { 
      key: "bloklangan", 
      icon: <LockOutlined />, 
      label: "Bloklangan", 
      path: "/app/bloklangan" 
    },
    { 
      key: "managerlar", 
      icon: <TeamOutlined />, 
      label: "Managerlar", 
      path: "/app/managerlar" 
    },
    { 
      key: "hodimlar", 
      icon: <UserOutlined />, 
      label: "Hodimlar", 
      path: "/app/employee" 
    },
    { 
      key: "vazifalar", 
      icon: <FileOutlined />, 
      label: "Vazifalar", 
      path: "/app/vazifalar" 
    },
    { 
      key: "sozlamalar", 
      icon: <SettingOutlined />, 
      label: "Sozlamalar", 
      path: "/app/sozlamalar" 
    }
  ];

  return (
    <Sider
      collapsed={collapsed}
      trigger={null}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: isDarkMode ? '#1f1f2e' : '#ffffff',
        borderRight: `1px solid ${isDarkMode ? '#3a3a4d' : '#d9e6ff'}`,
        transition: 'all 0.6s ease-in-out'
      }}
    >
      <div style={{
        height: 32,
        margin: 16,
        background: isDarkMode ? '#1f1f2e' : '#f0f5ff',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isDarkMode ? '#ffffff' : '#1677ff',
        fontWeight: 'bold'
      }}>
        {!collapsed ? 'NR_STYLE' : 'NR'}
      </div>
      
      <Menu
        theme={isDarkMode ? "dark" : "light"}
        mode="inline"
        selectedKeys={[currentPath || 'umumiy']}
        items={menuItems}
        onClick={({ key }) => {
          const item = menuItems.find(item => item.key === key);
          if (item) {
            navigate(item.path);
          }
        }}
        className={`custom-menu ${isDarkMode ? 'dark-menu' : 'light-menu'}`}
        style={{
          backgroundColor: isDarkMode ? '#181824' : '#f0f5ff',
          background: `${isDarkMode ? '#181824' : '#f0f5ff'} !important`
        }}
      />
    
    </Sider>
  );
}
