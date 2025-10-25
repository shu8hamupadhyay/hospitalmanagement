package com.example.hospitalmanagement.model;

import jakarta.persistence.*;

// Model for Patient entity, updated to include all fields required by data.sql (age, gender, email)
@Entity
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    
    // START: Fields added to fix the JdbcSQLSyntaxErrorException
    private Integer age;
    private String gender;
    private String email;
    // END: Fields added to fix the JdbcSQLSyntaxErrorException
    
    private String phone;

    // Default constructor
    public Patient() {}

    // Getters and Setters (required for JPA and Thymeleaf)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
