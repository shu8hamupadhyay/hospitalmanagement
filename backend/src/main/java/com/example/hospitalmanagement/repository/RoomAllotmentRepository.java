package com.example.hospitalmanagement.repository;

import com.example.hospitalmanagement.model.RoomAllotment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomAllotmentRepository extends JpaRepository<RoomAllotment, Long> {
}
