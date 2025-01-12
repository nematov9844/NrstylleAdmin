export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  role: 'manager' | 'hodim';
  phone: string;
  email: string;
  status: 'active' | 'blocked' | 'pending' | 'approved';
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  role: 'manager' | 'hodim';
  phone: string;
  email: string;
}

export interface UpdateEmployeeDto extends CreateEmployeeDto {
  status?: 'active' | 'blocked' | 'pending' | 'approved';
} 