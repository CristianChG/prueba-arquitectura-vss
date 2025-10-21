-- Database Initialization Script for Vacas Application
-- This script creates dummy data for testing and development purposes

-- Clean up existing data (in reverse order of foreign key dependencies)
TRUNCATE TABLE models CASCADE;
TRUNCATE TABLE datasets CASCADE;
TRUNCATE TABLE cows CASCADE;
TRUNCATE TABLE users CASCADE;

-- Insert dummy users with bcrypt hashed passwords
-- Password for all users: 'Password123'
-- Hash generated with bcrypt for 'Password123': $2b$12$Jw.olYu4URzx9.YpMcMTZutNI.vXPW7OeQxYUt2uuGGjr1fPT/4q2
INSERT INTO users (id, email, name, password_hash, role, created_at, updated_at) VALUES
    ('user-001', 'admin@vacas.com', 'Admin User', '$2b$12$Jw.olYu4URzx9.YpMcMTZutNI.vXPW7OeQxYUt2uuGGjr1fPT/4q2', 'ADMIN', NOW(), NOW()),
    ('user-002', 'researcher@vacas.com', 'Dr. Maria Rodriguez', '$2b$12$Jw.olYu4URzx9.YpMcMTZutNI.vXPW7OeQxYUt2uuGGjr1fPT/4q2', 'RESEARCHER', NOW(), NOW()),
    ('user-003', 'farmer@vacas.com', 'John Smith', '$2b$12$Jw.olYu4URzx9.YpMcMTZutNI.vXPW7OeQxYUt2uuGGjr1fPT/4q2', 'USER', NOW(), NOW()),
    ('user-004', 'jane.doe@vacas.com', 'Jane Doe', '$2b$12$Jw.olYu4URzx9.YpMcMTZutNI.vXPW7OeQxYUt2uuGGjr1fPT/4q2', 'USER', NOW(), NOW()),
    ('user-005', 'carlos.garcia@vacas.com', 'Carlos Garcia', '$2b$12$Jw.olYu4URzx9.YpMcMTZutNI.vXPW7OeQxYUt2uuGGjr1fPT/4q2', 'RESEARCHER', NOW(), NOW());

-- Insert dummy cows
INSERT INTO cows (id, name, breed, birth_date, owner_id, health_status, last_checkup, notes, created_at, updated_at) VALUES
    ('cow-001', 'Bessie', 'Holstein', '2020-03-15', 'user-003', 'Healthy', '2025-10-15 10:30:00', 'Regular milking schedule, good appetite', NOW(), NOW()),
    ('cow-002', 'Daisy', 'Jersey', '2019-07-22', 'user-003', 'Healthy', '2025-10-14 14:20:00', 'Excellent milk production', NOW(), NOW()),
    ('cow-003', 'Moo-Moo', 'Angus', '2021-01-10', 'user-004', 'Under Observation', '2025-10-18 09:15:00', 'Slight limp on right hind leg, monitoring', NOW(), NOW()),
    ('cow-004', 'Bella', 'Holstein', '2020-11-05', 'user-003', 'Healthy', '2025-10-12 11:00:00', 'Recently vaccinated', NOW(), NOW()),
    ('cow-005', 'Luna', 'Guernsey', '2022-04-18', 'user-004', 'Healthy', '2025-10-16 15:45:00', 'Young heifer, first pregnancy expected', NOW(), NOW()),
    ('cow-006', 'Rosie', 'Brown Swiss', '2019-09-30', 'user-003', 'Healthy', '2025-10-10 08:30:00', 'Veteran cow, consistent milk producer', NOW(), NOW()),
    ('cow-007', 'Molly', 'Holstein', '2021-06-12', 'user-004', 'Sick', '2025-10-20 16:00:00', 'Respiratory infection, on antibiotics', NOW(), NOW()),
    ('cow-008', 'Buttercup', 'Jersey', '2020-02-28', 'user-003', 'Healthy', '2025-10-11 13:20:00', 'High butterfat content in milk', NOW(), NOW());

