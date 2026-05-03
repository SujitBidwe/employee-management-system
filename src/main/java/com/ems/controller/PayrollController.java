package com.ems.controller;

import com.ems.entity.Payroll;
import com.ems.entity.Employee;
import com.ems.service.EmployeeService;
import com.ems.service.PayrollService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/payroll")
public class PayrollController {
    private final PayrollService payrollService;
    private final EmployeeService employeeService;

    public PayrollController(PayrollService payrollService, EmployeeService employeeService) {
        this.payrollService = payrollService;
        this.employeeService = employeeService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @PostMapping("/generate")
    public ResponseEntity<Payroll> generate(@RequestParam Long employeeId,
                                            @RequestParam(defaultValue = "10.0") double deductionPercentage) {
        return ResponseEntity.ok(payrollService.generate(employeeId, deductionPercentage));
    }

    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @GetMapping
    public ResponseEntity<List<Payroll>> all() {
        return ResponseEntity.ok(payrollService.getAll());
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/me")
    public ResponseEntity<List<Payroll>> mine(Authentication authentication) {
        Employee employee = employeeService.getByUsername(authentication.getName());
        return ResponseEntity.ok(payrollService.getByEmployeeId(employee.getId()));
    }
}
