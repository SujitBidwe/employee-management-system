package com.ems.service;

import com.ems.entity.Employee;
import com.ems.entity.User;
import com.ems.enums.Role;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {
    public static final String DEFAULT_NEW_EMPLOYEE_PASSWORD = "Employee@123";

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeService(EmployeeRepository employeeRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Employee create(Employee employee) {
        Employee saved = employeeRepository.save(employee);
        String loginUsername = saved.getEmail();
        if (!userRepository.existsByUsername(loginUsername)) {
            User user = new User();
            user.setUsername(loginUsername);
            user.setPassword(passwordEncoder.encode(DEFAULT_NEW_EMPLOYEE_PASSWORD));
            user.setRole(Role.EMPLOYEE);
            userRepository.save(user);
        }
        return saved;
    }

    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }

    public Employee getById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    public Employee update(Long id, Employee employee) {
        Employee existing = getById(id);
        existing.setName(employee.getName());
        existing.setEmail(employee.getEmail());
        existing.setDepartment(employee.getDepartment());
        existing.setSalary(employee.getSalary());
        return employeeRepository.save(existing);
    }

    public void delete(Long id) {
        Employee existing = getById(id);
        employeeRepository.delete(existing);
    }

    public List<Employee> byDepartment(String department) {
        return employeeRepository.findByDepartment(department);
    }

    public Employee getByUsername(String username) {
        return employeeRepository.findByEmailIgnoreCase(username)
                .or(() -> employeeRepository.findByNameIgnoreCase(username))
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No employee profile found for user: " + username +
                                ". Create an employee with matching email or name."));
    }
}
