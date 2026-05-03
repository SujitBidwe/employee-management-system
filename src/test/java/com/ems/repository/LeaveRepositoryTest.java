package com.ems.repository;

import com.ems.entity.Employee;
import com.ems.entity.LeaveRequest;
import com.ems.enums.LeaveStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
class LeaveRepositoryTest {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Test
    void saveShouldPersistLeaveRequest() {
        Employee employee = new Employee();
        employee.setName("Sam");
        employee.setEmail("sam@ems.com");
        employee.setDepartment("HR");
        employee.setSalary(30000.0);
        Employee savedEmployee = employeeRepository.save(employee);

        LeaveRequest request = new LeaveRequest();
        request.setEmployee(savedEmployee);
        request.setStartDate(LocalDate.now());
        request.setEndDate(LocalDate.now().plusDays(2));
        request.setReason("Personal");
        request.setStatus(LeaveStatus.PENDING);

        LeaveRequest savedRequest = leaveRequestRepository.save(request);
        assertEquals(LeaveStatus.PENDING, savedRequest.getStatus());
    }
}
