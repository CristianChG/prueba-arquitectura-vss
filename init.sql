-- Database Initialization Script for Vacas Application
-- This script creates tables and dummy data for testing and development purposes

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    role INTEGER NOT NULL DEFAULT 3
);

CREATE TABLE IF NOT EXISTS cows (
    id SERIAL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS datasets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    cow_id INTEGER NOT NULL REFERENCES cows(id),
    name VARCHAR NOT NULL,
    blob_route VARCHAR NOT NULL,
    upload_date TIMESTAMP NOT NULL,
    cleaning_state VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS models (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    name VARCHAR NOT NULL,
    description VARCHAR,
    blob_route VARCHAR NOT NULL,
    metadata JSONB
);

CREATE TABLE IF NOT EXISTS predictions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    cow_id INTEGER NOT NULL REFERENCES cows(id),
    model_id INTEGER NOT NULL REFERENCES models(id),
    dataset_id INTEGER NOT NULL REFERENCES datasets(id),
    date TIMESTAMP NOT NULL,
    result JSONB NOT NULL,
    state VARCHAR NOT NULL
);

-- Clean up existing data (in reverse order of foreign key dependencies)
TRUNCATE TABLE predictions, models, datasets, cows, users RESTART IDENTITY CASCADE;

-- Insert dummy users with bcrypt hashed passwords
-- Password for all users: 'Password123'
-- Hash generated with bcrypt: $2b$12$Jw.olYu4URzx9.YpMcMTZutNI.vXPW7OeQxYUt2uuGGjr1fPT/4q2
-- Roles: 1=ADMIN, 2=COLAB, 3=PENDING_APPROVAL
INSERT INTO users (name, email, password, role) VALUES
    ('Admin User', 'admin@vacas.com', '$2b$12$Jw.olYu4URzx9.YpMcMTZutNI.vXPW7OeQxYUt2uuGGjr1fPT/4q2', 1),
    ('Dr. Maria Rodriguez', 'researcher@vacas.com', '$2b$12$Jw.olYu4URzx9.YpMcMTZutNI.vXPW7OeQxYUt2uuGGjr1fPT/4q2', 2),
    ('John Smith', 'farmer@vacas.com', '$2b$12$Jw.olYu4URzx9.YpMcMTZutNI.vXPW7OeQxYUt2uuGGjr1fPT/4q2', 2),
    ('Jane Doe', 'jane.doe@vacas.com', '$2b$12$Jw.olYu4URzx9.YpMcMTZutNI.vXPW7OeQxYUt2uuGGjr1fPT/4q2', 2),
    ('Carlos Garcia', 'carlos.garcia@vacas.com', '$2b$12$Jw.olYu4URzx9.YpMcMTZutNI.vXPW7OeQxYUt2uuGGjr1fPT/4q2', 2),
    ('Pending User', 'pending@vacas.com', '$2b$12$Jw.olYu4URzx9.YpMcMTZutNI.vXPW7OeQxYUt2uuGGjr1fPT/4q2', 3);

-- Insert dummy cows (only ID, no additional fields)
INSERT INTO cows DEFAULT VALUES;
INSERT INTO cows DEFAULT VALUES;
INSERT INTO cows DEFAULT VALUES;
INSERT INTO cows DEFAULT VALUES;
INSERT INTO cows DEFAULT VALUES;
INSERT INTO cows DEFAULT VALUES;
INSERT INTO cows DEFAULT VALUES;
INSERT INTO cows DEFAULT VALUES;
INSERT INTO cows DEFAULT VALUES;
INSERT INTO cows DEFAULT VALUES;

