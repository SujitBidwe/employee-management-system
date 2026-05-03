package com.ems.service;

import com.ems.dto.AttendanceRequest;
import com.ems.entity.Attendance;
import com.ems.entity.Employee;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.AttendanceRepository;
import com.ems.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public AttendanceService(AttendanceRepository attendanceRepository, EmployeeRepository employeeRepository) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
    }

    public Attendance mark(AttendanceRequest request) {
        if (attendanceRepository.existsByEmployeeIdAndAttendanceDate(request.getEmployeeId(), LocalDate.now())) {
            throw new IllegalArgumentException("Attendance already marked for today.");
        }
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + request.getEmployeeId()));
        boolean presentFlag = request.isPresent();
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            presentFlag = "PRESENT".equalsIgnoreCase(request.getStatus().trim());
        }

        Attendance attendance = new Attendance();
        attendance.setEmployee(employee);
        attendance.setAttendanceDate(LocalDate.now());
        attendance.setPresent(presentFlag);
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> today() {
        return attendanceRepository.findByAttendanceDate(LocalDate.now());
    }

    public List<Attendance> history(Long employeeId) {
        return attendanceRepository.findByEmployeeIdOrderByAttendanceDateDesc(employeeId);
    }
}
