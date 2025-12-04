package com.example.hospitalmanagement.repository;

import com.example.hospitalmanagement.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {

    /**
     * Finds all Bills, eagerly fetching the Patient and Doctor details
     * to avoid LazyInitializationException during JSON serialization.
     * The JPQL uses JOIN FETCH to retrieve related entities in a single query.
     */
    @Query("SELECT b FROM Bill b JOIN FETCH b.patient p JOIN FETCH b.doctor d")
    List<Bill> findAllWithDetails();
}