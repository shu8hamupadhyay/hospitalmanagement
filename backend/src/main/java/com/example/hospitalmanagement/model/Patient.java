package com.example.hospitalmanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "patients")

// Prevent Hibernate proxy errors
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

// Prevent infinite recursion (same as Doctor + Appointment)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Basic Info
    @Column(nullable = false)
    private String name;

    private Integer age;
    private String gender;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;

    // Extended Info
    private LocalDate dob;
    private String address;
    private String city;
    private String state;
    private String country;
    private String bloodGroup;
    private String maritalStatus;

    // Medical Info
    @Column(length = 1000)
    private String medicalHistory;

    @Column(length = 500)
    private String allergies;

    @Column(length = 500)
    private String currentMedications;

    // Emergency Contact
    private String emergencyContactName;
    private String emergencyContactNumber;
    private String relationshipToPatient;

    // Insurance
    private String insuranceProvider;
    private String insurancePolicyNumber;

    // Many Patients → One Doctor
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    @JsonIgnoreProperties({"appointments", "department"})  // avoid cycles
    private Doctor doctor;

    // One Patient → Many Appointments
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"patient", "doctor", "department"}) // avoid loops
    private List<Appointment> appointments;

    // One Patient → Many Death Reports
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"patient", "doctor"}) // avoid loops
    private List<DeathReport> deathReports;

    // One Patient → Many Lab Reports
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"patient"}) // avoid loops
    private List<LabReport> labreports;

    public Patient() {}

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getMaritalStatus() { return maritalStatus; }
    public void setMaritalStatus(String maritalStatus) { this.maritalStatus = maritalStatus; }

    public String getMedicalHistory() { return medicalHistory; }
    public void setMedicalHistory(String medicalHistory) { this.medicalHistory = medicalHistory; }

    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }

    public String getCurrentMedications() { return currentMedications; }
    public void setCurrentMedications(String currentMedications) { this.currentMedications = currentMedications; }

    public String getEmergencyContactName() { return emergencyContactName; }
    public void setEmergencyContactName(String emergencyContactName) { this.emergencyContactName = emergencyContactName; }

    public String getEmergencyContactNumber() { return emergencyContactNumber; }
    public void setEmergencyContactNumber(String emergencyContactNumber) { this.emergencyContactNumber = emergencyContactNumber; }

    public String getRelationshipToPatient() { return relationshipToPatient; }
    public void setRelationshipToPatient(String relationshipToPatient) { this.relationshipToPatient = relationshipToPatient; }

    public String getInsuranceProvider() { return insuranceProvider; }
    public void setInsuranceProvider(String insuranceProvider) { this.insuranceProvider = insuranceProvider; }

    public String getInsurancePolicyNumber() { return insurancePolicyNumber; }
    public void setInsurancePolicyNumber(String insurancePolicyNumber) { this.insurancePolicyNumber = insurancePolicyNumber; }

    public Doctor getDoctor() { return doctor; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }

    public List<Appointment> getAppointments() { return appointments; }
    public void setAppointments(List<Appointment> appointments) { this.appointments = appointments; }

    public List<DeathReport> getDeathReports() { return deathReports; }
    public void setDeathReports(List<DeathReport> deathReports) { this.deathReports = deathReports; }

    public List<LabReport> getLabreports() { return labreports; }
    public void setLabreports(List<LabReport> labreports) { this.labreports = labreports; }

    @Override
    public String toString() {
        return "Patient{id=" + id + ", name='" + name + "', email='" + email + "'}";
    }
}
