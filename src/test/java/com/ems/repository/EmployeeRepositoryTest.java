package com.ems.repository;

import com.ems.entity.Employee;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
class EmployeeRepositoryTest {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Test
    void findByDepartmentShouldReturnEmployees() {
        Employee employee = new Employee();
        employee.setName("Bob");
        employee.setEmail("bob@ems.com");
        employee.setDepartment("Engineering");
        employee.setSalary(45000.0);
        employeeRepository.save(employee);

        List<Employee> results = employeeRepository.findByDepartment("Engineering");
        assertEquals(1, results.size());
    }
}
