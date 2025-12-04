package com.example.hospitalmanagement.dto.mapper;

import com.example.hospitalmanagement.dto.AppointmentDTO;
import com.example.hospitalmanagement.model.Appointment;

public class AppointmentDTOMapper {

    public static AppointmentDTO toDTO(Appointment a) {
        if (a == null) return null;

        AppointmentDTO dto = new AppointmentDTO();

        // ============================
        // PRIMARY ID (IMPORTANT)
        // ============================
        dto.setId(a.getId());

        // ============================
        // RELATIONS
        // ============================
        if (a.getPatient() != null) {
            dto.setPatientId(a.getPatient().getId());
            dto.setPatientName(a.getPatient().getName());
        }

        if (a.getDoctor() != null) {
            dto.setDoctorId(a.getDoctor().getId());
            dto.setDoctorName(a.getDoctor().getName());
        }

        if (a.getDepartment() != null) {
            dto.setDepartmentId(a.getDepartment().getId());
            dto.setDepartmentName(a.getDepartment().getName());
        }

        // ============================
        // CORE
        // ============================
        dto.setAppointmentDate(
                a.getAppointmentDate() != null ? a.getAppointmentDate().toString() : null
        );
        dto.setStatus(a.getStatus());
        dto.setProblem(a.getProblem());
        dto.setChiefComplaint(a.getChiefComplaint());
        dto.setSerialNo(a.getSerialNo());

        // ============================
        // WORKFLOW
        // ============================
        dto.setAppointmentType(a.getAppointmentType());
        dto.setPlannedDurationMinutes(a.getPlannedDurationMinutes());
        dto.setIsFollowUp(a.isFollowUp());
        dto.setRoomNumber(a.getRoomNumber());
        dto.setRemarks(a.getRemarks());
        dto.setCancellationReason(a.getCancellationReason());

        // ============================
        // BILLING
        // ============================
        dto.setFee(a.getFee());
        dto.setPaymentStatus(a.getPaymentStatus());

        // ============================
        // CODING
        // ============================
        dto.setIcd10Code(a.getIcd10Code());
        dto.setCptCode(a.getCptCode());

        // ============================
        // AUDIT
        // ============================
        dto.setCheckInTime(
                a.getCheckInTime() != null ? a.getCheckInTime().toString() : null
        );
        dto.setCheckOutTime(
                a.getCheckOutTime() != null ? a.getCheckOutTime().toString() : null
        );
        dto.setLastModifiedBy(a.getLastModifiedBy());

        return dto;
    }
}
