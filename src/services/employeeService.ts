import axios from 'axios';
import { CreateEmployeeDto, Employee, UpdateEmployeeDto } from '../types/employee';

const API_URL = import.meta.env.REACT_APP_API_URL;

export const employeeService = {
  getAll: async (page: number = 1, limit: number = 10) => {
    const response = await axios.get(`${API_URL}/employees`, {
      params: { page, limit }
    });
    return response.data;
  },

  create: async (data: CreateEmployeeDto) => {
    const response = await axios.post(`${API_URL}/employees`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateEmployeeDto) => {
    const response = await axios.put(`${API_URL}/employees/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await axios.delete(`${API_URL}/employees/${id}`);
  },

  changeStatus: async (id: number, status: Employee['status']) => {
    const response = await axios.patch(`${API_URL}/employees/${id}/status`, { status });
    return response.data;
  }
}; 