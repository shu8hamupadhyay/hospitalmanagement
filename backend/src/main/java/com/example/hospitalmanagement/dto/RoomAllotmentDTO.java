package com.example.hospitalmanagement.dto;

import lombok.Data;

@Data
public class RoomAllotmentDTO {

    private Long id;
    private String roomNumber;
    private String patientName;
    private String roomType;
    private String doctorInCharge;
    private String admissionDate;
    private String dischargeDate;
    private String status;
}
