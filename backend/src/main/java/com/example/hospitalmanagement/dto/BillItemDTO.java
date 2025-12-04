package com.example.hospitalmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillItemDTO {
    private Long id;
    private String description;
    private int quantity;
    private double unitPrice;
    private double taxPercent;
    private double discountPercent;
    private double subTotal;
    
    // Link to medicine (optional) - for pharmacy integration
    private Long medicineId;
    private String medicineName;
    private String medicineType;
    private String medicineManufacturer;
    private Integer medicineStockQuantity;
}
