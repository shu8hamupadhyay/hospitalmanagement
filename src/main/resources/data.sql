-- ==========================================================
-- 🧹 CLEAN EXISTING DATA (Safe Delete Order)
-- ==========================================================
SET REFERENTIAL_INTEGRITY FALSE;

TRUNCATE TABLE bill_items;
TRUNCATE TABLE bills;
TRUNCATE TABLE prescription;
TRUNCATE TABLE lab_report;
TRUNCATE TABLE room_allotment;
TRUNCATE TABLE death_reports;
TRUNCATE TABLE birth_report;
TRUNCATE TABLE contact;
TRUNCATE TABLE appointments;  -- ✅ Correct plural name
TRUNCATE TABLE patients;
TRUNCATE TABLE doctor;
TRUNCATE TABLE department;
TRUNCATE TABLE medicine;

SET REFERENTIAL_INTEGRITY TRUE;

-- ==========================================================
-- 🏥 DEPARTMENTS
-- ==========================================================
INSERT INTO department (id, name, head, staff_count, services_offered, status) VALUES
(1, 'Cardiology', 'Dr. Ayesha Khan', 8, 4, 'Active'),
(2, 'Neurology', 'Dr. Rajesh Sharma', 6, 3, 'Active'),
(3, 'Pediatrics', 'Dr. Emily Rodriguez', 10, 3, 'Active'),
(4, 'Orthopedics', 'Dr. James Wilson', 7, 3, 'Active'),
(5, 'Dermatology', 'Dr. Lisa Thompson', 4, 2, 'Active');

-- ==========================================================
-- 🩺 DOCTORS (Linked to departments)
-- ==========================================================
INSERT INTO doctor (id, name, email, phone, qualification, specialization, department_id) VALUES
(1, 'Dr. Ayesha Khan', 'ayesha.khan@example.com', '9876543210', 'MBBS, MD', 'Cardiology', 1),
(2, 'Dr. Rajesh Sharma', 'rajesh.sharma@example.com', '9123456780', 'MBBS, MD', 'Neurology', 2),
(3, 'Dr. Emily Rodriguez', 'emily.rodriguez@example.com', '9988776655', 'MBBS, DCH', 'Pediatrics', 3),
(4, 'Dr. James Wilson', 'james.wilson@example.com', '9090909090', 'MS, Ortho', 'Orthopedics', 4),
(5, 'Dr. Lisa Thompson', 'lisa.thompson@example.com', '9876501234', 'MBBS, DDVL', 'Dermatology', 5);

-- ==========================================================
-- 👩‍⚕️ PATIENTS (Linked with doctor_id)
-- ==========================================================
INSERT INTO patients (
  id, name, age, gender, email, phone, dob, address, city, state, country,
  blood_group, marital_status, medical_history, allergies, current_medications,
  emergency_contact_name, emergency_contact_number, relationship_to_patient,
  insurance_provider, insurance_policy_number, doctor_id
) VALUES
(1, 'Anita Verma', 32, 'Female', 'anita.verma@example.com', '9001234567', '1993-03-15',
 '12 Civil Lines', 'Agra', 'Uttar Pradesh', 'India', 'A+', 'Married',
 'Asthma since 2018', 'Dust', 'Inhaler', 'Rajesh Verma', '9876500001', 'Husband',
 'CareHealth', 'CH12345', 1),

(2, 'Vikram Singh', 45, 'Male', 'vikram.singh@example.com', '9007654321', '1980-07-20',
 'B-25 Sector 12', 'Noida', 'Uttar Pradesh', 'India', 'B+', 'Married',
 'Hypertension', 'Penicillin', 'Atenolol', 'Sunita Singh', '9811122233', 'Wife',
 'ICICI Lombard', 'IL98765', 2),

(3, 'Priya Sharma', 28, 'Female', 'priya.sharma@example.com', '9888899999', '1997-02-22',
 'B-56 MG Road', 'Jaipur', 'Rajasthan', 'India', 'O+', 'Single',
 'None', 'None', 'None', 'Ramesh Sharma', '9898000000', 'Father',
 'Star Health', 'SH55555', 3),

(4, 'Rohit Mehta', 50, 'Male', 'rohit.mehta@example.com', '9777788888', '1975-09-25',
 'C-14 Green Park', 'Delhi', 'Delhi', 'India', 'AB+', 'Married',
 'Arthritis', 'None', 'Painkillers', 'Meena Mehta', '9777700000', 'Wife',
 'HDFC ERGO', 'HE24680', 4);

