package com.example.hospitalmanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "department")

// Prevent Hibernate Lazy errors
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

// Prevent infinite recursion using ID references
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Department {

    // ==========================================================
    // PRIMARY KEY
    // ==========================================================
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ==========================================================
    // DETAILS
    // ==========================================================
    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 100)
    private String head;

    @Column(name = "staff_count")
    private int staffCount;

    @Column(name = "services_offered", length = 255)
    private String servicesOffered;

    @Column(length = 20)
    private String status; // Active / Inactive

    // ==========================================================
    // RELATIONSHIPS
    // ==========================================================

    // One Department → Many Doctors
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Doctor> doctors;

    // One Department → Many Appointments
    // Not needed by UI → ignore to prevent recursion loops
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Appointment> appointments;

    // ==========================================================
    // CONSTRUCTORS
    // ==========================================================
    public Department() {}

    public Department(String name, String head, int staffCount, String servicesOffered, String status) {
        this.name = name;
        this.head = head;
        this.staffCount = staffCount;
        this.servicesOffered = servicesOffered;
        this.status = status;
    }

    // ==========================================================
    // GETTERS & SETTERS
    // ==========================================================
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getHead() { return head; }
    public void setHead(String head) { this.head = head; }

    public int getStaffCount() { return staffCount; }
    public void setStaffCount(int staffCount) { this.staffCount = staffCount; }

    public String getServicesOffered() { return servicesOffered; }
    public void setServicesOffered(String servicesOffered) { this.servicesOffered = servicesOffered; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<Doctor> getDoctors() { return doctors; }
    public void setDoctors(List<Doctor> doctors) { this.doctors = doctors; }

    public List<Appointment> getAppointments() { return appointments; }
    public void setAppointments(List<Appointment> appointments) { this.appointments = appointments; }

    // ==========================================================
    // UTILITY
    // ==========================================================
    @Override
    public String toString() {
        return name + " (" + status + ")";
    }
}
