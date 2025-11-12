package com.example.hospitalmanagement.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Basic Info ---
    private String name;
    private String manufacturer;
    private String batchNumber;
    private LocalDate expiryDate;
    private String type;

    // --- Detailed Info ---
    @Column(length = 1000)
    private String composition;
    @Column(length = 2000)
    private String description;

    // --- Inventory & Pricing ---
    private int stockQuantity;
    private double price;
    private String location; // e.g. Shelf A2

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getManufacturer() { return manufacturer; }
    public void setManufacturer(String manufacturer) { this.manufacturer = manufacturer; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getComposition() { return composition; }
    public void setComposition(String composition) { this.composition = composition; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(int stockQuantity) { this.stockQuantity = stockQuantity; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