-- Insert dummy datasets
-- cleaning_state: 'uploaded', 'cleaning', 'cleaned', 'failed'
INSERT INTO datasets (user_id, cow_id, name, blob_route, upload_date, cleaning_state) VALUES
    (2, 1, 'Milk Production Q1 2025', 's3://vss-datasets/milk_production_q1_2025.csv', '2025-04-01 09:00:00', 'cleaned'),
    (2, 2, 'Health Records 2024', 's3://vss-datasets/health_records_2024.csv', '2025-01-15 14:30:00', 'cleaned'),
    (3, 3, 'Breeding Data Cow 3', 's3://vss-datasets/breeding_data_cow3.csv', '2025-05-20 11:20:00', 'cleaned'),
    (2, 4, 'Weather Impact Study', 's3://vss-datasets/weather_impact.csv', '2025-10-18 16:45:00', 'cleaning'),
    (5, 5, 'Feed Efficiency Analysis', 's3://vss-datasets/feed_efficiency_cow5.csv', '2025-10-20 08:00:00', 'uploaded'),
    (3, 1, 'Milk Quality Dataset', 's3://vss-datasets/milk_quality_cow1.csv', '2025-06-15 10:30:00', 'cleaned'),
    (4, 6, 'Cow 6 Activity Monitoring', 's3://vss-datasets/activity_cow6.csv', '2025-07-10 13:45:00', 'cleaned'),
    (2, 7, 'Disease Symptoms Dataset', 's3://vss-datasets/disease_symptoms_cow7.csv', '2025-08-05 09:15:00', 'cleaned'),
    (5, 8, 'Nutrition Analysis Cow 8', 's3://vss-datasets/nutrition_cow8.csv', '2025-09-12 11:00:00', 'cleaning'),
    (3, 2, 'Temperature Monitoring', 's3://vss-datasets/temperature_cow2.csv', '2025-10-22 14:20:00', 'failed');

-- Insert dummy ML models
INSERT INTO models (user_id, name, description, blob_route, metadata) VALUES
    (2, 'Milk Yield Predictor v1.0', 'Random Forest model for predicting daily milk yield based on environmental and health factors', 's3://vss-models/milk_yield_v1.pkl', '{"algorithm": "RandomForest", "n_estimators": 100, "max_depth": 10, "accuracy": 0.87, "trained_on": "2025-04-02"}'),
    (2, 'Disease Detection Model v2.1', 'Neural Network for early disease detection based on behavioral and physiological patterns', 's3://vss-models/disease_detection_v2.h5', '{"algorithm": "NeuralNetwork", "layers": [128, 64, 32], "dropout": 0.3, "accuracy": 0.92, "trained_on": "2025-02-01"}'),
    (5, 'Breeding Success Predictor v1.0', 'Gradient Boosting model to predict breeding success probability', 's3://vss-models/breeding_v1.pkl', '{"algorithm": "GradientBoosting", "n_estimators": 200, "learning_rate": 0.05, "accuracy": 0.84, "trained_on": "2025-06-01"}'),
    (3, 'Feed Optimization Model v1.0', 'Support Vector Machine for optimizing feed composition and timing', 's3://vss-models/feed_optimization_v1.pkl', '{"algorithm": "SVM", "kernel": "rbf", "C": 1.0, "accuracy": 0.79, "trained_on": "2025-07-15"}'),
    (2, 'Milk Yield Predictor v2.0', 'Improved XGBoost model with higher accuracy and faster inference', 's3://vss-models/milk_yield_v2.pkl', '{"algorithm": "XGBoost", "n_estimators": 150, "max_depth": 12, "learning_rate": 0.1, "accuracy": 0.91, "trained_on": "2025-08-20"}'),
    (4, 'Activity Pattern Analyzer v1.0', 'LSTM model for analyzing cow activity patterns and detecting anomalies', 's3://vss-models/activity_pattern_v1.h5', '{"algorithm": "LSTM", "layers": [64, 32], "sequence_length": 24, "accuracy": 0.88, "trained_on": "2025-09-10"}');

