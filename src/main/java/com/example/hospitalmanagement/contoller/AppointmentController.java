package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.model.Appointment;
import com.example.hospitalmanagement.service.AppointmentService;
import com.example.hospitalmanagement.repository.DoctorRepository;
import com.example.hospitalmanagement.repository.PatientRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/appointments") // Added RequestMapping for cleaner paths
public class AppointmentController {
    
    private final AppointmentService appointmentService;
    private final DoctorRepository doctorRepository; // Needed for the form dropdown
    private final PatientRepository patientRepository; // Needed for the form dropdown

    // Inject all required dependencies
    public AppointmentController(
            AppointmentService appointmentService, 
            DoctorRepository doctorRepository, 
            PatientRepository patientRepository) {
        this.appointmentService = appointmentService;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    /**
     * Handles the GET request for the appointments view.
     * FIX: Adds the empty 'appointment' object for the Thymeleaf form.
     */
    @GetMapping
    public String listAppointmentsAndForm(Model model) {
        // 1. Data for the list of existing appointments
        List<Appointment> appointments = appointmentService.getAllAppointments();
        model.addAttribute("appointments", appointments);
        
        // 2. REQUIRED FIX: Data for the NEW APPOINTMENT FORM
        // This line resolves the "Neither BindingResult nor plain target object for bean name 'appointment' available" error.
        model.addAttribute("appointment", new Appointment());
        
        // 3. Data for form dropdowns (Doctors and Patients)
        model.addAttribute("doctors", doctorRepository.findAll());
        model.addAttribute("patients", patientRepository.findAll());

        return "appointments"; // Renders src/main/resources/templates/appointments.html
    }
    
    /**
     * Handles the POST request to save a new appointment.
     */
    @PostMapping
    public String saveAppointment(@ModelAttribute("appointment") Appointment appointment) {
        appointmentService.saveAppointment(appointment);
        // Redirect to the GET endpoint to prevent double submission
        return "redirect:/appointments"; 
    }
}
