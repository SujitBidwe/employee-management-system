import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isEmployee = user?.role === "EMPLOYEE";

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <h1 className="brand">EMS Dashboard</h1>
          <p className="muted">
            {user?.username} ({user?.role})
          </p>
        </div>
        <nav className="nav">
          <NavLink to="/dashboard">Dashboard</NavLink>
          {!isEmployee && <NavLink to="/employees">Employees</NavLink>}
          <NavLink to="/attendance">Attendance</NavLink>
          <NavLink to="/leaves">Leave Management</NavLink>
          <NavLink to="/payroll">Payroll</NavLink>
        </nav>
        <button className="btn btn-danger" onClick={onLogout}>
          Logout
        </button>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
