package com.example.hospitalmanagement.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class BirthReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String babyName;
    private String motherName;
    private String fatherName;
    private String gender;
    private LocalDateTime birthDateTime;
    private String doctorName;
    private String remarks;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBabyName() { return babyName; }
    public void setBabyName(String babyName) { this.babyName = babyName; }

    public String getMotherName() { return motherName; }
    public void setMotherName(String motherName) { this.motherName = motherName; }

    public String getFatherName() { return fatherName; }
    public void setFatherName(String fatherName) { this.fatherName = fatherName; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public LocalDateTime getBirthDateTime() { return birthDateTime; }
    public void setBirthDateTime(LocalDateTime birthDateTime) { this.birthDateTime = birthDateTime; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
