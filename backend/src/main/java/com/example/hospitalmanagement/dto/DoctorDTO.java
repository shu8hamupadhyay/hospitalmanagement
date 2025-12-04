package com.example.hospitalmanagement.dto;

import lombok.Data;

@Data
public class DoctorDTO {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String qualification;
    private String specialization;

    private Long departmentId;
    private String departmentName;  // helpful for UI
}
