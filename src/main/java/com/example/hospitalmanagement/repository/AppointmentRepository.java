package com.example.hospitalmanagement.repository;

import com.example.hospitalmanagement.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Count appointments in a given datetime range
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentDate BETWEEN :start AND :end")
    long countAppointmentsToday(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
