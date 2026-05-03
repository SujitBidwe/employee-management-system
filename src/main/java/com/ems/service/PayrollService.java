package com.ems.service;

import com.ems.entity.Employee;
import com.ems.entity.Payroll;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.PayrollRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PayrollService {
    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;

    public PayrollService(PayrollRepository payrollRepository, EmployeeRepository employeeRepository) {
        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
    }

    public Payroll generate(Long employeeId, double deductionPercentage) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
        double base = employee.getSalary();
        double deductions = base * (deductionPercentage / 100);
        double net = base - deductions;

        Payroll payroll = new Payroll();
        payroll.setEmployee(employee);
        payroll.setPayDate(LocalDate.now());
        payroll.setBaseSalary(base);
        payroll.setDeductions(deductions);
        payroll.setNetSalary(net);
        return payrollRepository.save(payroll);
    }

    public List<Payroll> getAll() {
        return payrollRepository.findAll();
    }

    public List<Payroll> getByEmployeeId(Long employeeId) {
        return payrollRepository.findByEmployeeIdOrderByPayDateDesc(employeeId);
    }
}
