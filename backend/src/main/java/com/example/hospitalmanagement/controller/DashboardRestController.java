package com.example.hospitalmanagement.controller.rest;

import com.example.hospitalmanagement.service.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardRestController {

    private final PatientService patientService;
    private final DoctorService doctorService;
    private final AppointmentService appointmentService;
    private final DepartmentService departmentService;
    private final BillService billService;
    private final MedicineService medicineService;
    private final LabReportService labReportService;
    private final DeathReportService deathReportService;
    private final BirthReportService birthReportService;
    private final ContactService contactService;

    public DashboardRestController(
            PatientService patientService,
            DoctorService doctorService,
            AppointmentService appointmentService,
            DepartmentService departmentService,
            BillService billService,
            MedicineService medicineService,
            LabReportService labReportService,
            DeathReportService deathReportService,
            BirthReportService birthReportService,
            ContactService contactService
    ) {
        this.patientService = patientService;
        this.doctorService = doctorService;
        this.appointmentService = appointmentService;
        this.departmentService = departmentService;
        this.billService = billService;
        this.medicineService = medicineService;
        this.labReportService = labReportService;
        this.deathReportService = deathReportService;
        this.birthReportService = birthReportService;
        this.contactService = contactService;
    }

    @GetMapping
    public Map<String, Object> getDashboardStats() {

        Map<String, Object> stats = new HashMap<>();

        stats.put("patients", safe(() -> patientService.getAllPatients().size()));
        stats.put("doctors", safe(() -> doctorService.getAllDoctors().size()));

        stats.put("appointments", safe(() -> appointmentService.getAllAppointments().size()));
        stats.put("appointmentsToday", safe(() -> appointmentService.countAppointmentsToday()));
        stats.put("upcomingAppointments",
                safe(() -> appointmentService.findUpcomingAppointments(LocalDateTime.now()).size())
        );

        stats.put("departments", safe(() -> departmentService.getAllDepartments().size()));

        stats.put("bills", safe(() -> billService.findAll().size()));

        // ✅ FIXED — Use BillService revenue
        stats.put("totalRevenue", safe(() -> billService.getTotalRevenue()));

        stats.put("medicines", safe(() -> medicineService.getAllMedicines().size()));

        // FIX: LabReportService method must be findAll()
stats.put("labReports", safe(() -> labReportService.countLabReports()));

        stats.put("deathReports", safe(() -> deathReportService.getAllReports().size()));
        stats.put("birthReports", safe(() -> birthReportService.getAllBirthReports().size()));

        stats.put("contacts", safe(() -> contactService.findAll().size()));

        return stats;
    }

    private Object safe(SafeCallable callable) {
        try {
            return callable.call();
        } catch (Exception e) {
            return 0;
        }
    }

    private interface SafeCallable {
        Object call();
    }
}
