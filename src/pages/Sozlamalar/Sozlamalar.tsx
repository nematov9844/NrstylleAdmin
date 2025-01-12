import { useState } from 'react';
import { Card, Form, Input, Button, Switch, Select, message, Divider } from 'antd';
import { useAxios } from "../../hooks/useAxios";

export default function Sozlamalar() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const axios = useAxios();

  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      await axios({
        url: "/settings",
        method: "PUT",
        body: values
      });
      message.success("Sozlamalar saqlandi");
    } catch (error) {
      message.error("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Tizim sozlamalari">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            notifications: true,
            language: 'uz',
            theme: 'light'
          }}
        >
          <Form.Item
            name="companyName"
            label="Kompaniya nomi"
            rules={[{ required: true, message: 'Kompaniya nomini kiriting' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Asosiy email"
            rules={[
              { required: true, message: 'Emailni kiriting' },
              { type: 'email', message: 'Noto\'g\'ri email format' }
            ]}
          >
            <Input />
          </Form.Item>

          <Divider />

          <Form.Item
            name="notifications"
            label="Bildirishnomalar"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item name="language" label="Til">
            <Select>
              <Select.Option value="uz">O'zbek</Select.Option>
              <Select.Option value="ru">Русский</Select.Option>
              <Select.Option value="en">English</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="theme" label="Mavzu">
            <Select>
              <Select.Option value="light">Yorqin</Select.Option>
              <Select.Option value="dark">Qorong'i</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ backgroundColor: '#0eb182' }}
            >
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 