package com.example.hospitalmanagement.service;

import com.example.hospitalmanagement.model.Bill;
import com.example.hospitalmanagement.repository.BillRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BillService {
    private final BillRepository repo;

    public BillService(BillRepository repo) {
        this.repo = repo;
    }

    public List<Bill> findAll() {
        return repo.findAll();
    }

    public Bill save(Bill bill) {
        return repo.save(bill);
    }
}
