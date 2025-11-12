package com.example.hospitalmanagement.repository;

import com.example.hospitalmanagement.model.BillItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillItemRepository extends JpaRepository<BillItem, Long> {}
