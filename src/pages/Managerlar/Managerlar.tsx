import { useState, useEffect, useContext } from 'react';
import { Table, Button, Form, Input, message, Space, Card, Spin} from 'antd';
import { useAxios } from "../../hooks/useAxios";
import { PlusOutlined, LockOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { CustomModal } from '../../components/CustomModal/CustomModal';
import { ThemeContext } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from '../../hooks/useWindowSize';

interface ManagerType {
  id: number;
  name: string;
  last_name: string;
  email: string;
  type: 'manager';
  isActive: boolean;
  tasks?: Array<{
    id: number;
    name: string;
    type: string;
  }>;
}

export default function Managerlar() {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const [managers, setManagers] = useState<ManagerType[]>([]);
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedManager, setSelectedManager] = useState<ManagerType | null>(null);
  const [currentPage] = useState(1);
  const [pageSize] = useState(10);
  const [form] = Form.useForm();
  const axios = useAxios();
 const {width} = useWindowSize();
  const isMobile = width < 768;

  const fetchManagers = async (page = currentPage, limit = pageSize, searchQuery = '') => {
    try {
      setLoading(true);
      let url = `/managers?_page=${page}&_limit=${limit}`;
      if (searchQuery) {
        url += `&name_like=${searchQuery}`;
      }
      const response = await axios({ url, method: "GET" });
      if (Array.isArray(response)) {
        setManagers(response);
      }
    } catch (error) {
      message.error("Managerlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, [currentPage, pageSize]);

  const handleAdd = async (values: any) => {
    try {
      await axios({
        url: "/managers",
        method: "POST",
        body: {
          ...values,
          type: 'manager',
          isActive: true,
          tasks: []
        }
      });
      message.success("Manager qo'shildi");
      setAddModalVisible(false);
      form.resetFields();
      fetchManagers();
    } catch (error) {
      message.error("Xatolik yuz berdi");
    }
  };

  const handleEdit = async (values: any) => {
    try {
      const updateData = {
        name: values.name,
        last_name: values.last_name,
        email: values.email
      };

      await axios({
        url: `/managers/${selectedManager?.id}`,
        method: "PATCH",
        body: updateData
      });
      
      message.success("Manager ma'lumotlari yangilandi");
      setEditModalVisible(false);
      form.resetFields();
      fetchManagers();
    } catch (error) {
      message.error("Xatolik yuz berdi");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios({
        url: `/managers/${id}`,
        method: "DELETE"
      });
      message.success("Manager o'chirildi");
      fetchManagers();
    } catch (error) {
      message.error("O'chirishda xatolik yuz berdi");
    }
  };

  const handleSearch = (value: string) => {
    fetchManagers(1, pageSize, value);
  };

  const handleEditModalOpen = (record: ManagerType) => {
    setSelectedManager(record);
    form.resetFields();
    form.setFieldsValue({
      name: record.name,
      last_name: record.last_name,
      email: record.email
    });
    setEditModalVisible(true);
  };

  const handleBlock = async (record: ManagerType) => {
    try {
      await axios({
        url: `/managers/${record.id}`,
        method: "PATCH",
        body: { isActive: false }
      });
      message.success("Manager bloklandi");
      fetchManagers();
    } catch (error) {
      message.error("Xatolik yuz berdi");
    }
  };

  const columns = [
    {
      title: 'F.I.O',
      key: 'fullName',
      render: (_: any, record: ManagerType) => (
        <Button
          type="link"
          onClick={() => navigate(`/app/user-details/manager/${record.id}`)}
          style={{ 
            padding: 0, 
            height: 'auto', 
            fontWeight: 500,
            cursor: 'pointer' 
          }}
        >
          {record.name} {record.last_name}
        </Button>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Vazifalar soni',
      dataIndex: 'tasks',
      render: (tasks: any[]) => tasks?.length || 0
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      render: (isActive: boolean) => (
        <span style={{ 
          color: isActive ? '#52c41a' : '#ff4d4f',
          padding: '4px 8px',
          borderRadius: '4px',
          border: `1px solid ${isActive ? '#52c41a' : '#ff4d4f'}`,
          fontSize: '12px'
        }}>
          {isActive ? 'Faol' : 'Nofaol'}
        </span>
      )
    },
    {
      title: 'Amallar',
      key: 'action',
      render: (_: any, record: ManagerType) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            className="btn-edit"
            onClick={() => handleEditModalOpen(record)}
          >
            O'zgartirish
          </Button>
          <Button 
            type="primary"
            icon={<DeleteOutlined />}
            className="btn-delete"
            onClick={() => handleDelete(record.id)}
          >
            O'chirish
          </Button>
          {record.isActive && (
            <Button
              type="primary"
              icon={<LockOutlined />}
              className="btn-block"
              onClick={() => handleBlock(record)}
            >
              Bloklash
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const modalContent = (
    <>
      <Form.Item
        name="name"
        label="Ism"
        rules={[{ required: true, message: 'Ismni kiriting' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="last_name"
        label="Familiya"
        rules={[{ required: true, message: 'Familiyani kiriting' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Emailni kiriting' },
          { type: 'email', message: 'Noto\'g\'ri email format' }
        ]}
      >
        <Input />
      </Form.Item>
    </>
  );

  // Mobile card component
  const MobileCard = ({ manager }: { manager: ManagerType }) => (
    <Card 
      style={{ 
        marginBottom: 16,
        backgroundColor: isDarkMode ? '#1f1f2e' : '#ffffff',
        borderColor: isDarkMode ? '#3a3a4d' : '#d9e6ff'
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Space>
          <UserOutlined style={{ fontSize: '24px' }} />
          <div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 'bold',
              color: isDarkMode ? '#ffffff' : '#000000'
            }}>
              {manager.name} {manager.last_name}
            </div>
            <div style={{ 
              fontSize: '14px',
              color: isDarkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.45)'
            }}>
              {manager.email}
            </div>
          </div>
        </Space>

        <Space wrap style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedManager(manager);
              form.setFieldsValue(manager);
              setEditModalVisible(true);
            }}
            style={{ marginRight: 8 }}
          >
            Tahrirlash
          </Button>
          <Button
            type="primary"
            danger
            icon={<LockOutlined />}
            onClick={() => handleBlock(manager)}
          >
            Bloklash
          </Button>
        </Space>
      </Space>
    </Card>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Card
        style={{
          backgroundColor: isDarkMode ? '#1f1f2e' : '#ffffff',
          borderColor: isDarkMode ? '#3a3a4d' : '#d9e6ff'
        }}
      >
        <div style={{ 
          marginBottom: 16, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: width < 576 ? 'column' : 'row',
          gap: width < 576 ? '12px' : '0'
        }}>
          <Input.Search
            placeholder="Ism bo'yicha qidirish..."
            style={{ 
              width: width < 576 ? '100%' : 300,
              backgroundColor: isDarkMode ? '#2a2a3b' : '#ffffff',
              borderColor: isDarkMode ? '#3a3a4d' : '#d9e6ff',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.88)' : 'rgba(0, 0, 0, 0.88)',
            }}
            onSearch={handleSearch}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="btn-add"
            onClick={() => setAddModalVisible(true)}
            style={{
              width: width < 576 ? '100%' : 'auto',
              background: isDarkMode 
                ? 'linear-gradient(90deg, #177ddc 0%, #40a9ff 100%)'
                : 'linear-gradient(90deg, #1677ff 0%, #4096ff 100%)',
            }}
          >
            Manager qo'shish
          </Button>
        </div>

        {isMobile ? (
          // Mobile view
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin size="large" tip="Yuklanmoqda..." />

              </div>
            ) : (
              managers.map(manager => (
                <MobileCard key={manager.id} manager={manager} />
              ))
            )}
          </div>
        ) : (
          // Desktop view
          <Table
            loading={loading}
            columns={columns}
            dataSource={managers}
            rowKey="id"
            className={isDarkMode ? 'dark-table' : 'light-table'}
            style={{
              backgroundColor: isDarkMode ? '#1f1f2e' : '#ffffff'
            }}
          />
        )}
      </Card>

      {/* Add Modal */}
      <CustomModal
        title="Yangi manager qo'shish"
        visible={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false);
          form.resetFields();
        }}
        form={form}
        onFinish={handleAdd}
      >
        {modalContent}
      </CustomModal>

      {/* Edit Modal */}
      <CustomModal
        title="Manager ma'lumotlarini tahrirlash"
        visible={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
          setSelectedManager(null);
        }}
        form={form}
        onFinish={handleEdit}
      >
        {modalContent}
      </CustomModal>
    </div>
  );
} 