package com.example.hospitalmanagement.dto;

import lombok.Data;

@Data
public class DepartmentDTO {

    private Long id;

    private String name;

    // Doctor assigned as Head of Department
    private Long headDoctorId;     // Stores doctor ID
    private String headDoctorName; // Stores doctor name (optional frontend use)

    private int staffCount;

    private String servicesOffered;

    private String status; // Active / Inactive / Maintenance
}
