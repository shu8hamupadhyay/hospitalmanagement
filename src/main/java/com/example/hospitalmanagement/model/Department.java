package com.example.hospitalmanagement.model;

import jakarta.persistence.*;

@Entity
@Table(name = "department")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String head;
    private int staffCount;
    private int servicesOffered;
    private String status;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getHead() { return head; }
    public void setHead(String head) { this.head = head; }

    public int getStaffCount() { return staffCount; }
    public void setStaffCount(int staffCount) { this.staffCount = staffCount; }

    public int getServicesOffered() { return servicesOffered; }
    public void setServicesOffered(int servicesOffered) { this.servicesOffered = servicesOffered; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
