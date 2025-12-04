package com.example.hospitalmanagement.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "appointments",
        uniqueConstraints = @UniqueConstraint(columnNames = {"serial_no"})
)
// Prevent Lazy loading errors in JSON
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
// Prevent infinite recursion in JSON
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ==========================================================
    // RELATIONS
    // ==========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    @JsonIgnoreProperties({"doctors", "appointments"})
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    @JsonIgnoreProperties({"appointments", "department"})
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false) // Patient relation is MANDATORY
    @JsonIgnoreProperties({"appointments"})
    private Patient patient;

    // ==========================================================
    // CORE DETAILS
    // ==========================================================

    @Column(name = "appointment_date", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime appointmentDate;

    @Column(name = "serial_no", unique = true, length = 20, nullable = false)
    private String serialNo;

    @Column(length = 255)
    private String problem; // Historical field, often replaced by chief complaint

    @Column(length = 30, nullable = false)
    private String status = "Scheduled"; // Status: Scheduled, Checked-In, In-Progress, Completed, Cancelled, No-Show

    @Column(length = 500)
    private String remarks;

    @Column(name = "fee")
    private Double fee = 0.0;

    // ==========================================================
    // ADVANCED CLINIC WORKFLOW & SCHEDULING
    // ==========================================================

    @Column(name = "chief_complaint", length = 255)
    private String chiefComplaint; // The primary reason for the patient's visit (C/C)

    @Column(name = "planned_duration_minutes")
    private Integer plannedDurationMinutes = 30; // Default 30 minutes

    @Column(name = "appointment_type", length = 50, nullable = false)
    private String appointmentType = "IN_PERSON"; // IN_PERSON, TELEHEALTH, EMERGENCY

    @Column(name = "is_follow_up")
    private boolean isFollowUp = false;

    @Column(name = "room_number", length = 10)
    private String roomNumber; // The physical room assigned

    @Column(name = "cancellation_reason", length = 255)
    private String cancellationReason; // Used if status is "Cancelled"

    // ==========================================================
    // BILLING AND CODING
    // ==========================================================

    @Column(name = "icd10_code", length = 10)
    private String icd10Code; // Primary Diagnosis Code (e.g., M54.5 for low back pain)

    @Column(name = "cpt_code", length = 10)
    private String cptCode; // Procedure/Service Code (e.g., 99213 for office visit)

    @Column(name = "payment_status", length = 30)
    private String paymentStatus = "PENDING"; // PENDING, PAID, CLAIMED, WAIVED

    // ==========================================================
    // AUDITING & TIMESTAMPS
    // ==========================================================

    @Column(name = "check_in_time")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime checkInTime; // When the patient arrived

    @Column(name = "check_out_time")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime checkOutTime; // When the patient left

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_modified_at")
    private LocalDateTime lastModifiedAt; // For auditing changes

    @Column(name = "last_modified_by", length = 100)
    private String lastModifiedBy; // User ID or username of the modifier

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.lastModifiedAt = LocalDateTime.now();
        if (this.status == null || this.status.isBlank()) {
            this.status = "Scheduled";
        }
        if (this.appointmentType == null || this.appointmentType.isBlank()) {
            this.appointmentType = "IN_PERSON";
        }
        if (this.paymentStatus == null || this.paymentStatus.isBlank()) {
            this.paymentStatus = "PENDING";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.lastModifiedAt = LocalDateTime.now();
    }


    // ==========================================================
    // CONSTRUCTORS
    // ==========================================================
    public Appointment() {}

    // ==========================================================
    // GETTERS & SETTERS (All fields included)
    // ==========================================================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
    public Doctor getDoctor() { return doctor; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public LocalDateTime getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDateTime appointmentDate) { this.appointmentDate = appointmentDate; }
    public String getSerialNo() { return serialNo; }
    public void setSerialNo(String serialNo) { this.serialNo = serialNo; }
    public String getProblem() { return problem; }
    public void setProblem(String problem) { this.problem = problem; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public Double getFee() { return fee; }
    public void setFee(Double fee) { this.fee = fee; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Advanced Getters/Setters (V2)
    public String getChiefComplaint() { return chiefComplaint; }
    public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }
    public Integer getPlannedDurationMinutes() { return plannedDurationMinutes; }
    public void setPlannedDurationMinutes(Integer plannedDurationMinutes) { this.plannedDurationMinutes = plannedDurationMinutes; }
    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }
    public String getIcd10Code() { return icd10Code; }
    public void setIcd10Code(String icd10Code) { this.icd10Code = icd10Code; }
    public String getCptCode() { return cptCode; }
    public void setCptCode(String cptCode) { this.cptCode = cptCode; }
    public LocalDateTime getLastModifiedAt() { return lastModifiedAt; }
    public void setLastModifiedAt(LocalDateTime lastModifiedAt) { this.lastModifiedAt = lastModifiedAt; }
    public String getLastModifiedBy() { return lastModifiedBy; }
    public void setLastModifiedBy(String lastModifiedBy) { this.lastModifiedBy = lastModifiedBy; }


    // Advanced Getters/Setters (V1)
    public String getAppointmentType() { return appointmentType; }
    public void setAppointmentType(String appointmentType) { this.appointmentType = appointmentType; }
    public boolean isFollowUp() { return isFollowUp; }
    public void setFollowUp(boolean followUp) { isFollowUp = followUp; }
    public LocalDateTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalDateTime checkInTime) { this.checkInTime = checkInTime; }
    public LocalDateTime getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(LocalDateTime checkOutTime) { this.checkOutTime = checkOutTime; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

}