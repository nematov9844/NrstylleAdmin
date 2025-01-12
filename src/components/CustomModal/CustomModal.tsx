import React, { useContext } from 'react';
import { Modal, Form, FormInstance } from 'antd';
import { ThemeContext } from '../../context/ThemeContext';

interface CustomModalProps {
  title: string;
  visible: boolean;
  onCancel: () => void;
  form: FormInstance;
  children: React.ReactNode;
  onFinish: (values: any) => Promise<void>;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  title,
  visible,
  onCancel,
  form,
  children,
  onFinish
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <Modal
      title={
        <span style={{ 
          color: isDarkMode ? 'rgba(255, 255, 255, 0.88)' : 'rgba(0, 0, 0, 0.88)',
          fontSize: '16px',
          fontWeight: 500
        }}>
          {title}
        </span>
      }
      open={visible}
      onOk={() => form.validateFields().then(onFinish)}
      onCancel={onCancel}
      okText="Saqlash"
      cancelText="Bekor qilish"
      destroyOnClose={true}
      styles={{
        body: {
          backgroundColor: isDarkMode ? '#1f1f2e' : '#ffffff',
          padding: '24px',
        }
      }}
      modalRender={modal => (
        <div style={{
          backgroundColor: isDarkMode ? '#1f1f2e' : '#ffffff',
          borderRadius: '8px',
          border: `1px solid ${isDarkMode ? '#3a3a4d' : '#d9e6ff'}`,
        }}>
          {modal}
        </div>
      )}
      okButtonProps={{
        style: {
          background: isDarkMode 
            ? 'linear-gradient(90deg, #177ddc 0%, #40a9ff 100%)'
            : 'linear-gradient(90deg, #1677ff 0%, #4096ff 100%)',
        }
      }}
      cancelButtonProps={{
        style: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
          borderColor: isDarkMode ? '#3a3a4d' : '#d9e6ff',
        }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        style={{
          color: isDarkMode ? 'rgba(255, 255, 255, 0.88)' : 'rgba(0, 0, 0, 0.88)',
        }}
      >
        {children}
      </Form>
    </Modal>
  );
}; 