package com.example.hospitalmanagement.repository;

import com.example.hospitalmanagement.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 📁 AppointmentRepository
 *
 * Repository interface for managing {@link Appointment} entities.
 * Provides custom queries for counting, filtering, and sorting
 * appointments by date, doctor, patient, or department.
 */
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // ==========================================================
    // 🔢 COUNT METHODS
    // ==========================================================

    /**
     * Counts the number of appointments for a given department.
     * Used for auto-generating serial/token numbers.
     */
    long countByDepartmentId(Long departmentId);

    /**
     * Counts appointments within a date-time range.
     * Typically used for dashboard statistics (e.g., today's appointments).
     */
    long countByAppointmentDateBetween(LocalDateTime start, LocalDateTime end);

    // ==========================================================
    // 🔍 FILTER METHODS
    // ==========================================================

    /**
     * Finds all appointments for a specific doctor.
     */
    List<Appointment> findByDoctorId(Long doctorId);

    /**
     * Finds all appointments for a specific patient.
     */
    List<Appointment> findByPatientId(Long patientId);

    // ==========================================================
    // 📅 TIME-BASED QUERIES
    // ==========================================================

    /**
     * Retrieves all future (upcoming) appointments sorted by date ascending.
     * Used for the dashboard and upcoming schedule views.
     */
    List<Appointment> findByAppointmentDateAfterOrderByAppointmentDateAsc(LocalDateTime dateTime);

    /**
     * Retrieves all appointments within a date range, sorted by date descending.
     * Used to show recent appointments in the dashboard.
     */
    List<Appointment> findByAppointmentDateBetweenOrderByAppointmentDateDesc(LocalDateTime start, LocalDateTime end);

    /**
     * Retrieves all past appointments before a given time.
     * Useful for reports, history, and analytics.
     */
    List<Appointment> findByAppointmentDateBefore(LocalDateTime dateTime);
}
