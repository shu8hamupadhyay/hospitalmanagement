package com.example.hospitalmanagement.repository;

import com.example.hospitalmanagement.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    // Calculate sum of all bills
    @Query("SELECT COALESCE(SUM(b.amount), 0) FROM Bill b")
    double calculateTotalRevenue();
}
