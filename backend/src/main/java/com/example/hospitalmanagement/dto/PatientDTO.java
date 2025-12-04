package com.example.hospitalmanagement.dto;
import lombok.Data;

@Data
public class PatientDTO {

    private Long id;

    private String name;
    private Integer age;
    private String gender;

    private String email;
    private String phone;

    private String dob;
    private String address;
    private String city;
    private String state;
    private String country;

    private String bloodGroup;
    private String maritalStatus;

    private String medicalHistory;
    private String allergies;
    private String currentMedications;

    private String emergencyContactName;
    private String emergencyContactNumber;
    private String relationshipToPatient;

    private String insuranceProvider;
    private String insurancePolicyNumber;

    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;
}
