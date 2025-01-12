import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Form, Input, message, Select, Space, Popconfirm, Tag } from 'antd';
import { useAxios } from "../../hooks/useAxios";
import { UserOutlined, TeamOutlined, CheckCircleOutlined, ClockCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { CustomModal } from '../../components/CustomModal/CustomModal';
import { ThemeContext } from '../../context/ThemeContext';
import { useWindowSize } from '../../hooks/useWindowSize';

interface StatisticsType {
  totalEmployees: number;
  activeEmployees: number;
  pendingEmployees: number;
  blockedEmployees: number;
}

interface WorkType {
  id: number;
  name: string;
  description: string;
  deadline: string;
  status: 'completed' | 'in_progress' | 'pending';
}

export default function Umumiy() {
  const { isDarkMode } = useContext(ThemeContext);
  const [statistics, setStatistics] = useState<StatisticsType>({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingEmployees: 0,
    blockedEmployees: 0
  });
  const [works, setWorks] = useState<WorkType[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const axios = useAxios();
  const navigate = useNavigate();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedWork, setSelectedWork] = useState<WorkType | null>(null);
  const {width} = useWindowSize();
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const [managers, employees] = await Promise.all([
        axios({ url: "/managers", method: "GET" }),
        axios({ url: "/employees", method: "GET" })
      ]);

      const allUsers = [...(Array.isArray(managers) ? managers : []), ...(Array.isArray(employees) ? employees : [])];
      
      setStatistics({
        totalEmployees: allUsers.length,
        activeEmployees: allUsers.filter(user => user.isActive).length,
        pendingEmployees: allUsers.filter(user => !user.isActive).length,
        blockedEmployees: allUsers.filter(user => user.isActive === false).length
      });
    } catch (error) {
      console.error("Statistikani yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorks = async () => {
    try {
      const response = await axios({ url: "/tasks", method: "GET" });
      if (Array.isArray(response)) {
        setWorks(response);
      }
    } catch (error) {
      message.error("Ishlarni yuklashda xatolik");
    }
  };

  useEffect(() => {
    fetchStatistics();
    fetchWorks();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios({
        url: `/tasks/${id}`,
        method: "DELETE"
      });
      message.success("Ish o'chirildi");
      fetchWorks();
    } catch (error) {
      message.error("O'chirishda xatolik yuz berdi");
    }
  };

  const handleAdd = async (values: any) => {
    try {
      await axios({
        url: "/tasks",
        method: "POST",
        body: {
          ...values,
          status: 'pending'
        }
      });
      message.success("Ish qo'shildi");
      setAddModalVisible(false);
      form.resetFields();
      fetchWorks();
    } catch (error) {
      message.error("Xatolik yuz berdi");
    }
  };

  const handleEdit = async (values: any) => {
    try {
      const updateData = {
        name: values.name,
        description: values.description,
        deadline: values.deadline,
        status: values.status
      };

      await axios({
        url: `/tasks/${selectedWork?.id}`,
        method: "PATCH",
        body: updateData
      });
      
      message.success("Ish ma'lumotlari yangilandi");
      setEditModalVisible(false);
      form.resetFields();
      fetchWorks();
    } catch (error) {
      message.error("Xatolik yuz berdi");
    }
  };

  const handleEditModalOpen = (record: WorkType) => {
    setSelectedWork(record);
    form.resetFields();
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      deadline: record.deadline,
      status: record.status
    });
    setEditModalVisible(true);
  };

  const columns = [
    {
      title: 'Ish nomi',
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
          completed: '#52c41a',
          in_progress: '#1890ff',
          pending: '#faad14'
        };
        return (
          <span style={{ 
            color: colors[status],
            padding: '4px 8px',
            borderRadius: '4px',
            border: `1px solid ${colors[status]}`,
            fontSize: '12px'
          }}>
            {status === 'completed' ? 'Bajarildi' :
             status === 'in_progress' ? 'Jarayonda' :
             'Kutilmoqda'}
          </span>
        );
      }
    },
    {
      title: 'Amallar',
      key: 'action',
      render: (_: any, record: WorkType) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            className="btn-edit"
            onClick={() => handleEditModalOpen(record)}
          >
            O'zgartirish
          </Button>
          <Popconfirm
            title="Ishni o'chirmoqchimisiz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button 
              type="primary" 
              danger
              icon={<DeleteOutlined />}
              className="btn-delete"
            >
              O'chirish
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const cards = [
    {
      title: "Jami xodimlar",
      value: statistics.totalEmployees,
      icon: <TeamOutlined />,
      color: isDarkMode ? '#40a9ff' : '#1677ff',
      path: '/app/employee'
    },
    {
      title: "Faol xodimlar",
      value: statistics.activeEmployees,
      icon: <UserOutlined />,
      color: isDarkMode ? '#52c41a' : '#52c41a',
      path: '/app/managerlar'
    },
    {
      title: "Kutilayotgan",
      value: statistics.pendingEmployees,
      icon: <ClockCircleOutlined />,
      color: isDarkMode ? '#faad14' : '#faad14',
      path: '/app/vazifalar'
    },
    {
      title: "Bloklangan",
      value: statistics.blockedEmployees,
      icon: <CheckCircleOutlined />,
      color: isDarkMode ? '#ff4d4f' : '#ff4d4f',
      path: '/app/bloklangan'
    }
  ];

  const modalContent = (
    <>
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>
      <Form.Item
        name="name"
        label="Ish nomi"
        rules={[{ required: true, message: 'Ish nomini kiriting' }]}
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
        name="status"
        label="Status"
        rules={[{ required: true, message: 'Statusni tanlang' }]}
      >
        <Select>
          <Select.Option value="completed">Bajarildi</Select.Option>
          <Select.Option value="in_progress">Jarayonda</Select.Option>
          <Select.Option value="pending">Kutilmoqda</Select.Option>
        </Select>
      </Form.Item>
    </>
  );

  return (
    <div style={{ padding: '24px'}}>
      <Row gutter={16}>
        {cards.map((card, index) => (
          <Col  span={width < 356 ? 24: width < 768 ? 12 : width < 1024 ? 12 : 6} key={index}>
            <Card
              hoverable
              onClick={() => navigate(card.path)}
              style={{
                cursor: 'pointer',
                backgroundColor: isDarkMode ? '#1f1f2e' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#3a3a4d' : '#d9e6ff'}`,
                borderRadius: '8px',
                marginBottom: "20px",
                boxShadow: `0 2px 8px ${isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
              }}
            >
              <Statistic
                title={
                  <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.88)' : 'rgba(0, 0, 0, 0.88)' }}>
                    {card.title}
                  </span>
                }
                value={card.value}
                prefix={React.cloneElement(card.icon, { style: { color: card.color } })}
                valueStyle={{ color: card.color }}
                loading={loading}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card 
        style={{ 
          marginTop: 24,
          backgroundColor: isDarkMode ? '#1f1f2e' : '#ffffff',
          border: `1px solid ${isDarkMode ? '#3a3a4d' : '#d9e6ff'}`,
          borderRadius: '8px',
          boxShadow: `0 2px 8px ${isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
        }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 16, 
          flexDirection: width < 340 ? "column" : "row"
        }}>
          <h2 style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.88)' : 'rgba(0, 0, 0, 0.88)' }}>
            Joriy ishlar
          </h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="btn-add"
            onClick={() => setAddModalVisible(true)}
            style={{
              background: isDarkMode 
                ? 'linear-gradient(90deg, #177ddc 0%, #40a9ff 100%)'
                : 'linear-gradient(90deg, #1677ff 0%, #4096ff 100%)',
            }}
          >
            Yangi ish
          </Button>
        </div>

        {width >= 768 ? (
          // Desktop view
          <Table
            columns={columns}
            dataSource={works}
            rowKey="id"
            className={isDarkMode ? 'dark-table' : 'light-table'}
          />
        ) : (
          // Mobile view
          <div style={{ padding: '0 8px' }}>
            {works.map(work => (
              <Card 
                key={work.id}
                style={{ 
                  marginBottom: 16,
                  backgroundColor: isDarkMode ? '#1f1f2e' : '#ffffff',
                  borderColor: isDarkMode ? '#3a3a4d' : '#d9e6ff'
                }}
              >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <div>
                    <h4 style={{ 
                      margin: "10px 0",
                      color: isDarkMode ? '#ffffff' : '#000000'
                    }}>
                      {work.name}
                    </h4>
                    <p style={{ 
                      margin: '8px 0',
                      color: isDarkMode ? '#rgba(255,255,255,0.65)' : '#666'
                    }}>
                      {work.description}
                    </p>
                  </div>
                  
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Tag style={{fontSize:"12px",margin:"10px 0"}} color={
                        work.status === 'completed' ? 'success' :
                        work.status === 'in_progress' ? 'processing' : 
                        'warning'
                      }>
                        {work.status === 'completed' ? 'Bajarildi' :
                         work.status === 'in_progress' ? 'Jarayonda' :
                         'Kutilmoqda'}
                      </Tag>
                    </Col>
                    <Col>
                      <Space>
                        <Button
                          type="primary"
                          icon={<EditOutlined />}
                          onClick={() => {
                            setSelectedWork(work);
                            setEditModalVisible(true);
                          }}
                        />
                        <Popconfirm
                          title="Ishni o'chirmoqchimisiz?"
                          onConfirm={() => handleDelete(work.id)}
                          okText="Ha"
                          cancelText="Yo'q"
                        >
                          <Button 
                            danger 
                            icon={<DeleteOutlined />}
                          />
                        </Popconfirm>
                      </Space>
                    </Col>
                  </Row>
                </Space>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <CustomModal
        title="Yangi ish qo'shish"
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

      <CustomModal
        title="Ishni tahrirlash"
        visible={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
          setSelectedWork(null);
        }}
        form={form}
        onFinish={handleEdit}
      >
        {modalContent}
      </CustomModal>
    </div>
  );
} 