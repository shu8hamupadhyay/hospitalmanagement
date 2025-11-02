-- ==========================================================
-- DOCTORS
-- ==========================================================
INSERT INTO doctor (name, email, phone, qualification, specialization) VALUES
('Dr. Ayesha Khan', 'ayesha.khan@example.com', '9876543210', 'MBBS', 'Cardiology'),
('Dr. Rajesh Sharma', 'rajesh.sharma@example.com', '9123456780', 'MD', 'Neurology'),
('Dr. Emily Rodriguez', 'emily.rodriguez@example.com', '9988776655', 'MD', 'Pediatrics'),
('Dr. James Wilson', 'james.wilson@example.com', '9090909090', 'MS', 'Orthopedics'),
('Dr. Lisa Thompson', 'lisa.thompson@example.com', '9876501234', 'MD', 'Dermatology');

-- ==========================================================
-- PATIENTS (✅ includes dob)
-- ==========================================================
INSERT INTO patient (name, age, gender, email, phone, dob) VALUES
('Anita Verma', 28, 'Female', 'anita.verma@example.com', '9001234567', '1997-03-15'),
('Vikram Singh', 35, 'Male', 'vikram.singh@example.com', '9007654321', '1990-07-20'),
('Priya Sharma', 40, 'Female', 'priya.sharma@example.com', '9888899999', '1985-01-10'),
('Rohit Mehta', 50, 'Male', 'rohit.mehta@example.com', '9777788888', '1975-09-25');

-- ==========================================================
-- APPOINTMENTS
-- ==========================================================
INSERT INTO appointment (appointment_date, status, doctor_id, patient_id) VALUES
('2025-10-22 10:00:00', 'Scheduled', 1, 1),
('2025-10-22 11:00:00', 'Scheduled', 2, 2),
('2025-10-23 09:30:00', 'Completed', 3, 3),
('2025-10-23 10:45:00', 'Scheduled', 4, 4);

-- ==========================================================
-- BILLS
-- ==========================================================
INSERT INTO bill (amount, bill_date, status, patient_id) VALUES
(500.00, '2025-10-22', 'Paid', 1),
(1200.00, '2025-10-22', 'Pending', 2),
(750.00, '2025-10-23', 'Paid', 3),
(1000.00, '2025-10-23', 'Pending', 4);

-- ==========================================================
-- LAB REPORTS
-- ==========================================================
INSERT INTO lab_report (test_name, result, notes, report_date, patient_id) VALUES
('Blood Sugar', 'Normal', 'Fasting test', '2025-10-22', 1),
('MRI Brain', 'No issues', 'Follow-up required', '2025-10-22', 2),
('Cholesterol', 'Slightly High', 'Diet control advised', '2025-10-23', 3),
('X-Ray Chest', 'Normal', 'Routine checkup', '2025-10-23', 4);

-- ==========================================================
-- PRESCRIPTIONS
-- ==========================================================
INSERT INTO prescription (medicine, dosage, instructions, date, patient_id, doctor_id) VALUES
('Metformin', '500mg', 'Twice daily with meals.', NOW(), 1, 1),
('Vitamin B12', '1000mcg', 'Once daily in the morning.', NOW(), 2, 2),
('Paracetamol', '500mg', 'Take one tablet every 6 hours.', NOW(), 3, 3),
('Amoxicillin', '250mg', 'Twice daily after meals.', NOW(), 4, 4);

-- ==========================================================
-- PHARMACY / MEDICINES
-- ==========================================================
INSERT INTO medicine (name, manufacturer, batch_number, expiry_date, composition, type, description, price, stock_quantity) VALUES
('Paracetamol 500mg', 'Cipla Ltd', 'BATCH001', '2026-01-15', 'Paracetamol IP 500mg', 'Tablet', 'Used for fever and mild pain relief', 25.00, 100),
('Amoxicillin 250mg', 'Sun Pharma', 'BATCH002', '2026-03-10', 'Amoxicillin Trihydrate 250mg', 'Capsule', 'Used for bacterial infections', 60.00, 200),
('Cetirizine 10mg', 'Dr. Reddy''s', 'BATCH003', '2026-05-01', 'Cetirizine Hydrochloride 10mg', 'Tablet', 'Used for allergy and cold relief', 15.00, 150),
('Omeprazole 20mg', 'Zydus Healthcare', 'BATCH004', '2026-07-20', 'Omeprazole 20mg', 'Capsule', 'Used to treat acidity and ulcers', 40.00, 120),
('Azithromycin 500mg', 'Lupin Ltd', 'BATCH005', '2026-09-15', 'Azithromycin Dihydrate 500mg', 'Tablet', 'Used for respiratory and skin infections', 85.00, 80);

-- ==========================================================
-- DEPARTMENTS
-- ==========================================================
INSERT INTO department (name, head, staff_count, services_offered, status) VALUES
('Cardiology', 'Dr. Ayesha Khan', 8, 12, 'Active'),
('Neurology', 'Dr. Rajesh Sharma', 6, 9, 'Active'),
('Pediatrics', 'Dr. Emily Rodriguez', 10, 15, 'Active'),
('Orthopedics', 'Dr. James Wilson', 7, 11, 'Active'),
('Dermatology', 'Dr. Lisa Thompson', 4, 8, 'Active'),
('Ophthalmology', 'Dr. Robert Kim', 5, 7, 'Active'),
('Psychiatry', 'Dr. Jennifer Martinez', 6, 10, 'Active'),
('Radiology', 'Dr. David Brown', 4, 6, 'Inactive'),
('Oncology', 'Dr. Susan Lee', 7, 9, 'Active'),
('Endocrinology', 'Dr. Thomas Garcia', 3, 5, 'Inactive');

