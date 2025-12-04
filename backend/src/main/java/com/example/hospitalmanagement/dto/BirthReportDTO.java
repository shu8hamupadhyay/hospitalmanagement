package com.example.hospitalmanagement.dto;

import lombok.Data;

@Data
public class BirthReportDTO {

    private Long id;
    private String babyName;
    private String motherName;
    private String fatherName;
    private String gender;
    private String birthDateTime;
    private String doctorName;
    private String remarks;
}
