package com.example.hospitalmanagement.service;

import com.example.hospitalmanagement.model.Prescription;
import com.example.hospitalmanagement.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PrescriptionService {
    private final PrescriptionRepository repo;

    public PrescriptionService(PrescriptionRepository repo) {
        this.repo = repo;
    }

    public List<Prescription> findAll() {
        return repo.findAll();
    }

    public Prescription save(Prescription prescription) {
        return repo.save(prescription);
    }
}
