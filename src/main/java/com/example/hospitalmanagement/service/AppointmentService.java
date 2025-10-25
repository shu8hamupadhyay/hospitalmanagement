package com.example.hospitalmanagement.service;

import com.example.hospitalmanagement.model.Appointment;
import com.example.hospitalmanagement.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

// Service layer implementation for Appointment logic.
@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
    
    public void saveAppointment(Appointment appointment) {
        appointmentRepository.save(appointment);
    }
}
