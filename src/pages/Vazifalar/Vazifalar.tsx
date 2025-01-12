import { useState, useEffect, useContext } from 'react';
import { Table, Button, Form, Input, Select, message, Space, Card, Tag, Spin } from 'antd';
import { useAxios } from "../../hooks/useAxios";
import { PlusOutlined, EditOutlined, DeleteOutlined, FileOutlined } from '@ant-design/icons';
import { CustomModal } from '../../components/CustomModal/CustomModal';
import { ThemeContext } from '../../context/ThemeContext';
import { useWindowSize } from '../../hooks/useWindowSize';

interface TaskType {
  id: number;
  name: string;
  type: 'manager' | 'employee';
  description?: string;
  deadline?: string;
  status?: 'pending' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
}

export default function Vazifalar() {
  const { isDarkMode } = useContext(ThemeContext);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [form] = Form.useForm();
  const axios = useAxios();
  const {width} = useWindowSize();
  const isMobile = width < 768;

  const fetchTasks = async (page = 1, limit = 10, searchQuery = '') => {
    try {
      setLoading(true);
      let url = `/tasks?_page=${page}&_limit=${limit}`;
      if (searchQuery) {
        url += `&name_like=${searchQuery}`;
      }
      const response = await axios({ url, method: "GET" });
      if (Array.isArray(response)) {
        setTasks(response);
      }
    } catch (error) {
      message.error("Vazifalarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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
      message.success("Vazifa qo'shildi");
      setAddModalVisible(false);
      form.resetFields();
      fetchTasks();
    } catch (error) {
      message.error("Xatolik yuz berdi");
    }
  };

  const handleEdit = async (values: any) => {
    try {
      const updateData = {
        name: values.name,
        type: values.type,
        description: values.description,
        priority: values.priority,
        status: values.status
      };

      await axios({
        url: `/tasks/${selectedTask?.id}`,
        method: "PATCH",
        body: updateData
      });
      
      message.success("Vazifa ma'lumotlari yangilandi");
      setEditModalVisible(false);
      form.resetFields();
      fetchTasks();
    } catch (error) {
      message.error("Xatolik yuz berdi");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios({
        url: `/tasks/${id}`,
        method: "DELETE"
      });
      message.success("Vazifa o'chirildi");
      fetchTasks();
    } catch (error) {
      message.error("O'chirishda xatolik yuz berdi");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: '#faad14',
      in_progress: '#1890ff',
      completed: '#52c41a'
    };
    return colors[status] || '#000';
  };

  const handleEditModalOpen = (record: TaskType) => {
    setSelectedTask(record);
    form.resetFields();
    form.setFieldsValue({
      name: record.name,
      type: record.type,
      description: record.description,
      priority: record.priority,
      status: record.status
    });
    setEditModalVisible(true);
  };

  const columns = [
    {
      title: 'Vazifa nomi',
      dataIndex: 'name',
    },
    {
      title: 'Turi',
      dataIndex: 'type',
      render: (type: string) => type === 'manager' ? 'Manager' : 'Xodim'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => (
        <span style={{ 
          color: getStatusColor(status),
          padding: '4px 8px',
          borderRadius: '4px',
          border: `1px solid ${getStatusColor(status)}`,
          fontSize: '12px'
        }}>
          {status === 'pending' ? 'Kutilmoqda' :
           status === 'in_progress' ? 'Bajarilmoqda' :
           'Bajarildi'}
        </span>
      )
    },
    {
      title: 'Muhimlik',
      dataIndex: 'priority',
      render: (priority: string) => (
        <span style={{ 
          color: priority === 'high' ? '#f5222d' :
                 priority === 'medium' ? '#faad14' : '#52c41a'
        }}>
          {priority === 'high' ? 'Yuqori' :
           priority === 'medium' ? "O'rta" : 'Past'}
        </span>
      )
    },
    {
      title: 'Amallar',
      key: 'action',
      render: (_: any, record: TaskType) => (
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
        </Space>
      ),
    },
  ];

  const MobileCard = ({ task }: { task: TaskType }) => (
    <Card 
      style={{ 
        marginBottom: 16,
        backgroundColor: isDarkMode ? '#1f1f2e' : '#ffffff',
        borderColor: isDarkMode ? '#3a3a4d' : '#d9e6ff'
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Space align="start">
          <FileOutlined style={{ fontSize: '24px' }} />
          <div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 'bold',
              color: isDarkMode ? '#ffffff' : '#000000'
            }}>
              {task.name}
            </div>
            <div style={{ 
              fontSize: '14px',
              color: isDarkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.45)',
              marginTop: 4
            }}>
              {task.description}
            </div>
          </div>
        </Space>

        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Tag color={task.type === 'manager' ? 'blue' : 'green'}>
              {task.type === 'manager' ? 'Manager' : 'Xodim'}
            </Tag>
            <Tag color={
              task.status === 'completed' ? 'success' :
              task.status === 'in_progress' ? 'processing' : 
              'warning'
            }>
              {task.status === 'completed' ? 'Bajarildi' :
               task.status === 'in_progress' ? 'Bajarilmoqda' :
               'Kutilmoqda'}
            </Tag>
            <Tag color={
              task.priority === 'high' ? 'error' :
              task.priority === 'medium' ? 'warning' :
              'success'
            }>
              {task.priority === 'high' ? 'Yuqori' :
               task.priority === 'medium' ? "O'rta" :
               'Past'}
            </Tag>
          </Space>
        </Space>

        <Space wrap style={{ width: '100%',  }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditModalOpen(task)}
            style={{ marginRight: 8 }}
          >
            O'zgartirish
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(task.id)}
          >
            O'chirish
          </Button>
        </Space>
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
            placeholder="Vazifa nomi bo'yicha qidirish..."
            style={{ 
              width: width < 576 ? '100%' : 300,
              backgroundColor: isDarkMode ? '#2a2a3b' : '#ffffff',
              borderColor: isDarkMode ? '#3a3a4d' : '#d9e6ff',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.88)' : 'rgba(0, 0, 0, 0.88)',
            }}
            onSearch={(value) => fetchTasks(1, 10, value)}
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
            Vazifa qo'shish
          </Button>
        </div>

        {isMobile ? (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin size="large" tip="Yuklanmoqda..." />
              </div>
            ) : (
              tasks.map(task => (
                <MobileCard key={task.id} task={task} />
              ))
            )}
          </div>
        ) : (
          <Table
            loading={loading}
            columns={columns}
            dataSource={tasks}
            rowKey="id"
            className={isDarkMode ? 'dark-table' : 'light-table'}
            style={{
              backgroundColor: isDarkMode ? '#1f1f2e' : '#ffffff'
            }}
          />
        )}
      </Card>

      <CustomModal
        title={selectedTask ? "Vazifani tahrirlash" : "Yangi vazifa qo'shish"}
        visible={addModalVisible || editModalVisible}
        onCancel={() => {
          setAddModalVisible(false);
          setEditModalVisible(false);
          setSelectedTask(null);
          form.resetFields();
        }}
        form={form}
        onFinish={selectedTask ? handleEdit : handleAdd}
      >
        <Form.Item
          name="name"
          label="Vazifa nomi"
          rules={[{ required: true, message: 'Vazifa nomini kiriting' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label="Turi"
          rules={[{ required: true, message: 'Turini tanlang' }]}
        >
          <Select>
            <Select.Option value="manager">Manager</Select.Option>
            <Select.Option value="employee">Xodim</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          label="Tavsif"
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="priority"
          label="Muhimlik"
          rules={[{ required: true, message: 'Muhimlik darajasini tanlang' }]}
        >
          <Select>
            <Select.Option value="high">Yuqori</Select.Option>
            <Select.Option value="medium">O'rta</Select.Option>
            <Select.Option value="low">Past</Select.Option>
          </Select>
        </Form.Item>
        {selectedTask && (
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Statusni tanlang' }]}
          >
            <Select>
              <Select.Option value="pending">Kutilmoqda</Select.Option>
              <Select.Option value="in_progress">Bajarilmoqda</Select.Option>
              <Select.Option value="completed">Bajarildi</Select.Option>
            </Select>
          </Form.Item>
        )}
      </CustomModal>
    </div>
  );
} 