import { useState, useEffect, useContext } from 'react';
import { Table, Button, Form, Input, message, Space, Card, Row, Col, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAxios } from "../../hooks/useAxios";
import { PlusOutlined, LockOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { CustomModal } from '../../components/CustomModal/CustomModal';
import { ThemeContext } from '../../context/ThemeContext';
import { useWindowSize } from '../../hooks/useWindowSize';

interface EmployeeType {
  id: number;
  name: string;
  last_name: string;
  email: string;
  type: 'manager' | 'employee';
  isActive: boolean;
}

export default function Employee() {
  const { isDarkMode } = useContext(ThemeContext);
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage] = useState(1);
  const [pageSize] = useState(10);
  const [form] = Form.useForm();
  const axios = useAxios();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(null);
  const navigate = useNavigate();
  const {width} = useWindowSize();
  const isMobile = width < 768;

  const fetchEmployees = async (page = currentPage, limit = pageSize, searchQuery = '') => {
    try {
      setLoading(true);
      let url = `/employees?_page=${page}&_limit=${limit}`;
      if (searchQuery) {
        url += `&name_like=${searchQuery}`;
      }
      const response = await axios({ url, method: "GET" });
      setEmployees(response);
      console.log(response);
    } catch (error) {
      message.error("Xodimlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, pageSize]);

  const handleAdd = async (values: any) => {
    try {
      await axios({
        url: "/employees",
        method: "POST",
        body: {
          ...values,
          type: 'employee',
          isActive: true
        }
      });
      message.success("Xodim qo'shildi");
      setAddModalVisible(false);
      form.resetFields();
      fetchEmployees();
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
        url: `/employees/${selectedEmployee?.id}`,
        method: "PATCH",
        body: updateData
      });
      
      message.success("Xodim ma'lumotlari yangilandi");
      setEditModalVisible(false);
      form.resetFields();
      fetchEmployees();
    } catch (error) {
      message.error("Xatolik yuz berdi");
    }
  };

  const handleEditModalOpen = (record: EmployeeType) => {
    setSelectedEmployee(record);
    form.resetFields();
    form.setFieldsValue({
      name: record.name,
      last_name: record.last_name,
      email: record.email
    });
    setEditModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios({
        url: `/employees/${id}`,
        method: "DELETE"
      });
      message.success("Xodim o'chirildi");
      fetchEmployees();
    } catch (error) {
      message.error("O'chirishda xatolik yuz berdi");
    }
  };

  const handleSearch = (value: string) => {
    fetchEmployees(1, pageSize, value);
  };

  const handleBlock = async (record: EmployeeType) => {
    try {
      await axios({
        url: `/employees/${record.id}`,
        method: "PATCH",
        body: { isActive: false }
      });
      message.success("Xodim bloklandi");
      fetchEmployees();
    } catch (error) {
      message.error("Xatolik yuz berdi");
    }
  };

  const columns = [
    {
      title: 'F.I.O',
      key: 'fullName',
      render: (_: any, record: EmployeeType) => (
        <Button
          type="link"
          onClick={() => navigate(`/app/user-details/employee/${record.id}`)}
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
      render: (_: any, record: EmployeeType) => (
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

  // Mobile card component
  const MobileCard = ({ employee }: { employee: EmployeeType }) => (
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
              {employee.name} {employee.last_name}
            </div>
            <div style={{ 
              fontSize: '14px',
              color: isDarkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.45)'
            }}>
              {employee.email}
            </div>
          </div>
        </Space>

        <Row gutter={[8, 8]}>
          <Col span={12}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEditModalOpen(employee)}
              style={{ width: '100%' }}
            >
              O'zgartirish
            </Button>
          </Col>
          <Col span={12}>
            <Button 
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(employee.id)}
              style={{ width: '100%' }}
            >
              O'chirish
            </Button>
          </Col>
          {employee.isActive && (
            <Col span={24}>
              <Button
                type="primary"
                icon={<LockOutlined />}
                onClick={() => handleBlock(employee)}
                style={{ width: '100%' }}
                className="btn-block"
              >
                Bloklash
              </Button>
            </Col>
          )}
        </Row>
      </Space>
    </Card>
  );

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        style={{ 
          backgroundColor: isDarkMode ? '#1f1f2e' : '#ffffff',
          border: `1px solid ${isDarkMode ? '#3a3a4d' : '#d9e6ff'}`,
          borderRadius: '8px',
          boxShadow: `0 2px 8px ${isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
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
            Xodim qo'shish
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
              employees.map(employee => (
                <MobileCard key={employee.id} employee={employee} />
              ))
            )}
          </div>
        ) : (
          // Desktop view
          <Table
            loading={loading}
            columns={columns}
            dataSource={employees}
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
        title="Yangi xodim qo'shish"
        visible={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false);
          form.resetFields();
        }}
        form={form}
        onFinish={handleAdd}
      >
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
      </CustomModal>

      {/* Edit Modal */}
      <CustomModal
        title="Xodim ma'lumotlarini tahrirlash"
        visible={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
          setSelectedEmployee(null);
        }}
        form={form}
        onFinish={handleEdit}
      >
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
      </CustomModal>
    </div>
  );
}
