--------------------------------------------------------------
-- 🧹 CLEAN EXISTING DATA (Safe Delete Order)
--------------------------------------------------------------
SET REFERENTIAL_INTEGRITY FALSE;

DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

TRUNCATE TABLE IF EXISTS bill_items;
TRUNCATE TABLE IF EXISTS bills;
TRUNCATE TABLE IF EXISTS prescription;
TRUNCATE TABLE IF EXISTS lab_report;
TRUNCATE TABLE IF EXISTS room_allotment;
TRUNCATE TABLE IF EXISTS death_reports;
TRUNCATE TABLE IF EXISTS birth_report;
TRUNCATE TABLE IF EXISTS contact;
TRUNCATE TABLE IF EXISTS appointments;
TRUNCATE TABLE IF EXISTS patients;
TRUNCATE TABLE IF EXISTS doctor;
TRUNCATE TABLE IF EXISTS department;
TRUNCATE TABLE IF EXISTS medicine;

SET REFERENTIAL_INTEGRITY TRUE;

--------------------------------------------------------------
-- 🩺 DOCTORS (Insert FIRST because departments reference head_doctor_id)
--------------------------------------------------------------
INSERT INTO doctor (id, name, email, phone, qualification, specialization, department_id)
VALUES
(1, 'Dr. Ayesha Khan', 'ayesha.khan@example.com', '9876543210', 'MBBS, MD', 'Cardiology', NULL),
(2, 'Dr. Rajesh Sharma', 'rajesh.sharma@example.com', '9123456780', 'MBBS, MD', 'Neurology', NULL),
(3, 'Dr. Emily Rodriguez', 'emily.rodriguez@example.com', '9988776655', 'MBBS, DCH', 'Pediatrics', NULL),
(4, 'Dr. James Wilson', 'james.wilson@example.com', '9090909090', 'MS Ortho', 'Orthopedics', NULL),
(5, 'Dr. Lisa Thompson', 'lisa.thompson@example.com', '9876501234', 'MBBS, DDVL', 'Dermatology', NULL);

--------------------------------------------------------------
-- 🏥 DEPARTMENTS (Correct format for your JPA entity)
--------------------------------------------------------------
INSERT INTO department (id, name, head_doctor_id, head_name, staff_count, services_offered, status)
VALUES
(1, 'Cardiology',      1, 'Dr. Ayesha Khan',    8, 'Cardiac Checkup, ECG, Echo, Stress Test', 'Active'),
(2, 'Neurology',       2, 'Dr. Rajesh Sharma',  6, 'EEG, Brain Scan, Nerve Tests',            'Active'),
(3, 'Pediatrics',      3, 'Dr. Emily Rodriguez',10,'Child Care, Vaccination, Nutrition',      'Active'),
(4, 'Orthopedics',     4, 'Dr. James Wilson',   7, 'Bone Scan, Fracture Care, Joint Pain',    'Active'),
(5, 'Dermatology',     5, 'Dr. Lisa Thompson',  4, 'Skin Treatment, Allergy Care',            'Active');

--------------------------------------------------------------
-- 🔄 UPDATE DOCTORS WITH department_id (FK fixed)
--------------------------------------------------------------
UPDATE doctor SET department_id = 1 WHERE id = 1;
UPDATE doctor SET department_id = 2 WHERE id = 2;
UPDATE doctor SET department_id = 3 WHERE id = 3;
UPDATE doctor SET department_id = 4 WHERE id = 4;
UPDATE doctor SET department_id = 5 WHERE id = 5;

--------------------------------------------------------------
-- 👩‍⚕️ PATIENTS
--------------------------------------------------------------
INSERT INTO patients (
  id, name, age, gender, email, phone, dob, address, city, state, country,
  blood_group, marital_status, medical_history, allergies, current_medications,
  emergency_contact_name, emergency_contact_number, relationship_to_patient,
  insurance_provider, insurance_policy_number, doctor_id
)
VALUES
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

--------------------------------------------------------------
-- 📅 APPOINTMENTS
--------------------------------------------------------------
INSERT INTO appointments (
  id, appointment_date, serial_no, problem, status, remarks, fee,
  chief_complaint, planned_duration_minutes, appointment_type,
  is_follow_up, room_number, cancellation_reason,
  icd10_code, cpt_code, payment_status,
  check_in_time, check_out_time, created_at, last_modified_at, last_modified_by,
  department_id, doctor_id, patient_id
)
VALUES
(1, '2025-10-22T10:00:00', 'CAR-001', 'Chest pain and shortness of breath', 'Scheduled', NULL, 500,
 'Chest pain', 30, 'IN_PERSON', FALSE, '101', NULL,
 'R07.9', '99213', 'PAID',
 NULL, NULL, NOW(), NOW(), 'system',
 1, 1, 1),

