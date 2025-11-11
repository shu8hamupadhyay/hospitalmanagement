package com.example.hospitalmanagement.model;

import jakarta.persistence.*;

@Entity
public class RoomAllotment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomNumber;
    private String patientName;
    private String roomType; // e.g., General, Private, ICU
    private String doctorInCharge;
    private String admissionDate;
    private String dischargeDate;
    private String status; // e.g., Occupied, Available, Cleaning

    public RoomAllotment() {}

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public String getDoctorInCharge() { return doctorInCharge; }
    public void setDoctorInCharge(String doctorInCharge) { this.doctorInCharge = doctorInCharge; }

    public String getAdmissionDate() { return admissionDate; }
    public void setAdmissionDate(String admissionDate) { this.admissionDate = admissionDate; }

    public String getDischargeDate() { return dischargeDate; }
    public void setDischargeDate(String dischargeDate) { this.dischargeDate = dischargeDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
