package com.example.hospitalmanagement.controller.rest;

import com.example.hospitalmanagement.dto.AppointmentDTO;
import com.example.hospitalmanagement.dto.DoctorDTO;
import com.example.hospitalmanagement.dto.mapper.AppointmentDTOMapper;

import com.example.hospitalmanagement.model.Appointment;
import com.example.hospitalmanagement.model.Department;
import com.example.hospitalmanagement.model.Doctor;
import com.example.hospitalmanagement.model.Patient;

import com.example.hospitalmanagement.service.AppointmentService;
import com.example.hospitalmanagement.service.DepartmentService;
import com.example.hospitalmanagement.service.DoctorApiService;
import com.example.hospitalmanagement.service.DoctorService;
import com.example.hospitalmanagement.service.PatientService;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentRestController {

    private final AppointmentService appointmentService;
    private final DepartmentService departmentService;
    private final DoctorService doctorService;          // ENTITY service
    private final DoctorApiService doctorApiService;    // DTO service
    private final PatientService patientService;

    public AppointmentRestController(
            AppointmentService appointmentService,
            DepartmentService departmentService,
            DoctorService doctorService,
            DoctorApiService doctorApiService,
            PatientService patientService
    ) {
        this.appointmentService = appointmentService;
        this.departmentService = departmentService;
        this.doctorService = doctorService;
        this.doctorApiService = doctorApiService;
        this.patientService = patientService;
    }

    // ==========================================================
    // GET ALL — DTO
    // ==========================================================
    @GetMapping
    public List<AppointmentDTO> getAll() {
        return appointmentService.getAllAppointments()
                .stream()
                .map(AppointmentDTOMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ==========================================================
    // GET ONE — DTO
    // ==========================================================
    @GetMapping("/{id}")
    public AppointmentDTO getOne(@PathVariable Long id) {
        Appointment appt = appointmentService.getAppointmentById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found " + id));

        return AppointmentDTOMapper.toDTO(appt);
    }

    // ==========================================================
    // CREATE — DTO
    // ==========================================================
    @PostMapping
    public AppointmentDTO create(@RequestBody AppointmentDTO dto) {

        Appointment appointment = new Appointment();

        // ---------------- PATIENT ----------------
        Patient patient = patientService.getPatientById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Invalid patient ID"));
        appointment.setPatient(patient);

        // ---------------- DEPARTMENT ----------------
        Department department = departmentService.getDepartmentById(dto.getDepartmentId());
        appointment.setDepartment(department);

        // ---------------- DOCTOR ----------------
        Doctor doctor = doctorService.getDoctorById(dto.getDoctorId());
        if (doctor == null)
            throw new RuntimeException("Invalid doctor ID");

        appointment.setDoctor(doctor);

        // ---------------- CORE FIELDS ----------------
        appointment.setAppointmentDate(LocalDateTime.parse(dto.getAppointmentDate()));
        appointment.setStatus(dto.getStatus());
        appointment.setProblem(dto.getProblem());
        appointment.setChiefComplaint(dto.getChiefComplaint());
        appointment.setRemarks(dto.getRemarks());

        // ---------------- EXTRA FIELDS ----------------
        appointment.setAppointmentType(dto.getAppointmentType());
        appointment.setPlannedDurationMinutes(dto.getPlannedDurationMinutes());
        appointment.setFollowUp(dto.getIsFollowUp());
        appointment.setRoomNumber(dto.getRoomNumber());
        appointment.setCancellationReason(dto.getCancellationReason());

        // ---------------- BILLING ----------------
        appointment.setFee(dto.getFee());
        appointment.setPaymentStatus(dto.getPaymentStatus());
        appointment.setIcd10Code(dto.getIcd10Code());
        appointment.setCptCode(dto.getCptCode());

        // ---------------- CHECK-IN / CHECK-OUT ----------------
        if (dto.getCheckInTime() != null && !dto.getCheckInTime().isBlank()) {
            appointment.setCheckInTime(LocalDateTime.parse(dto.getCheckInTime()));
        }

        if (dto.getCheckOutTime() != null && !dto.getCheckOutTime().isBlank()) {
            appointment.setCheckOutTime(LocalDateTime.parse(dto.getCheckOutTime()));
        }

        // SERIAL NUMBER FOR NEW APPOINTMENT
        appointmentService.generateSerialIfNew(appointment);

        Appointment saved = appointmentService.saveAppointment(appointment);
        return AppointmentDTOMapper.toDTO(saved);
    }

    // ==========================================================
    // UPDATE — DTO
    // ==========================================================
    @PutMapping("/{id}")
    public AppointmentDTO update(@PathVariable Long id, @RequestBody AppointmentDTO dto) {

        Appointment existing = appointmentService.getAppointmentById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // ---------------- PATIENT ----------------
        Patient patient = patientService.getPatientById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Invalid patient ID"));
        existing.setPatient(patient);

        // ---------------- DEPARTMENT ----------------
        Department department = departmentService.getDepartmentById(dto.getDepartmentId());
        existing.setDepartment(department);

        // ---------------- DOCTOR ----------------
        Doctor doctor = doctorService.getDoctorById(dto.getDoctorId());
        if (doctor == null)
            throw new RuntimeException("Invalid doctor ID");
        existing.setDoctor(doctor);

        // ---------------- CORE FIELDS ----------------
        existing.setAppointmentDate(LocalDateTime.parse(dto.getAppointmentDate()));
        existing.setStatus(dto.getStatus());
        existing.setProblem(dto.getProblem());
        existing.setChiefComplaint(dto.getChiefComplaint());
        existing.setRemarks(dto.getRemarks());
        existing.setFee(dto.getFee());

        // ---------------- EXTRA FIELDS ----------------
        existing.setAppointmentType(dto.getAppointmentType());
        existing.setPlannedDurationMinutes(dto.getPlannedDurationMinutes());
        existing.setFollowUp(dto.getIsFollowUp());
        existing.setRoomNumber(dto.getRoomNumber());
        existing.setCancellationReason(dto.getCancellationReason());

        // ---------------- BILLING ----------------
        existing.setPaymentStatus(dto.getPaymentStatus());
        existing.setIcd10Code(dto.getIcd10Code());
        existing.setCptCode(dto.getCptCode());

        // ---------------- CHECK-IN / CHECK-OUT ----------------
        if (dto.getCheckInTime() != null && !dto.getCheckInTime().isBlank()) {
            existing.setCheckInTime(LocalDateTime.parse(dto.getCheckInTime()));
        }

        if (dto.getCheckOutTime() != null && !dto.getCheckOutTime().isBlank()) {
            existing.setCheckOutTime(LocalDateTime.parse(dto.getCheckOutTime()));
        }

        Appointment saved = appointmentService.saveAppointment(existing);
        return AppointmentDTOMapper.toDTO(saved);
    }

    // ==========================================================
    // DELETE
    // ==========================================================
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
    }

    // ==========================================================
    // DOCTORS BY DEPARTMENT (DTO)
    // ==========================================================
    @GetMapping("/doctors/by-department/{deptId}")
    public List<DoctorDTO> getDoctorsByDepartment(@PathVariable Long deptId) {
        return doctorApiService.getDoctorsByDepartment(deptId);
    }
}
