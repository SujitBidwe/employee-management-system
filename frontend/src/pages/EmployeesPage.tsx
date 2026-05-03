import { FormEvent, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { Employee } from "../types";

interface EmployeeFormState {
  name: string;
  email: string;
  department: string;
  salary: string;
}

const emptyForm: EmployeeFormState = {
  name: "",
  email: "",
  department: "",
  salary: ""
};

const EmployeesPage = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<EmployeeFormState>(emptyForm);

  const loadEmployees = async () => {
    const response = await api.get<Employee[]>("/api/employees");
    setEmployees(response.data);
  };

  useEffect(() => {
    void loadEmployees();
  }, []);

  const openNewModal = () => {
    setEditingEmployee(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      salary: String(employee.salary)
    });
    setIsModalOpen(true);
  };

  const submitEmployee = async (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      name: formData.name,
      email: formData.email,
      department: formData.department,
      salary: Number(formData.salary)
    };

    console.log("Employee submit payload:", payload);

    try {
      if (editingEmployee) {
        await api.put(`/api/employees/${editingEmployee.id}`, payload);
      } else {
        await api.post("/api/employees", payload);
      }
      setIsModalOpen(false);
      await loadEmployees();
    } catch (error) {
      console.log("Employee submit error:", error);
      console.log("Employee submit error response:", (error as { response?: { data?: unknown } })?.response?.data);
    }
  };

  const deleteEmployee = async (id: number) => {
    await api.delete(`/api/employees/${id}`);
    await loadEmployees();
  };

  if (user?.role === "EMPLOYEE") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <section>
      <div className="header-row">
        <h2>Employees</h2>
        <button className="btn" onClick={openNewModal}>
          Add New Employee
        </button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>
                <td>${employee.salary.toLocaleString()}</td>
                <td className="actions">
                  <button className="btn btn-small" onClick={() => openEditModal(employee)}>
                    Edit
                  </button>
                  <button className="btn btn-small btn-danger" onClick={() => void deleteEmployee(employee.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <form className="card modal" onSubmit={submitEmployee}>
            <h3>{editingEmployee ? "Edit Employee" : "Add Employee"}</h3>
            <label>
              Name
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </label>
            <label>
              Department
              <input
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </label>
            <label>
              Salary
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                required
              />
            </label>
            <div className="header-row">
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="btn" type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default EmployeesPage;
