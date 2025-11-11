package com.example.hospitalmanagement.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "department")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ==========================================================
    // 🏥 Department Details
    // ==========================================================
    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 100)
    private String head;

    @Column(name = "staff_count")
    private int staffCount;

    @Column(name = "services_offered")
    private int servicesOffered;

    @Column(length = 20)
    private String status; // Active / Inactive

    // ==========================================================
    // 🔗 Relationships
    // ==========================================================

    // One department can have many doctors
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Doctor> doctors;

    // One department can have many appointments
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Appointment> appointments;

    // ==========================================================
    // 🏗 Constructors
    // ==========================================================
    public Department() {}

    public Department(String name, String head, int staffCount, int servicesOffered, String status) {
        this.name = name;
        this.head = head;
        this.staffCount = staffCount;
        this.servicesOffered = servicesOffered;
        this.status = status;
    }

    // ==========================================================
    // 🧩 Getters and Setters
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

    public String getHead() {
        return head;
    }

    public void setHead(String head) {
        this.head = head;
    }

    public int getStaffCount() {
        return staffCount;
    }

    public void setStaffCount(int staffCount) {
        this.staffCount = staffCount;
    }

    public int getServicesOffered() {
        return servicesOffered;
    }

    public void setServicesOffered(int servicesOffered) {
        this.servicesOffered = servicesOffered;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<Doctor> getDoctors() {
        return doctors;
    }

    public void setDoctors(List<Doctor> doctors) {
        this.doctors = doctors;
    }

    public List<Appointment> getAppointments() {
        return appointments;
    }

    public void setAppointments(List<Appointment> appointments) {
        this.appointments = appointments;
    }

    // ==========================================================
    // 🧠 Utility
    // ==========================================================
    @Override
    public String toString() {
        return name + " (" + status + ")";
    }
}
