package com.ems.dto;

import jakarta.validation.constraints.NotNull;

public class AttendanceRequest {
    @NotNull
    private Long employeeId;
    /**
     * Optional: "PRESENT" or "ABSENT". When set, this takes precedence over {@link #present}.
     */
    private String status;
    private boolean present;

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isPresent() {
        return present;
    }

    public void setPresent(boolean present) {
        this.present = present;
    }
}
