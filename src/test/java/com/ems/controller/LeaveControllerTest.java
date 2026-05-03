package com.ems.controller;

import com.ems.dto.LeaveRequestDto;
import com.ems.entity.LeaveRequest;
import com.ems.enums.LeaveStatus;
import com.ems.service.LeaveService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class LeaveControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private LeaveService leaveService;

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void applyLeaveShouldWorkForEmployee() throws Exception {
        LeaveRequestDto dto = new LeaveRequestDto();
        dto.setEmployeeId(1L);
        dto.setStartDate(LocalDate.now());
        dto.setEndDate(LocalDate.now().plusDays(2));
        dto.setReason("Medical");

        LeaveRequest request = new LeaveRequest();
        request.setId(1L);
        request.setStatus(LeaveStatus.PENDING);

        when(leaveService.apply(any(LeaveRequestDto.class))).thenReturn(request);

        mockMvc.perform(post("/api/leave/apply")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void approveLeaveShouldReturnForbiddenForEmployeeRole() throws Exception {
        mockMvc.perform(post("/api/leave/1/approve"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Forbidden: insufficient permissions"));
    }
}
