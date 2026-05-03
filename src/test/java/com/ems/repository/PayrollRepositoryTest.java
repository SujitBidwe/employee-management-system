package com.ems.repository;

import com.ems.entity.Employee;
import com.ems.entity.Payroll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@DataJpaTest
class PayrollRepositoryTest {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PayrollRepository payrollRepository;

    @Test
    void saveShouldPersistPayroll() {
        Employee employee = new Employee();
        employee.setName("Jane");
        employee.setEmail("jane@ems.com");
        employee.setDepartment("Finance");
        employee.setSalary(70000.0);
        Employee savedEmployee = employeeRepository.save(employee);

        Payroll payroll = new Payroll();
        payroll.setEmployee(savedEmployee);
        payroll.setPayDate(LocalDate.now());
        payroll.setBaseSalary(70000.0);
        payroll.setDeductions(7000.0);
        payroll.setNetSalary(63000.0);

        Payroll savedPayroll = payrollRepository.save(payroll);
        assertNotNull(savedPayroll.getId());
    }
}