-- ==========================================================
-- CONTACTS
-- ==========================================================
INSERT INTO contact (name, email, phone, company, category, created_at) VALUES
('Contact 1', 'contact1@example.com', '+1 (555) 100-1000', 'Company 1', 'Client', '2025-11-01 10:00:00'),
('Contact 2', 'contact2@example.com', '+1 (555) 101-1001', 'Company 1', 'Vendor', '2025-10-31 14:00:00'),
('Contact 3', 'contact3@example.com', '+1 (555) 102-1002', 'Company 1', 'Partner', '2025-10-30 09:30:00'),
('Contact 4', 'contact4@example.com', '+1 (555) 103-1003', 'Company 1', 'Employee', '2025-10-29 16:00:00'),
('Contact 5', 'contact5@example.com', '+1 (555) 104-1004', 'Company 1', 'Other', '2025-10-28 11:00:00'),
('Contact 6', 'contact6@example.com', '+1 (555) 105-1005', 'Company 2', 'Client', '2025-10-27 08:30:00'),
('Contact 7', 'contact7@example.com', '+1 (555) 106-1006', 'Company 2', 'Vendor', '2025-10-26 10:45:00'),
('Contact 8', 'contact8@example.com', '+1 (555) 107-1007', 'Company 2', 'Partner', '2025-10-25 15:20:00'),
('Contact 9', 'contact9@example.com', '+1 (555) 108-1008', 'Company 2', 'Employee', '2025-10-24 13:40:00'),
('Contact 10', 'contact10@example.com', '+1 (555) 109-1009', 'Company 2', 'Other', '2025-10-23 09:10:00');

-- ==========================================================
-- BIRTH REPORTS
-- ==========================================================
INSERT INTO birth_report (baby_name, mother_name, father_name, gender, birth_date_time, doctor_name, remarks) VALUES
('Aarav Verma', 'Anita Verma', 'Rohit Verma', 'Male', '2025-10-22 06:45:00', 'Dr. Emily Rodriguez', 'Healthy baby, normal delivery'),
('Meera Sharma', 'Priya Sharma', 'Rajat Sharma', 'Female', '2025-10-23 11:20:00', 'Dr. Emily Rodriguez', 'Healthy baby, C-section delivery'),
('Ishaan Mehta', 'Neha Mehta', 'Rohit Mehta', 'Male', '2025-10-24 08:10:00', 'Dr. Emily Rodriguez', 'Normal delivery, no complications'),
('Siya Khan', 'Ayesha Khan', 'Arif Khan', 'Female', '2025-10-25 03:50:00', 'Dr. Emily Rodriguez', 'Premature baby, under observation');

-- ==========================================================
-- DEATH REPORTS
-- ==========================================================
INSERT INTO death_reports (patient_name, gender, cause_of_death, doctor_name, ward, date_of_death, remarks, created_at) VALUES
('Vikram Singh', 'Male', 'Cardiac Arrest', 'Dr. Ayesha Khan', 'ICU - 1', '2025-10-28 22:10:00', 'Patient suffered cardiac arrest despite resuscitation.', '2025-10-29 10:00:00'),
('Rohit Mehta', 'Male', 'Brain Hemorrhage', 'Dr. Rajesh Sharma', 'Neuro Ward', '2025-10-27 14:25:00', 'Severe internal bleeding, unresponsive to treatment.', '2025-10-27 16:00:00');
-- ==========================================================
-- ROOM ALLOTMENTS
-- ==========================================================
INSERT INTO room_allotment (room_number, patient_name, room_type, doctor_in_charge, admission_date, discharge_date, status) VALUES
('101', 'Anita Verma', 'Private', 'Dr. Ayesha Khan', '2025-10-20', '2025-10-25', 'Discharged'),
('102', 'Vikram Singh', 'ICU', 'Dr. Rajesh Sharma', '2025-10-21', NULL, 'Occupied'),
('103', 'Priya Sharma', 'General', 'Dr. Emily Rodriguez', '2025-10-22', '2025-10-28', 'Cleaning'),
('104', 'Rohit Mehta', 'Private', 'Dr. James Wilson', '2025-10-19', '2025-10-24', 'Available'),
('105', 'Sanjay Patel', 'General', 'Dr. Lisa Thompson', '2025-10-23', NULL, 'Occupied'),
('201', 'Pooja Reddy', 'Private', 'Dr. Ayesha Khan', '2025-10-25', NULL, 'Occupied'),
('202', 'Ravi Malhotra', 'General', 'Dr. Rajesh Sharma', '2025-10-26', '2025-10-30', 'Cleaning'),
('203', 'Neha Mehta', 'ICU', 'Dr. Emily Rodriguez', '2025-10-27', NULL, 'Occupied'),
('301', 'Deepa Joshi', 'Private', 'Dr. James Wilson', '2025-10-20', '2025-10-23', 'Available'),
('302', 'Arun Gupta', 'General', 'Dr. Lisa Thompson', '2025-10-29', NULL, 'Occupied');
