-- Doctors
INSERT INTO doctor (name, email, phone, qualification, specialization) VALUES
('Dr. Ayesha Khan', 'ayesha.khan@example.com', '9876543210', 'MBBS', 'Cardiology'),
('Dr. Rajesh Sharma', 'rajesh.sharma@example.com', '9123456780', 'MD', 'Neurology');

-- Patients
INSERT INTO patient (name, age, gender, email, phone) VALUES
('Anita Verma', 28, 'Female', 'anita.verma@example.com', '9001234567'),
('Vikram Singh', 35, 'Male', 'vikram.singh@example.com', '9007654321');

-- Appointments
INSERT INTO appointment (appointment_date, status, doctor_id, patient_id) VALUES
('2025-10-22T10:00:00', 'Scheduled', 1, 1),
('2025-10-22T11:00:00', 'Scheduled', 2, 2);

-- Bills
INSERT INTO bill (amount, bill_date, status, patient_id) VALUES
(500.00, '2025-10-22T00:00:00', 'Paid', 1),
(1200.00, '2025-10-22T00:00:00', 'Pending', 2);

-- Lab Reports
INSERT INTO lab_report (test_name, result, notes, report_date, patient_id) VALUES
('Blood Sugar', 'Normal', 'Fasting test', '2025-10-22T00:00:00', 1),
('MRI Brain', 'No issues', 'Follow-up required', '2025-10-22T00:00:00', 2);

-- Prescriptions
-- CORRECTED: 
-- 1. Changed 'notes' to 'instructions' (to match the JPA entity field).
-- 2. Added 'date' column (to match the JPA entity field).
-- 3. Changed 'appointment_id' to 'patient_id' and 'doctor_id' (to match the JPA entity foreign keys).

INSERT INTO prescription (medicine, dosage, instructions, date, patient_id, doctor_id)
VALUES
('Metformin', '500mg', 'Twice daily with meals.', NOW(), 1, 1),
('Vitamin B12', '1000mcg', 'Once daily in the morning.', NOW(), 2, 2);