(2, '2025-10-22T11:00:00', 'NEU-001', 'Frequent headaches', 'Scheduled', NULL, 400,
 'Severe headache', 30, 'IN_PERSON', FALSE, '202', NULL,
 'R51', '99213', 'PAID',
 NULL, NULL, NOW(), NOW(), 'system',
 2, 2, 2),

(3, '2025-10-23T09:30:00', 'PED-001', 'Routine child vaccination', 'Completed', NULL, 300,
 'Vaccination', 20, 'IN_PERSON', TRUE, '303', NULL,
 NULL, NULL, 'PENDING',
 NULL, NULL, NOW(), NOW(), 'system',
 3, 3, 3),

(4, '2025-10-23T10:45:00', 'ORT-001', 'Joint pain and stiffness', 'Scheduled', NULL, 600,
 'Joint pain', 30, 'IN_PERSON', FALSE, '404', NULL,
 'M25.50', '73560', 'PENDING',
 NULL, NULL, NOW(), NOW(), 'system',
 4, 4, 4);

--------------------------------------------------------------
-- 💳 BILLS
--------------------------------------------------------------
INSERT INTO bills (id, invoice_number, bill_date, total_before_tax, total_tax, total_discount, grand_total, patient_id, doctor_id)
VALUES
(1, 'INV-1001', '2025-10-22 10:00:00', 500, 25, 0, 525, 1, 1),
(2, 'INV-1002', '2025-10-22 11:30:00', 12000, 600, 1260, 11340, 2, 2),
(3, 'INV-1003', '2025-10-23 09:00:00', 750, 0, 0, 750, 3, 3),
(4, 'INV-1004', '2025-10-23 10:30:00', 2500, 200, 0, 2700, 4, 4);

--------------------------------------------------------------
-- 🧾 BILL ITEMS
--------------------------------------------------------------
INSERT INTO bill_items (id, bill_id, description, unit_price, quantity, tax_percent, discount_percent, sub_total)
VALUES
(1, 1, 'Cardiology Consultation', 300, 1, 5, 0, 315),
(2, 1, 'Blood Sugar Test', 200, 1, 5, 0, 210),
(3, 2, 'Emergency Surgery Fee', 8000, 1, 5, 10, 7560),
(4, 2, 'ICU Daily Charge (3 days)', 4000, 1, 5, 10, 3780),
(5, 3, 'Pediatrics Follow-up', 500, 1, 0, 0, 500),
(6, 3, 'Paracetamol (Pharmacy)', 250, 1, 0, 0, 250),
(7, 4, 'Private Room Charge (2 days)', 1000, 2, 8, 0, 2160),
(8, 4, 'Orthopedics X-Ray', 500, 1, 8, 0, 540);

--------------------------------------------------------------
-- 🧪 LAB REPORTS
--------------------------------------------------------------
INSERT INTO lab_report (id, test_name, result, notes, report_date, patient_id) VALUES
(1, 'Blood Sugar', 'Normal', 'Fasting test', '2025-10-22', 1),
(2, 'MRI Brain', 'No issues', 'Follow-up required', '2025-10-22', 2),
(3, 'Cholesterol', 'Slightly High', 'Diet control advised', '2025-10-23', 3),
(4, 'X-Ray Chest', 'Normal', 'Routine checkup', '2025-10-23', 4);

--------------------------------------------------------------
-- 💊 MEDICINES
--------------------------------------------------------------
INSERT INTO medicine (id, name, manufacturer, batch_number, expiry_date, composition, type, description, price, stock_quantity)
VALUES
(1, 'Paracetamol 500mg', 'Cipla Ltd', 'BATCH001', '2026-01-15', 'Paracetamol IP 500mg', 'Tablet', 'Used for fever & pain relief', 25, 100),
(2, 'Amoxicillin 250mg', 'Sun Pharma', 'BATCH002', '2026-03-10', 'Amoxicillin 250mg', 'Capsule', 'Used for infections', 60, 200),
(3, 'Cetirizine 10mg', 'Dr. Reddy''s', 'BATCH003', '2026-05-01', 'Cetirizine 10mg', 'Tablet', 'Used for allergy relief', 15, 150),
(4, 'Omeprazole 20mg', 'Zydus Healthcare', 'BATCH004', '2026-07-20', 'Omeprazole 20mg', 'Capsule', 'Used for acidity', 40, 120),
(5, 'Azithromycin 500mg', 'Lupin Ltd', 'BATCH005', '2026-09-15', 'Azithromycin 500mg', 'Tablet', 'Used for infections', 85, 80);

