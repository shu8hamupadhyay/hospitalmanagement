package com.example.hospitalmanagement.service;

import com.example.hospitalmanagement.model.Bill;
import com.example.hospitalmanagement.model.BillItem;
import com.example.hospitalmanagement.repository.BillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BillService {

    private final BillRepository billRepository;

    public BillService(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    /**
     * 🔹 Fetch all bills
     */
    public List<Bill> findAll() {
        return billRepository.findAll();
    }

    /**
     * 🔹 Find a single bill by ID
     */
    public Optional<Bill> findById(Long id) {
        return billRepository.findById(id);
    }

    /**
     * 🔹 Save or update a bill
     * Automatically handles linking items and recalculating totals.
     */
    public Bill save(Bill bill) {
        if (bill.getItems() != null && !bill.getItems().isEmpty()) {
            for (BillItem item : bill.getItems()) {
                item.setBill(bill); // ensure relationship consistency
            }
        }

        // Ensure all totals are computed before saving
        bill.calculateTotals();

        // Cascade save handled by JPA (because of CascadeType.ALL)
        return billRepository.save(bill);
    }

    /**
     * 🔹 Delete bill by ID
     */
    public void deleteById(Long id) {
        billRepository.deleteById(id);
    }
}
