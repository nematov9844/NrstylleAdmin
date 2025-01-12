import { useContext } from "react";
import { Layout, Button, Space, Avatar, Dropdown } from "antd";
import { 
  LogoutOutlined, 
  UserOutlined, 
  SunOutlined, 
  MoonOutlined,
  BellOutlined,
  MenuFoldOutlined
} from "@ant-design/icons";
import { ThemeContext } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useWindowSize } from "../../hooks/useWindowSize";

const { Header: AntHeader } = Layout;

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function AppHeader({ toggleSidebar }: HeaderProps) {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const handleLogout = () => {
    Cookies.remove('accessToken');
    navigate('/', { replace: true });
  };

  const items = [
    {
      key: "1",
      label: "Profil",
      icon: <UserOutlined />,
      onClick: () => navigate('/app/profile')
    },
    {
      key: "2",
      label: "Chiqish",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout
    },
  ];

  return (
    <AntHeader
      style={{
        padding: isMobile ? '0 16px' : '0 24px',
        background: isDarkMode ? '#1f1f2e' : '#ffffff',
        borderBottom: `1px solid ${isDarkMode ? '#3a3a4d' : '#d9e6ff'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%',
        height: isMobile ? '56px' : '64px',
        transition: 'all 0.3s ease'
      }}
    >
      {!isMobile && (
        <Button 
          type="text"
          icon={<MenuFoldOutlined />}
          onClick={toggleSidebar}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
            color: isDarkMode ? '#ffffff' : '#000000'
          }}
        />
      )}

      <Space 
        size={isMobile ? 8 : 16} 
        style={{
          marginLeft: isMobile ? 0 : 'auto',
          marginRight: isMobile ? 0 : '24px'
        }}
      >
        <Button
          type="text"
          icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{ 
            color: isDarkMode ? '#ffffff' : '#000000',
            width: isMobile ? 32 : 40,
            height: isMobile ? 32 : 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        />
        
        <Button
          type="text"
          icon={<BellOutlined />}
          style={{ 
            color: isDarkMode ? '#ffffff' : '#000000',
            width: isMobile ? 32 : 40,
            height: isMobile ? 32 : 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        />

        <Dropdown menu={{ items }} placement="bottomRight" arrow>
          <Space 
            style={{ 
              cursor: "pointer",
              color: isDarkMode ? '#ffffff' : '#000000'
            }}
          >
            <Avatar 
              icon={<UserOutlined />} 
              size={isMobile ? 32 : 40}
              style={{
                backgroundColor: isDarkMode ? '#177ddc' : '#1677ff'
              }}
            />
            {!isMobile && <span>Admin</span>}
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}
