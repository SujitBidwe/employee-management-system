import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { AttendanceRecord, Employee } from "../types";

const AttendancePage = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [myEmployee, setMyEmployee] = useState<Employee | null>(null);
  const [marking, setMarking] = useState(false);

  const isEmployee = user?.role === "EMPLOYEE";

  const loadAttendance = async () => {
    const endpoint = isEmployee ? "/api/attendance/me" : "/api/attendance/today";
    const response = await api.get<AttendanceRecord[]>(endpoint);
    setRecords(response.data);
  };

  useEffect(() => {
    const load = async () => {
      if (isEmployee) {
        const employeeResponse = await api.get<Employee>("/api/employees/me");
        setMyEmployee(employeeResponse.data);
      }
      await loadAttendance();
    };
    void load();
  }, [isEmployee]);

  const markAttendance = async () => {
    const employeeId = user?.employeeId ?? myEmployee?.id;
    if (!employeeId) {
      console.log("Mark attendance: no employeeId on user or /api/employees/me");
      return;
    }
    const body = { employeeId, status: "PRESENT" as const };
    console.log("Mark attendance request body:", body);
    setMarking(true);
    try {
      await api.post("/api/attendance/mark", body);
      await loadAttendance();
    } catch (error) {
      console.log("Mark attendance error:", error);
      console.log(
        "Mark attendance error response:",
        (error as { response?: { data?: unknown } }).response?.data
      );
    } finally {
      setMarking(false);
    }
  };

  return (
    <section>
      <div className="header-row">
        <h2>{isEmployee ? "My Attendance" : "Today's Attendance"}</h2>
        {isEmployee && (
          <button
            className="btn"
            onClick={() => void markAttendance()}
            disabled={marking || (!user?.employeeId && !myEmployee)}
          >
            {marking ? "Marking..." : "Mark Attendance"}
          </button>
        )}
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.employee.name}</td>
                <td>{record.attendanceDate}</td>
                <td>{record.present ? "PRESENT" : "ABSENT"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AttendancePage;
