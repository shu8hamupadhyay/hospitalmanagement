package com.example.hospitalmanagement.mapper;

import com.example.hospitalmanagement.dto.MedicineDTO;
import com.example.hospitalmanagement.model.Medicine;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
public class MedicineDTOMapper {

    public MedicineDTO toDTO(Medicine medicine) {
        if (medicine == null) return null;

        MedicineDTO dto = new MedicineDTO();
        dto.setId(medicine.getId());
        dto.setName(medicine.getName());
        dto.setManufacturer(medicine.getManufacturer());
        dto.setBatchNumber(medicine.getBatchNumber());
        dto.setExpiryDate(medicine.getExpiryDate());
        dto.setType(medicine.getType());
        dto.setComposition(medicine.getComposition());
        dto.setDescription(medicine.getDescription());
        dto.setPrice(medicine.getPrice());
        dto.setStockQuantity(medicine.getStockQuantity());
        dto.setLocation(medicine.getLocation());

        // Calculate derived fields
        if (medicine.getExpiryDate() != null) {
            LocalDate today = LocalDate.now();
            dto.setIsExpired(medicine.getExpiryDate().isBefore(today));
            long daysUntil = java.time.temporal.ChronoUnit.DAYS.between(today, medicine.getExpiryDate());
            dto.setDaysUntilExpiry((int) daysUntil);
        }

        // Low stock alert (less than 50 units)
        dto.setIsLowStock(medicine.getStockQuantity() != null && medicine.getStockQuantity() < 50);

        return dto;
    }

    public Medicine toEntity(MedicineDTO dto) {
        if (dto == null) return null;

        Medicine medicine = new Medicine();
        medicine.setId(dto.getId());
        medicine.setName(dto.getName());
        medicine.setManufacturer(dto.getManufacturer());
        medicine.setBatchNumber(dto.getBatchNumber());
        medicine.setExpiryDate(dto.getExpiryDate());
        medicine.setType(dto.getType());
        medicine.setComposition(dto.getComposition());
        medicine.setDescription(dto.getDescription());
        medicine.setPrice(dto.getPrice());
        medicine.setStockQuantity(dto.getStockQuantity());
        medicine.setLocation(dto.getLocation());

        return medicine;
    }

    public void updateEntityFromDTO(MedicineDTO dto, Medicine medicine) {
        if (dto == null) return;

        if (dto.getName() != null) medicine.setName(dto.getName());
        if (dto.getManufacturer() != null) medicine.setManufacturer(dto.getManufacturer());
        if (dto.getBatchNumber() != null) medicine.setBatchNumber(dto.getBatchNumber());
        if (dto.getExpiryDate() != null) medicine.setExpiryDate(dto.getExpiryDate());
        if (dto.getType() != null) medicine.setType(dto.getType());
        if (dto.getComposition() != null) medicine.setComposition(dto.getComposition());
        if (dto.getDescription() != null) medicine.setDescription(dto.getDescription());
        if (dto.getPrice() != null) medicine.setPrice(dto.getPrice());
        if (dto.getStockQuantity() != null) medicine.setStockQuantity(dto.getStockQuantity());
        if (dto.getLocation() != null) medicine.setLocation(dto.getLocation());
    }
}
