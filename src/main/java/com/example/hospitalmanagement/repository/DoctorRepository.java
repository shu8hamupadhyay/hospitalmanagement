package com.example.hospitalmanagement.repository;

import com.example.hospitalmanagement.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findByDepartmentId(Long departmentId);

    // ✅ Find doctor by name (used in BillService and others)
    Optional<Doctor> findByName(String name);

    // ⚠️ Note: findByDepartmentId() will only work if Doctor has a department field.
    // If you plan to add department mapping later, you can uncomment the below line:
    // List<Doctor> findByDepartmentId(Long departmentId);
}
