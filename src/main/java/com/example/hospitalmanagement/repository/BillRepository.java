package com.example.hospitalmanagement.repository;

import com.example.hospitalmanagement.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillRepository extends JpaRepository<Bill, Long> {
}