-- Insert dummy datasets
INSERT INTO datasets (id, name, file_path, file_size, uploaded_by, status, created_at, processed_at, meta) VALUES
    ('dataset-001', 'Milk Production Q1 2025', '/data/milk_production_q1_2025.csv', 2458624, 'user-002', 'processed', '2025-04-01 09:00:00', '2025-04-01 10:15:00', '{"rows": 15000, "columns": 12, "format": "csv"}'),
    ('dataset-002', 'Health Records 2024', '/data/health_records_2024.csv', 5234567, 'user-002', 'processed', '2025-01-15 14:30:00', '2025-01-15 15:45:00', '{"rows": 32000, "columns": 18, "format": "csv"}'),
    ('dataset-003', 'Breeding Data', '/data/breeding_data.csv', 1845632, 'user-005', 'processed', '2025-05-20 11:20:00', '2025-05-20 12:00:00', '{"rows": 8500, "columns": 10, "format": "csv"}'),
    ('dataset-004', 'Weather Impact Study', '/data/weather_impact.csv', 3567890, 'user-002', 'processing', '2025-10-18 16:45:00', NULL, '{"rows": 22000, "columns": 15, "format": "csv"}'),
    ('dataset-005', 'Feed Efficiency Analysis', '/data/feed_efficiency.csv', 4123456, 'user-005', 'uploaded', '2025-10-20 08:00:00', NULL, '{"rows": 18000, "columns": 14, "format": "csv"}');

-- Insert dummy ML models
INSERT INTO models (id, name, version, model_type, accuracy, dataset_id, trained_by, status, created_at, trained_at, model_path, parameters) VALUES
    ('model-001', 'Milk Yield Predictor', 'v1.0', 'RandomForest', 0.87, 'dataset-001', 'user-002', 'deployed', '2025-04-02 10:00:00', '2025-04-02 14:30:00', '/models/milk_yield_v1.pkl', '{"n_estimators": 100, "max_depth": 10, "min_samples_split": 5}'),
    ('model-002', 'Disease Detection Model', 'v2.1', 'NeuralNetwork', 0.92, 'dataset-002', 'user-002', 'deployed', '2025-02-01 09:15:00', '2025-02-01 18:45:00', '/models/disease_detection_v2.h5', '{"layers": [128, 64, 32], "dropout": 0.3, "learning_rate": 0.001}'),
    ('model-003', 'Breeding Success Predictor', 'v1.0', 'GradientBoosting', 0.84, 'dataset-003', 'user-005', 'deployed', '2025-06-01 11:00:00', '2025-06-01 16:20:00', '/models/breeding_v1.pkl', '{"n_estimators": 200, "learning_rate": 0.05, "max_depth": 8}'),
    ('model-004', 'Weather Impact Analyzer', 'v1.0', 'LinearRegression', 0.78, 'dataset-004', 'user-002', 'training', '2025-10-19 09:00:00', NULL, NULL, '{"fit_intercept": true, "normalize": false}'),
    ('model-005', 'Feed Optimization Model', 'v1.0', 'SVM', NULL, 'dataset-005', 'user-005', 'pending', '2025-10-20 10:30:00', NULL, NULL, '{"kernel": "rbf", "C": 1.0, "gamma": "scale"}'),
    ('model-006', 'Milk Yield Predictor', 'v2.0', 'XGBoost', 0.91, 'dataset-001', 'user-002', 'testing', '2025-07-15 14:00:00', '2025-07-15 20:30:00', '/models/milk_yield_v2.pkl', '{"n_estimators": 150, "max_depth": 12, "learning_rate": 0.1, "subsample": 0.8}');

-- Display summary of inserted data
SELECT 'Data initialization completed successfully!' as status;
SELECT 'Users: ' || COUNT(*) as summary FROM users;
SELECT 'Cows: ' || COUNT(*) as summary FROM cows;
SELECT 'Datasets: ' || COUNT(*) as summary FROM datasets;
SELECT 'Models: ' || COUNT(*) as summary FROM models;

-- Note: Default password for all users is 'Password123'
-- User accounts created:
-- 1. admin@vacas.com (admin)
-- 2. researcher@vacas.com (researcher)
-- 3. farmer@vacas.com (user)
-- 4. jane.doe@vacas.com (user)
-- 5. carlos.garcia@vacas.com (researcher)
