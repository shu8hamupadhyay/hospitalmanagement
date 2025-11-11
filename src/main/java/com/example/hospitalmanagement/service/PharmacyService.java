package com.example.hospitalmanagement.service;

import com.example.hospitalmanagement.model.Medicine;
import com.example.hospitalmanagement.repository.MedicineRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PharmacyService {

    private final MedicineRepository medicineRepository;

    public PharmacyService(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    public Medicine saveMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }
}
