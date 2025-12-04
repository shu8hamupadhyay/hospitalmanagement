package com.example.hospitalmanagement.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DeathReportDTO {

    private Long id;

    // Patient Info
    private Long patientId;
    private String patientName;
    private String gender;
    private Integer patientAge;
    private String patientPhone;

    // Doctor Info
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;

    // Death Report Details
    private String causeOfDeath;
    private String ward;
    private LocalDateTime dateOfDeath;
    private String remarks;

    // Audit
    private LocalDateTime createdAt;
}
