import { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Table, Tag, Form, Input, Select, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useAxios } from "../../hooks/useAxios";
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { CustomModal } from '../../components/CustomModal/CustomModal';

interface UserType {
  id: number;
  name: string;
  last_name: string;
  email: string;
  type: 'manager' | 'employee';
  isActive: boolean;
  tasks: TaskType[];
}

interface TaskType {
  id: number;
  name: string;
  type: string;
  description?: string;
  deadline?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export default function UserDetails() {
  const { id, type } = useParams(); // /user-details/:type/:id
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const axios = useAxios();
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const endpoint = type === 'manager' ? 'managers' : 'employees';
      const response = await axios({ 
        url: `/${endpoint}/${id}`, 
        method: "GET" 
      });
      setUser(response);
    } catch (error) {
      message.error("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id, type]);

  const handleAddTask = async (values: any) => {
    try {
        console.log(values);
        
      // Avval yangi vazifani tasks jadvaliga qo'shamiz
      const taskResponse = await axios({
        url: "/tasks",
        method: "POST",
        body: {
          ...values,
          type: type, // manager yoki employee
          status: 'pending'
        }
      });

      // So'ng foydalanuvchining tasks massivini yangilaymiz
      if (user && taskResponse) {
        const updatedTasks = [...(user.tasks || []), taskResponse];
        const endpoint = type === 'manager' ? 'managers' : 'employees';
        
        await axios({
          url: `/${endpoint}/${id}`,
          method: "PATCH",
          body: {
            tasks: updatedTasks
          }
        });

        message.success("Vazifa qo'shildi");
        fetchUserDetails();
      }
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Xatolik yuz berdi");
    }
  };

  const columns = [
    {
      title: 'Vazifa nomi',
      dataIndex: 'name',
    },
    {
      title: 'Tavsif',
      dataIndex: 'description',
    },
    {
      title: 'Muddat',
      dataIndex: 'deadline',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => {
        const colors: { [key: string]: string } = {
          pending: '#faad14',
          in_progress: '#1890ff',
          completed: '#52c41a'
        };
        return (
          <Tag color={colors[status]}>
            {status === 'pending' ? 'Kutilmoqda' :
             status === 'in_progress' ? 'Jarayonda' :
             'Bajarildi'}
          </Tag>
        );
      }
    },
    {
      title: 'Muhimlik',
      dataIndex: 'priority',
      render: (priority: string) => {
        const colors: { [key: string]: string } = {
          low: '#52c41a',
          medium: '#faad14',
          high: '#f5222d'
        };
        return (
          <Tag color={colors[priority]}>
            {priority === 'low' ? 'Past' :
             priority === 'medium' ? "O'rta" :
             'Yuqori'}
          </Tag>
        );
      }
    }
  ];

  const modalContent = (
    <>
      <Form.Item
        name="name"
        label="Vazifa nomi"
        rules={[{ required: true, message: 'Vazifa nomini kiriting' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Tavsif"
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="deadline"
        label="Muddat"
        rules={[{ required: true, message: 'Muddatni kiriting' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="priority"
        label="Muhimlik darajasi"
        rules={[{ required: true, message: 'Muhimlik darajasini tanlang' }]}
      >
        <Select>
          <Select.Option value="high">Yuqori</Select.Option>
          <Select.Option value="medium">O'rta</Select.Option>
          <Select.Option value="low">Past</Select.Option>
        </Select>
      </Form.Item>
    </>
  );

  if (!user) return null;

  return (
    <div style={{ padding: '24px' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Orqaga
      </Button>

      <Card loading={loading}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <h3>Shaxsiy ma'lumotlar</h3>
            <p><strong>F.I.O:</strong> {user.name} {user.last_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Turi:</strong> {user.type === 'manager' ? 'Manager' : 'Xodim'}</p>
            <p>
              <strong>Holati:</strong>{' '}
              <Tag color={user.isActive ? '#52c41a' : '#f5222d'}>
                {user.isActive ? 'Faol' : 'Bloklangan'}
              </Tag>
            </p>
          </Col>
          <Col span={16}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3>Vazifalar</h3>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
                style={{ backgroundColor: '#0eb182' }}
              >
                Yangi vazifa
              </Button>
            </div>
            <Table
              columns={columns}
              dataSource={user.tasks}
              rowKey="id"
              pagination={false}
            />
          </Col>
        </Row>
      </Card>

      <CustomModal
        title="Yangi vazifa"
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        form={form}
        onFinish={handleAddTask}
      >
        {modalContent}
      </CustomModal>
    </div>
  );
} 