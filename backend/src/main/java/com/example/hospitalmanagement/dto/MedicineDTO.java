package com.example.hospitalmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicineDTO {
    private Long id;
    private String name;
    private String manufacturer;
    private String batchNumber;
    private LocalDate expiryDate;
    private String type;
    private String composition;
    private String description;
    private Double price;
    private Integer stockQuantity;
    private String location;
    private Boolean isExpired;
    private Boolean isLowStock;
    private Integer daysUntilExpiry;
}
