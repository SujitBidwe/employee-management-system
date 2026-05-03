package com.ems.service;

import com.ems.entity.Employee;
import com.ems.entity.Payroll;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.PayrollRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PayrollServiceTest {

    @Mock
    private PayrollRepository payrollRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private PayrollService payrollService;

    @Test
    void generateShouldCalculatePayrollCorrectly() {
        Employee employee = new Employee();
        employee.setId(1L);
        employee.setSalary(10000.0);

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));
        when(payrollRepository.save(any(Payroll.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Payroll payroll = payrollService.generate(1L, 10.0);

        assertEquals(10000.0, payroll.getBaseSalary());
        assertEquals(1000.0, payroll.getDeductions());
        assertEquals(9000.0, payroll.getNetSalary());
    }
}
