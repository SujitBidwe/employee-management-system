package com.ems.controller;

import com.ems.dto.LeaveRequestDto;
import com.ems.entity.Employee;
import com.ems.entity.LeaveRequest;
import com.ems.service.EmployeeService;
import com.ems.service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/leave")
public class LeaveController {
    private final LeaveService leaveService;
    private final EmployeeService employeeService;

    public LeaveController(LeaveService leaveService, EmployeeService employeeService) {
        this.leaveService = leaveService;
        this.employeeService = employeeService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
    @PostMapping("/apply")
    public ResponseEntity<LeaveRequest> apply(@Valid @RequestBody LeaveRequestDto dto) {
        return ResponseEntity.ok(leaveService.apply(dto));
    }

    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @PostMapping("/{id}/approve")
    public ResponseEntity<LeaveRequest> approve(@PathVariable Long id) {
        return ResponseEntity.ok(leaveService.approve(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @GetMapping
    public ResponseEntity<java.util.List<LeaveRequest>> all() {
        return ResponseEntity.ok(leaveService.getAll());
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/me")
    public ResponseEntity<java.util.List<LeaveRequest>> mine(Authentication authentication) {
        Employee employee = employeeService.getByUsername(authentication.getName());
        return ResponseEntity.ok(leaveService.getByEmployeeId(employee.getId()));
    }
}