--------------------------------------------------------------
-- 📇 CONTACTS
--------------------------------------------------------------
INSERT INTO contact (id, name, email, phone, company, category, created_at)
VALUES
(100, 'Contact 1', 'contact1@example.com', '+91 9876540001', 'MedTech Pvt Ltd', 'Client', '2025-11-01 10:00:00'),
(101, 'Contact 2', 'contact2@example.com', '+91 9876540002', 'CareWell Labs', 'Vendor', '2025-10-31 14:00:00'),
(102, 'Contact 3', 'contact3@example.com', '+91 9876540003', 'Global Diagnostics', 'Partner', '2025-10-30 09:30:00'),
(103, 'Contact 4', 'contact4@example.com', '+91 9876540004', 'City Hospital', 'Employee', '2025-10-29 16:00:00'),
(104, 'Contact 5', 'contact5@example.com', '+91 9876540005', 'Medico Support', 'Other', '2025-10-28 11:00:00');

--------------------------------------------------------------
-- 👶 BIRTH REPORTS
--------------------------------------------------------------
INSERT INTO birth_report (id, baby_name, mother_name, father_name, gender, birth_date_time, doctor_name, remarks)
VALUES
(100, 'Aarav Verma', 'Anita Verma', 'Rohit Verma', 'Male', '2025-10-22 06:45:00', 'Dr. Emily Rodriguez', 'Healthy baby'),
(101, 'Meera Sharma', 'Priya Sharma', 'Rajat Sharma', 'Female', '2025-10-23 11:20:00', 'Dr. Emily Rodriguez', 'C-section delivery');

--------------------------------------------------------------
-- ⚰️ DEATH REPORTS (No sample data - auto-insert via API only)
--------------------------------------------------------------
-- Sample data removed to allow manual creation
-- Database will auto-generate IDs for new records

--------------------------------------------------------------
-- 🏨 ROOM ALLOTMENTS
--------------------------------------------------------------
INSERT INTO room_allotment (id, room_number, patient_name, room_type, doctor_in_charge, admission_date, discharge_date, status)
VALUES
(100, '101', 'Anita Verma', 'Private', 'Dr. Ayesha Khan', '2025-10-20', '2025-10-25', 'Discharged'),
(101, '102', 'Vikram Singh', 'ICU', 'Dr. Rajesh Sharma', '2025-10-21', NULL, 'Occupied');

--------------------------------------------------------------
-- 👤 USERS & ROLES
--------------------------------------------------------------
INSERT INTO roles (id, name) VALUES (1, 'ROLE_ADMIN');

INSERT INTO users (id, username, email, password)
VALUES (1, 'admin', 'admin@edata4you.com',
'$2a$10$hXKcVtEcgT2UuRzEpHybwOXqfUl47Fv8eQH2g1r0Jj3c3OEbqHEua');

INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);

--------------------------------------------------------------
-- 🔧 RESET AUTO-INCREMENTS
--------------------------------------------------------------
ALTER TABLE bills        ALTER COLUMN id RESTART WITH 5;
ALTER TABLE bill_items   ALTER COLUMN id RESTART WITH 9;
ALTER TABLE patients     ALTER COLUMN id RESTART WITH 5;
ALTER TABLE doctor       ALTER COLUMN id RESTART WITH 6;
ALTER TABLE appointments ALTER COLUMN id RESTART WITH 5;
ALTER TABLE department   ALTER COLUMN id RESTART WITH 6;
ALTER TABLE users        ALTER COLUMN id RESTART WITH 2;
ALTER TABLE roles        ALTER COLUMN id RESTART WITH 2;
ALTER TABLE medicine     ALTER COLUMN id RESTART WITH 6;
ALTER TABLE death_reports ALTER COLUMN id RESTART WITH 1;
