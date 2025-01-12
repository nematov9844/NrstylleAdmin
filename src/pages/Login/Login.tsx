import { Form, Input, Button, Card } from "antd";
import { useAuthApi } from "../../api/auth";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const authApi = useAuthApi();
  const navigate = useNavigate()
  const { isDarkMode } = useContext(ThemeContext);

  const onFinish = (values: LoginFormData) => {
    authApi.login(values).then((res) => {            
      Cookies.set("accessToken", res.token);
      navigate("/app/umumiy")
    }).catch((error) => {
      console.error("Login xatosi:", error);
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Form failed:", errorInfo);
  };

  return (
    <div style={{ 
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: isDarkMode ? '#181824' : '#f0f5ff',
    }}>
      <Card
        title={
          <div style={{ 
            color: isDarkMode ? 'rgba(255, 255, 255, 0.88)' : 'rgba(0, 0, 0, 0.88)',
            textAlign: 'center',
            fontSize: '20px'
          }}>
            Login
          </div>
        }
        style={{
          width: 400,
          borderRadius: "8px",
          boxShadow: `0 4px 12px ${isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
          backgroundColor: isDarkMode ? '#1f1f2e' : '#ffffff',
          border: `1px solid ${isDarkMode ? '#3a3a4d' : '#d9e6ff'}`,
        }}
      >
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            label={<span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.88)' : 'rgba(0, 0, 0, 0.88)' }}>Email</span>}
            name="email"
            rules={[
              { required: true, message: "Iltimos, emailni kiriting!" },
              { type: "email", message: "Noto'g'ri email format!" },
            ]}
          >
            <Input 
              placeholder="Emailni kiriting" 
              style={{
                backgroundColor: isDarkMode ? '#2a2a3b' : '#ffffff',
                borderColor: isDarkMode ? '#3a3a4d' : '#d9e6ff',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.88)' : 'rgba(0, 0, 0, 0.88)',
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.88)' : 'rgba(0, 0, 0, 0.88)' }}>Parol</span>}
            name="password"
            rules={[
              { required: true, message: "Iltimos, parolni kiriting!" },
            ]}
          >
            <Input.Password 
              placeholder="Parolni kiriting"
              style={{
                backgroundColor: isDarkMode ? '#2a2a3b' : '#ffffff',
                borderColor: isDarkMode ? '#3a3a4d' : '#d9e6ff',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.88)' : 'rgba(0, 0, 0, 0.88)',
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              style={{
                background: isDarkMode 
                  ? 'linear-gradient(90deg, #177ddc 0%, #40a9ff 100%)'
                  : 'linear-gradient(90deg, #1677ff 0%, #4096ff 100%)',
              }}
            >
              Kirish
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
