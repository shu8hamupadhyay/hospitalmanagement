package com.example.hospitalmanagement.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
public class LabReport {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String testName;
    @Lob
    private String result;
    private LocalDateTime reportDate;
    @Lob
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    @JsonIgnoreProperties({"appointments", "deathReports", "labreports", "hibernateLazyInitializer", "handler"})
    private Patient patient;

    public LabReport() {}

    public LabReport(String testName, String result, LocalDateTime reportDate, String notes, Patient patient) {
        this.testName = testName;
        this.result = result;
        this.reportDate = reportDate;
        this.notes = notes;
        this.patient = patient;
    }

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }
    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }
    public LocalDateTime getReportDate() { return reportDate; }
    public void setReportDate(LocalDateTime reportDate) { this.reportDate = reportDate; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
}
