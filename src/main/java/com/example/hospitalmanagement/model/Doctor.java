package com.example.hospitalmanagement.model;

import jakarta.persistence.*;

// Model for Doctor entity, updated to include all fields required by data.sql
@Entity
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    
    // START: Fields added to fix the JdbcSQLSyntaxErrorException
    private String email;
    private String phone;
    private String qualification;
    private String specialization; // Changed from 'specialty' to align with data.sql
    // END: Fields added to fix the JdbcSQLSyntaxErrorException

    // Default constructor
    public Doctor() {}

    // Getters and Setters (required for JPA and Thymeleaf)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
}
