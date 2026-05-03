import { FormEvent, useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { Employee, LeaveRequest } from "../types";

interface LeaveFormState {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

const emptyLeaveForm: LeaveFormState = {
  leaveType: "",
  startDate: "",
  endDate: "",
  reason: ""
};

const LeaveManagementPage = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [formData, setFormData] = useState<LeaveFormState>(emptyLeaveForm);
  const [myEmployee, setMyEmployee] = useState<Employee | null>(null);
  const { hasRole, user } = useAuth();

  const canManage = hasRole(["ADMIN", "HR"]);
  const isEmployee = user?.role === "EMPLOYEE";

  const loadLeaves = async () => {
    const endpoint = isEmployee ? "/api/leave/me" : "/api/leave";
    const response = await api.get<LeaveRequest[]>(endpoint);
    setLeaves(response.data);
  };

  useEffect(() => {
    const load = async () => {
      if (isEmployee) {
        const employeeResponse = await api.get<Employee>("/api/employees/me");
        setMyEmployee(employeeResponse.data);
      }
      await loadLeaves();
    };
    void load();
  }, [isEmployee]);

  const applyLeave = async (event: FormEvent) => {
    event.preventDefault();
    const employeeId = user?.employeeId ?? myEmployee?.id;
    if (!employeeId) {
      console.log("Apply leave: no employeeId (JWT or /api/employees/me)");
      return;
    }
    const body = {
      employeeId,
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason
    };
    console.log("Apply leave request body:", body);
    try {
      await api.post("/api/leave/apply", body);
      setFormData(emptyLeaveForm);
      await loadLeaves();
    } catch (error) {
      console.log("Apply leave error:", error);
      console.log(
        "Apply leave error response:",
        (error as { response?: { data?: unknown } }).response?.data
      );
    }
  };

  const approveLeave = async (id: number) => {
    await api.post(`/api/leave/${id}/approve`);
    await loadLeaves();
  };

  return (
    <section>
      <h2>Leave Management</h2>
      {isEmployee && (
        <form className="card leave-form" onSubmit={applyLeave}>
          <h3>Apply for Leave</h3>
          <label>
            Leave Type
            <input
              value={formData.leaveType}
              onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
              required
            />
          </label>
          <label>
            Start Date
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </label>
          <label>
            End Date
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </label>
          <label>
            Reason
            <input
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
            />
          </label>
          <button className="btn" type="submit">Apply Leave</button>
        </form>
      )}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Start</th>
              <th>End</th>
              <th>Reason</th>
              <th>Status</th>
              {canManage && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.employee.name}</td>
                <td>{leave.leaveType ?? "-"}</td>
                <td>{leave.startDate}</td>
                <td>{leave.endDate}</td>
                <td>{leave.reason}</td>
                <td>{leave.status}</td>
                {canManage && (
                  <td className="actions">
                    <button className="btn btn-small" onClick={() => void approveLeave(leave.id)}>
                      Approve
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default LeaveManagementPage;
