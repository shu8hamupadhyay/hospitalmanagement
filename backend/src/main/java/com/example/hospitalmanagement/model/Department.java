package com.example.hospitalmanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "department")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Department {

    // =======================================================
    // PRIMARY KEY
    // =======================================================
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =======================================================
    // FIELDS
    // =======================================================
    @Column(nullable = false, unique = true, length = 100)
    private String name;

    // ⭐ NEW: Proper relationship → Head Doctor (Many departments → One doctor)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "head_doctor_id")
    private Doctor headDoctor;

    // Backward compatibility + caching
    @Column(name = "head_name", length = 100)
    private String head;

    @Column(name = "staff_count")
    private int staffCount;

    @Column(name = "services_offered", length = 255)
    private String servicesOffered;

    @Column(length = 20)
    private String status;

    // =======================================================
    // RELATIONS
    // =======================================================

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Doctor> doctors;

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Appointment> appointments;

    // =======================================================
    // CONSTRUCTORS
    // =======================================================
    public Department() {}

    public Department(
            String name,
            Doctor headDoctor,
            int staffCount,
            String servicesOffered,
            String status
    ) {
        this.name = name;
        this.headDoctor = headDoctor;
        this.head = (headDoctor != null ? headDoctor.getName() : null);
        this.staffCount = staffCount;
        this.servicesOffered = servicesOffered;
        this.status = status;
    }

    // =======================================================
    // GETTERS & SETTERS
    // =======================================================
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Doctor getHeadDoctor() { return headDoctor; }
    public void setHeadDoctor(Doctor headDoctor) {
        this.headDoctor = headDoctor;
        this.head = (headDoctor != null ? headDoctor.getName() : null);
    }

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

    // =======================================================
    // UTILITY
    // =======================================================
    @Override
    public String toString() {
        return name + " (" + status + ")";
    }
}
