package com.ems.repository;

import com.ems.entity.LeaveRequest;
import com.ems.enums.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployeeIdOrderByStartDateDesc(Long employeeId);
    long countByEmployeeIdAndStatus(Long employeeId, LeaveStatus status);
}
