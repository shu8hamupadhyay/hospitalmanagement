package com.example.hospitalmanagement.dto;

import lombok.Data;

@Data
public class PrescriptionDTO {

    private Long id;
    private String medicine;
    private String dosage;
    private String instructions;
    private String date;

    private Long patientId;
    private String patientName;

    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;
}
