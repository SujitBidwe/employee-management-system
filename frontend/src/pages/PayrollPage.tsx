import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { PayrollRecord } from "../types";

const PayrollPage = () => {
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const { hasRole, user } = useAuth();
  const canGenerate = hasRole(["ADMIN"]);
  const isEmployee = user?.role === "EMPLOYEE";

  const loadPayroll = async () => {
    const endpoint = isEmployee ? "/api/payroll/me" : "/api/payroll";
    const response = await api.get<PayrollRecord[]>(endpoint);
    setRecords(response.data);
  };

  useEffect(() => {
    void loadPayroll();
  }, []);

  const generatePayroll = async () => {
    await api.post("/api/payroll/generate");
    await loadPayroll();
  };

  return (
    <section>
      <div className="header-row">
        <h2>Payroll</h2>
        {canGenerate && (
          <button className="btn" onClick={() => void generatePayroll()}>
            Generate Payroll
          </button>
        )}
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Pay Date</th>
              <th>Base Salary</th>
              <th>Deductions</th>
              <th>Net Salary</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.employee.name}</td>
                <td>{record.payDate}</td>
                <td>${record.baseSalary.toLocaleString()}</td>
                <td>${record.deductions.toLocaleString()}</td>
                <td>${record.netSalary.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PayrollPage;