-- ==========================================================
-- 📅 APPOINTMENTS (With Token/Serial Numbers)
-- ==========================================================
INSERT INTO appointments (id, appointment_date, status, problem, serial_no, department_id, doctor_id, patient_id) VALUES
(1, '2025-10-22 10:00:00', 'Active', 'Chest pain and shortness of breath', 'CAR-001', 1, 1, 1),
(2, '2025-10-22 11:00:00', 'Active', 'Frequent headaches', 'NEU-001', 2, 2, 2),
(3, '2025-10-23 09:30:00', 'Completed', 'Routine child vaccination', 'PED-001', 3, 3, 3),
(4, '2025-10-23 10:45:00', 'Active', 'Joint pain and stiffness', 'ORT-001', 4, 4, 4);

-- ==========================================================
-- 💳 BILLS
-- ==========================================================
INSERT INTO bills (
  id, invoice_number, bill_date,
  total_before_tax, total_tax, total_discount, grand_total,
  patient_id, doctor_id
) VALUES
(1, 'INV-1001', '2025-10-22 10:00:00', 500.00, 25.00, 0.00, 525.00, 1, 1),
(2, 'INV-1002', '2025-10-22 11:30:00', 12000.00, 600.00, 1260.00, 11340.00, 2, 2),
(3, 'INV-1003', '2025-10-23 09:00:00', 750.00, 0.00, 0.00, 750.00, 3, 3),
(4, 'INV-1004', '2025-10-23 10:30:00', 2500.00, 200.00, 0.00, 2700.00, 4, 4);

-- ==========================================================
-- 🧾 BILL ITEMS
-- ==========================================================
INSERT INTO bill_items (id, bill_id, description, unit_price, quantity, tax_percent, discount_percent, sub_total) VALUES 
(1, 1, 'Cardiology Consultation', 300.00, 1, 5.0, 0.0, 315.00),
(2, 1, 'Blood Sugar Test', 200.00, 1, 5.0, 0.0, 210.00),
(3, 2, 'Emergency Surgery Fee', 8000.00, 1, 5.0, 10.0, 7560.00),
(4, 2, 'ICU Daily Charge (3 days)', 4000.00, 1, 5.0, 10.0, 3780.00),
(5, 3, 'Pediatrics Follow-up', 500.00, 1, 0.0, 0.0, 500.00),
(6, 3, 'Paracetamol (Pharmacy)', 250.00, 1, 0.0, 0.0, 250.00),
(7, 4, 'Private Room Charge (2 days)', 1000.00, 2, 8.0, 0.0, 2160.00),
(8, 4, 'Orthopedics X-Ray', 500.00, 1, 8.0, 0.0, 540.00);

-- ==========================================================
-- 🧪 LAB REPORTS
-- ==========================================================
INSERT INTO lab_report (id, test_name, result, notes, report_date, patient_id) VALUES
(1, 'Blood Sugar', 'Normal', 'Fasting test', '2025-10-22', 1),
(2, 'MRI Brain', 'No issues', 'Follow-up required', '2025-10-22', 2),
(3, 'Cholesterol', 'Slightly High', 'Diet control advised', '2025-10-23', 3),
(4, 'X-Ray Chest', 'Normal', 'Routine checkup', '2025-10-23', 4);

-- ==========================================================
-- 💊 PRESCRIPTIONS
-- ==========================================================
INSERT INTO prescription (id, medicine, dosage, instructions, date, patient_id, doctor_id) VALUES
(1, 'Metformin', '500mg', 'Twice daily with meals.', NOW(), 1, 1),
(2, 'Vitamin B12', '1000mcg', 'Once daily in the morning.', NOW(), 2, 2),
(3, 'Paracetamol', '500mg', 'Take one tablet every 6 hours.', NOW(), 3, 3),
(4, 'Amoxicillin', '250mg', 'Twice daily after meals.', NOW(), 4, 4);

