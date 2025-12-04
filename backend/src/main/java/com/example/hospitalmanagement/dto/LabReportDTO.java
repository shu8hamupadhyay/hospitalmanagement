package com.example.hospitalmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LabReportDTO {
    private Long id;
    private Long patientId;
    private String patientName;
    private String patientEmail;
    private Integer patientAge;
    private String patientPhone;
    private String testName;
    private String result;
    private LocalDateTime reportDate;
    private String notes;
    private LocalDateTime createdAt;
}
