package com.example.hospitalmanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "death_reports")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class DeathReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Patient Relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    @JsonIgnoreProperties({"doctor", "appointments", "deathReports"})
    private Patient patient;

    // Doctor Relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    @JsonIgnoreProperties({"department", "appointments"})
    private Doctor doctor;

    // Legacy fields for reference (can be kept or removed)
    @Column(name = "patient_name")
    private String patientName;

    private String gender;

    @Column(name = "cause_of_death", nullable = false)
    private String causeOfDeath;

    @Column(name = "doctor_name")
    private String doctorName;

    private String ward;

    @Column(name = "date_of_death")
    private LocalDateTime dateOfDeath;

    private String remarks;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Default Constructor
    public DeathReport() {}

    // Constructor with basic fields
    public DeathReport(Patient patient, Doctor doctor, String causeOfDeath, String ward) {
        this.patient = patient;
        this.doctor = doctor;
        this.causeOfDeath = causeOfDeath;
        this.ward = ward;
    }

    // ===== GETTERS & SETTERS =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Doctor getDoctor() { return doctor; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getCauseOfDeath() { return causeOfDeath; }
    public void setCauseOfDeath(String causeOfDeath) { this.causeOfDeath = causeOfDeath; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }

    public LocalDateTime getDateOfDeath() { return dateOfDeath; }
    public void setDateOfDeath(LocalDateTime dateOfDeath) { this.dateOfDeath = dateOfDeath; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