-- Insert dummy predictions
-- prediction state: 'pending', 'processing', 'completed', 'failed'
INSERT INTO predictions (user_id, cow_id, model_id, dataset_id, date, result, state) VALUES
    (2, 1, 1, 1, '2025-10-21 08:30:00', '{"predicted_yield": 28.5, "confidence": 0.89, "factors": {"temperature": 18, "humidity": 65, "feed_quality": "high"}}', 'completed'),
    (2, 2, 2, 2, '2025-10-21 09:15:00', '{"disease_probability": 0.12, "risk_level": "low", "recommended_action": "routine_checkup"}', 'completed'),
    (3, 3, 3, 3, '2025-10-21 10:00:00', '{"breeding_success_probability": 0.78, "optimal_timing": "2025-11-15", "health_score": 0.92}', 'completed'),
    (2, 4, 1, 4, '2025-10-21 11:30:00', '{"predicted_yield": 25.3, "confidence": 0.85, "factors": {"temperature": 22, "humidity": 70, "feed_quality": "medium"}}', 'completed'),
    (5, 5, 4, 5, '2025-10-21 13:00:00', '{"optimal_feed_mix": {"hay": 45, "grain": 30, "supplements": 25}, "expected_improvement": 0.15}', 'processing'),
    (3, 1, 5, 6, '2025-10-21 14:45:00', '{"predicted_yield": 29.8, "confidence": 0.93, "factors": {"temperature": 19, "humidity": 60, "feed_quality": "high"}}', 'completed'),
    (4, 6, 6, 7, '2025-10-21 15:20:00', '{"activity_level": "normal", "anomalies_detected": 0, "health_indicators": {"movement": 0.95, "rest": 0.88}}', 'completed'),
    (2, 7, 2, 8, '2025-10-21 16:10:00', '{"disease_probability": 0.67, "risk_level": "medium", "recommended_action": "immediate_checkup", "symptoms": ["reduced_activity", "temperature_elevation"]}', 'completed'),
    (5, 8, 4, 9, '2025-10-22 08:00:00', '{"optimal_feed_mix": {"hay": 50, "grain": 25, "supplements": 25}, "expected_improvement": 0.12}', 'processing'),
    (3, 2, 1, 10, '2025-10-22 09:30:00', '{}', 'failed'),
    (2, 3, 5, 3, '2025-10-22 10:15:00', '{"predicted_yield": 26.7, "confidence": 0.90, "factors": {"temperature": 20, "humidity": 62, "feed_quality": "high"}}', 'completed'),
    (4, 4, 6, 4, '2025-10-22 11:00:00', '{"activity_level": "high", "anomalies_detected": 0, "health_indicators": {"movement": 0.98, "rest": 0.85}}', 'completed'),
    (2, 5, 2, 5, '2025-10-22 13:45:00', '{"disease_probability": 0.08, "risk_level": "low", "recommended_action": "monitor"}', 'completed'),
    (3, 6, 3, 7, '2025-10-22 14:30:00', '{"breeding_success_probability": 0.82, "optimal_timing": "2025-11-20", "health_score": 0.94}', 'completed'),
    (5, 7, 4, 8, '2025-10-22 15:00:00', '{"optimal_feed_mix": {"hay": 40, "grain": 35, "supplements": 25}, "expected_improvement": 0.18}', 'completed'),
    (2, 8, 1, 9, '2025-10-23 08:30:00', '{}', 'pending');

-- Display summary of inserted data
SELECT 'Data initialization completed successfully!' as status;
SELECT 'Users: ' || COUNT(*) as summary FROM users;
SELECT 'Cows: ' || COUNT(*) as summary FROM cows;
SELECT 'Datasets: ' || COUNT(*) as summary FROM datasets;
SELECT 'Models: ' || COUNT(*) as summary FROM models;
SELECT 'Predictions: ' || COUNT(*) as summary FROM predictions;

-- Note: Default password for all users is 'Password123'
-- User accounts created:
-- 1. admin@vacas.com (role: 1 - ADMIN)
-- 2. researcher@vacas.com (role: 2 - COLAB)
-- 3. farmer@vacas.com (role: 2 - COLAB)
-- 4. jane.doe@vacas.com (role: 2 - COLAB)
-- 5. carlos.garcia@vacas.com (role: 2 - COLAB)
-- 6. pending@vacas.com (role: 3 - PENDING_APPROVAL)
