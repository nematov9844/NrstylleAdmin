import { useState, useEffect, useContext } from 'react';
import { Table, Button, Card, message, Space, Tag, Typography, Row, Col, Spin } from 'antd';
import { CheckOutlined, UserOutlined } from '@ant-design/icons';
import { ThemeContext } from '../../context/ThemeContext';
import { useAxios } from "../../hooks/useAxios";
import { useWindowSize } from '../../hooks/useWindowSize';

const { Title, Text } = Typography;

interface BlockedUserType {
  id: number;
  name: string;
  last_name: string;
  email: string;
  type: 'manager' | 'employee';
  isActive: boolean;
  tasks?: Array<{
    id: number;
    name: string;
    type: string;
  }>;
}

export default function Bloklangan() {
  const { isDarkMode } = useContext(ThemeContext);
  const [filteredUsers, setFilteredUsers] = useState<BlockedUserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10
  const axios = useAxios();
  const { width } = useWindowSize();

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const [managersRes, employeesRes] = await Promise.all([
        axios({ url: '/managers', method: "GET"}),
        axios({ url: '/employees', method: "GET" })
      ]);

      const managers = Array.isArray(managersRes) ? managersRes : [];
      const employees = Array.isArray(employeesRes) ? employeesRes : [];
      const allUsersData = [...managers, ...employees];
      
      filterBlockedUsers(allUsersData);
    } catch (error) {
      console.error("Xatolik:", error);
      message.error("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  // Bloklangan foydalanuvchilarni filtrlash
  const filterBlockedUsers = (users: BlockedUserType[], searchQuery: string = '') => {
    const blocked = users.filter(user => {
      const isBlocked = !user.isActive;
      if (!searchQuery) return isBlocked;
      
      const fullName = `${user.name} ${user.last_name}`.toLowerCase();
      return isBlocked && fullName.includes(searchQuery.toLowerCase());
    });
    setFilteredUsers(blocked);
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleUnblock = async (record: BlockedUserType) => {
    try {
      const endpoint = record.type === 'manager' ? 'managers' : 'employees';
      await axios({
        url: `/${endpoint}/${record.id}`,
        method: "PATCH",
        body: { isActive: true }
      });
      message.success("Foydalanuvchi blokdan chiqarildi");
      fetchAllUsers();
    } catch (error) {
      message.error("Xatolik yuz berdi");
    }
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredUsers.slice(startIndex, endIndex);
  };

  const columns = [
    {
      title: 'F.I.O',
      key: 'name',
      render: (record: BlockedUserType) => (
        <Space>
          <UserOutlined style={{ fontSize: '18px' }} />
          <div>
            <Text strong>{record.name} {record.last_name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Lavozim',
      key: 'type',
      render: (record: BlockedUserType) => (
        <Tag color={record.type === 'manager' ? 'blue' : 'green'}>
          {record.type === 'manager' ? 'Manager' : 'Hodim'}
        </Tag>
      )
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (record: BlockedUserType) => (
        <Button
          type="primary"
          icon={<CheckOutlined />}
          onClick={() => handleUnblock(record)}
          className="btn-unblock"
        >
          Blokdan chiqarish
        </Button>
      )
    }
  ];

  // Mobile card component
  const MobileCard = ({ user }: { user: BlockedUserType }) => (
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
            <Text strong style={{ fontSize: '16px' }}>
              {user.name} {user.last_name}
            </Text>
            <br />
            <Text type="secondary">{user.email}</Text>
          </div>
        </Space>
        
        <Row justify="space-between" align="middle">
          <Col>
            <Tag color={user.type === 'manager' ? 'blue' : 'green'}>
              {user.type === 'manager' ? 'Manager' : 'Hodim'}
            </Tag>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleUnblock(user)}
              className="btn-unblock"
            >
              Blokdan chiqarish
            </Button>
          </Col>
        </Row>
      </Space>
    </Card>
  );

  return (
    <div style={
      {display:'flex',flexDirection:"column",gap:"20px"}
      }>
      <Title level={5} style={{ 
        marginBottom: 24, 
        color: isDarkMode ? '#ffffff' : '#000000',
        fontSize: width < 768 ? '18px' : '24px'
      }}>
        Bloklangan foydalanuvchilar
      </Title>

      {width >= 768 ? (
        // Desktop view
        <Table
          columns={columns}
          dataSource={getPaginatedData()}
          loading={loading}
          rowKey="id"
          className={isDarkMode ? 'dark-table' : 'light-table'}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredUsers.length,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
            showTotal: (total) => `Jami: ${total}`
          }}
        />
      ) : (
        // Mobile view
        <div style={{ padding: '0 8px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin size="large" tip="Yuklanmoqda..." />

            </div>
          ) : (
            getPaginatedData().map(user => (
              <MobileCard key={user.id} user={user} />
            ))
          )}
        </div>
      )}
    </div>
  );
} 