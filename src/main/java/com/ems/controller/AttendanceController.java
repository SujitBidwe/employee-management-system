package com.ems.controller;

import com.ems.dto.AttendanceRequest;
import com.ems.entity.Employee;
import com.ems.entity.Attendance;
import com.ems.service.EmployeeService;
import com.ems.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
    private final AttendanceService attendanceService;
    private final EmployeeService employeeService;

    public AttendanceController(AttendanceService attendanceService, EmployeeService employeeService) {
        this.attendanceService = attendanceService;
        this.employeeService = employeeService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','HR','EMPLOYEE')")
    @PostMapping("/mark")
    public ResponseEntity<Attendance> mark(@Valid @RequestBody AttendanceRequest request) {
        return ResponseEntity.ok(attendanceService.mark(request));
    }

    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @GetMapping("/today")
    public ResponseEntity<List<Attendance>> today() {
        return ResponseEntity.ok(attendanceService.today());
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/me")
    public ResponseEntity<List<Attendance>> myHistory(Authentication authentication) {
        Employee employee = employeeService.getByUsername(authentication.getName());
        return ResponseEntity.ok(attendanceService.history(employee.getId()));
    }
}
