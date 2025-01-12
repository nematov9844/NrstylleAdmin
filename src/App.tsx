import { Route, Routes } from "react-router-dom";
import { mainRoutes } from "./routes/routes";
import Login from "./pages/Login/Login";
import AdminLayout from "./layout/main-layout";
import { ConfigProvider, theme } from 'antd';
import { useState, useEffect } from 'react';
import { ThemeContext } from "./context/ThemeContext";

function App() {
  // localStorage dan theme'ni o'qib olish
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : false;
  });

  // theme o'zgarganda localStorage ga saqlash
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: '#1677ff',
          },
        }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/app" element={<AdminLayout />}>
            {mainRoutes.map((route) => (
              <Route
                key={route.id}
                path={route.path}
                element={<route.component />}
              />
            ))}
          </Route>
        </Routes>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export default App;
