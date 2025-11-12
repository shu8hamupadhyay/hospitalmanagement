package com.example.hospitalmanagement.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "doctor")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ==========================================================
    // 👩‍⚕️ Doctor Details
    // ==========================================================
    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(length = 15)
    private String phone;

    @Column(length = 100)
    private String qualification;

    @Column(length = 100)
    private String specialization;

    // ==========================================================
    // 🔗 Relationship with Department (Optional)
    // ==========================================================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    // ==========================================================
    // 🔗 Relationship with Appointments
    // ==========================================================
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Appointment> appointments;

    // ==========================================================
    // 🏗️ Constructors
    // ==========================================================
    public Doctor() {}

    public Doctor(String name, String email, String phone, String qualification, String specialization) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.qualification = qualification;
        this.specialization = specialization;
    }

    // ==========================================================
    // 🧩 Getters & Setters
    // ==========================================================
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public List<Appointment> getAppointments() {
        return appointments;
    }

    public void setAppointments(List<Appointment> appointments) {
        this.appointments = appointments;
    }

    // ==========================================================
    // 🧠 Utility Methods
    // ==========================================================
    @Override
    public String toString() {
        return name + " (" + specialization + ")";
    }
}
