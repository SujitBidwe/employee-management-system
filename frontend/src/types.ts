export type Role = "ADMIN" | "HR" | "EMPLOYEE";

export interface AuthUser {
  username: string;
  role: Role;
  employeeId?: number;
}

export interface LoginResponse {
  token: string;
  role: Role;
}

export interface DepartmentReport {
  totalEmployees: number;
  presentToday: number;
  pendingLeaves: number;
  monthlyPayrollTotal: number;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  salary: number;
}

export interface AttendanceRecord {
  id: number;
  employee: Employee;
  attendanceDate: string;
  present: boolean;
}

export interface LeaveRequest {
  id: number;
  employee: Employee;
  leaveType?: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}

export interface PayrollRecord {
  id: number;
  employee: Employee;
  payDate: string;
  baseSalary: number;
  deductions: number;
  netSalary: number;
}
