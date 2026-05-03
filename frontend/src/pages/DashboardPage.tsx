import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { AttendanceRecord, Employee, LeaveRequest, PayrollRecord } from "../types";

interface AdminSummary {
  totalEmployees: number;
  presentToday: number;
  pendingLeaves: number;
  monthlyPayrollTotal: number;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const [adminSummary, setAdminSummary] = useState<AdminSummary>({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    monthlyPayrollTotal: 0
  });
  const [myTodayStatus, setMyTodayStatus] = useState("Not marked");
  const [myPendingLeaves, setMyPendingLeaves] = useState(0);

  const isEmployee = user?.role === "EMPLOYEE";

  useEffect(() => {
    const load = async () => {
      if (isEmployee) {
        const [attendanceResponse, leaveResponse] = await Promise.all([
          api.get<AttendanceRecord[]>("/api/attendance/me"),
          api.get<LeaveRequest[]>("/api/leave/me")
        ]);
        const todayRecord = attendanceResponse.data.find(
          (record) => record.attendanceDate === new Date().toISOString().slice(0, 10)
        );
        setMyTodayStatus(todayRecord ? (todayRecord.present ? "PRESENT" : "ABSENT") : "Not marked");
        setMyPendingLeaves(
          leaveResponse.data.filter((leave) => leave.status === "PENDING").length
        );
        return;
      }

      const [employeesResponse, attendanceResponse, leaveResponse, payrollResponse] = await Promise.all([
        api.get<Employee[]>("/api/employees"),
        api.get<AttendanceRecord[]>("/api/attendance/today"),
        api.get<LeaveRequest[]>("/api/leave"),
        api.get<PayrollRecord[]>("/api/payroll")
      ]);

      setAdminSummary({
        totalEmployees: employeesResponse.data.length,
        presentToday: attendanceResponse.data.filter((record) => record.present).length,
        pendingLeaves: leaveResponse.data.filter((leave) => leave.status === "PENDING").length,
        monthlyPayrollTotal: payrollResponse.data.reduce((sum, payroll) => sum + payroll.netSalary, 0)
      });
    };
    void load();
  }, [isEmployee]);

  return (
    <section>
      <h2>Dashboard</h2>
      {isEmployee ? (
        <div className="grid-2">
          <article className="card stat-card">
            <h3>Today's Attendance</h3>
            <p>{myTodayStatus}</p>
          </article>
          <article className="card stat-card">
            <h3>Pending Leave Requests</h3>
            <p>{myPendingLeaves}</p>
          </article>
        </div>
      ) : (
        <div className="grid-4">
          <article className="card stat-card">
            <h3>Total Employees</h3>
            <p>{adminSummary.totalEmployees}</p>
          </article>
          <article className="card stat-card">
            <h3>Present Today</h3>
            <p>{adminSummary.presentToday}</p>
          </article>
          <article className="card stat-card">
            <h3>Pending Leaves</h3>
            <p>{adminSummary.pendingLeaves}</p>
          </article>
          <article className="card stat-card">
            <h3>Monthly Payroll</h3>
            <p>${adminSummary.monthlyPayrollTotal.toLocaleString()}</p>
          </article>
        </div>
      )}
    </section>
  );
};

export default DashboardPage;