-- ==========================================================
-- 💉 MEDICINES
-- ==========================================================
INSERT INTO medicine (id, name, manufacturer, batch_number, expiry_date, composition, type, description, price, stock_quantity) VALUES
(1, 'Paracetamol 500mg', 'Cipla Ltd', 'BATCH001', '2026-01-15', 'Paracetamol IP 500mg', 'Tablet', 'Used for fever and mild pain relief', 25.00, 100),
(2, 'Amoxicillin 250mg', 'Sun Pharma', 'BATCH002', '2026-03-10', 'Amoxicillin Trihydrate 250mg', 'Capsule', 'Used for bacterial infections', 60.00, 200),
(3, 'Cetirizine 10mg', 'Dr. Reddy''s', 'BATCH003', '2026-05-01', 'Cetirizine Hydrochloride 10mg', 'Tablet', 'Used for allergy and cold relief', 15.00, 150),
(4, 'Omeprazole 20mg', 'Zydus Healthcare', 'BATCH004', '2026-07-20', 'Omeprazole 20mg', 'Capsule', 'Used to treat acidity and ulcers', 40.00, 120),
(5, 'Azithromycin 500mg', 'Lupin Ltd', 'BATCH005', '2026-09-15', 'Azithromycin Dihydrate 500mg', 'Tablet', 'Used for respiratory and skin infections', 85.00, 80);

-- ==========================================================
-- 📇 CONTACTS
-- ==========================================================
INSERT INTO contact (id, name, email, phone, company, category, created_at) VALUES
(1, 'Contact 1', 'contact1@example.com', '+91 9876540001', 'MedTech Pvt Ltd', 'Client', '2025-11-01 10:00:00'),
(2, 'Contact 2', 'contact2@example.com', '+91 9876540002', 'CareWell Labs', 'Vendor', '2025-10-31 14:00:00'),
(3, 'Contact 3', 'contact3@example.com', '+91 9876540003', 'Global Diagnostics', 'Partner', '2025-10-30 09:30:00'),
(4, 'Contact 4', 'contact4@example.com', '+91 9876540004', 'City Hospital', 'Employee', '2025-10-29 16:00:00'),
(5, 'Contact 5', 'contact5@example.com', '+91 9876540005', 'Medico Support', 'Other', '2025-10-28 11:00:00');

-- ==========================================================
-- 👶 BIRTH REPORTS
-- ==========================================================
INSERT INTO birth_report (id, baby_name, mother_name, father_name, gender, birth_date_time, doctor_name, remarks) VALUES
(1, 'Aarav Verma', 'Anita Verma', 'Rohit Verma', 'Male', '2025-10-22 06:45:00', 'Dr. Emily Rodriguez', 'Healthy baby, normal delivery'),
(2, 'Meera Sharma', 'Priya Sharma', 'Rajat Sharma', 'Female', '2025-10-23 11:20:00', 'Dr. Emily Rodriguez', 'Healthy baby, C-section delivery');

-- ==========================================================
-- ⚰️ DEATH REPORTS
-- ==========================================================
INSERT INTO death_reports (id, patient_name, gender, cause_of_death, doctor_name, ward, date_of_death, remarks, created_at) VALUES
(1, 'Vikram Singh', 'Male', 'Cardiac Arrest', 'Dr. Ayesha Khan', 'ICU - 1', '2025-10-28 22:10:00', 'Patient suffered cardiac arrest.', '2025-10-29 10:00:00');

-- ==========================================================
-- 🏨 ROOM ALLOTMENTS
-- ==========================================================
INSERT INTO room_allotment (id, room_number, patient_name, room_type, doctor_in_charge, admission_date, discharge_date, status) VALUES
(1, '101', 'Anita Verma', 'Private', 'Dr. Ayesha Khan', '2025-10-20', '2025-10-25', 'Discharged'),
(2, '102', 'Vikram Singh', 'ICU', 'Dr. Rajesh Sharma', '2025-10-21', NULL, 'Occupied');

-- ==========================================================
-- 🔧 RESET AUTO-INCREMENTS (H2-compatible)
-- ==========================================================
ALTER TABLE bills ALTER COLUMN id RESTART WITH 5;
ALTER TABLE bill_items ALTER COLUMN id RESTART WITH 9;
ALTER TABLE patients ALTER COLUMN id RESTART WITH 5;
ALTER TABLE doctor ALTER COLUMN id RESTART WITH 6;
ALTER TABLE appointments ALTER COLUMN id RESTART WITH 5;
ALTER TABLE department ALTER COLUMN id RESTART WITH 6;
