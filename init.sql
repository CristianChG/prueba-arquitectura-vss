-- Database Initialization Script for Vacas Application
-- This script creates tables and dummy data for testing and development purposes

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    role INTEGER NOT NULL DEFAULT 3,
    reset_code VARCHAR,
    reset_code_expires TIMESTAMP
);

-- Global Hato snapshots table
CREATE TABLE IF NOT EXISTS global_hato (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nombre VARCHAR NOT NULL,
    fecha_snapshot DATE NOT NULL,
    total_animales INTEGER NOT NULL,
    grupos_detectados INTEGER NOT NULL,
    blob_route VARCHAR,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Cows table with CSV fields for Global Hato snapshots
CREATE TABLE IF NOT EXISTS cows (
    id SERIAL PRIMARY KEY,
    global_hato_id INTEGER REFERENCES global_hato(id) ON DELETE CASCADE,
    numero_animal VARCHAR,
    nombre_grupo VARCHAR,
    produccion_leche_ayer NUMERIC(10, 2),
    produccion_media_7dias NUMERIC(10, 2),
    estado_reproduccion VARCHAR,
    dias_ordeno INTEGER,
    numero_seleccion VARCHAR,
    recomendacion INTEGER
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_global_hato_user_id ON global_hato(user_id);
CREATE INDEX IF NOT EXISTS idx_cows_global_hato_id ON cows(global_hato_id);

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
TRUNCATE TABLE predictions, models, datasets, cows, global_hato, users RESTART IDENTITY CASCADE;

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

-- Note: Cows will be created when Global Hato snapshots are uploaded
-- No dummy cow data inserted as cows now contain snapshot-specific data

-- Note: Datasets and predictions dummy data commented out as they depend on cows
-- which are now created dynamically with Global Hato snapshots
-- Future: Add sample Global Hato with cows for testing

-- INSERT INTO datasets (user_id, cow_id, name, blob_route, upload_date, cleaning_state) VALUES
--     (2, 1, 'Milk Production Q1 2025', 's3://vss-datasets/milk_production_q1_2025.csv', '2025-04-01 09:00:00', 'cleaned');

-- Insert dummy ML models
INSERT INTO models (user_id, name, description, blob_route, metadata) VALUES
    (2, 'Milk Yield Predictor v1.0', 'Random Forest model for predicting daily milk yield based on environmental and health factors', 's3://vss-models/milk_yield_v1.pkl', '{"algorithm": "RandomForest", "n_estimators": 100, "max_depth": 10, "accuracy": 0.87, "trained_on": "2025-04-02"}'),
    (2, 'Disease Detection Model v2.1', 'Neural Network for early disease detection based on behavioral and physiological patterns', 's3://vss-models/disease_detection_v2.h5', '{"algorithm": "NeuralNetwork", "layers": [128, 64, 32], "dropout": 0.3, "accuracy": 0.92, "trained_on": "2025-02-01"}'),
    (5, 'Breeding Success Predictor v1.0', 'Gradient Boosting model to predict breeding success probability', 's3://vss-models/breeding_v1.pkl', '{"algorithm": "GradientBoosting", "n_estimators": 200, "learning_rate": 0.05, "accuracy": 0.84, "trained_on": "2025-06-01"}'),
    (3, 'Feed Optimization Model v1.0', 'Support Vector Machine for optimizing feed composition and timing', 's3://vss-models/feed_optimization_v1.pkl', '{"algorithm": "SVM", "kernel": "rbf", "C": 1.0, "accuracy": 0.79, "trained_on": "2025-07-15"}'),
    (2, 'Milk Yield Predictor v2.0', 'Improved XGBoost model with higher accuracy and faster inference', 's3://vss-models/milk_yield_v2.pkl', '{"algorithm": "XGBoost", "n_estimators": 150, "max_depth": 12, "learning_rate": 0.1, "accuracy": 0.91, "trained_on": "2025-08-20"}'),
    (4, 'Activity Pattern Analyzer v1.0', 'LSTM model for analyzing cow activity patterns and detecting anomalies', 's3://vss-models/activity_pattern_v1.h5', '{"algorithm": "LSTM", "layers": [64, 32], "sequence_length": 24, "accuracy": 0.88, "trained_on": "2025-09-10"}');

-- Note: Predictions dummy data commented out as they depend on cows and datasets
-- Future: Add sample predictions once Global Hato with cows exists

-- INSERT INTO predictions (user_id, cow_id, model_id, dataset_id, date, result, state) VALUES
--     (2, 1, 1, 1, '2025-10-21 08:30:00', '{"predicted_yield": 28.5}', 'completed');

-- Display summary of inserted data
SELECT 'Data initialization completed successfully!' as status;
SELECT 'Users: ' || COUNT(*) as summary FROM users;
SELECT 'Global Hato Snapshots: ' || COUNT(*) as summary FROM global_hato;
SELECT 'Cows: ' || COUNT(*) as summary FROM cows;
SELECT 'Models: ' || COUNT(*) as summary FROM models;

-- Note: Default password for all users is 'Password123'
-- User accounts created:
-- 1. admin@vacas.com (role: 1 - ADMIN)
-- 2. researcher@vacas.com (role: 2 - COLAB)
-- 3. farmer@vacas.com (role: 2 - COLAB)
-- 4. jane.doe@vacas.com (role: 2 - COLAB)
-- 5. carlos.garcia@vacas.com (role: 2 - COLAB)
-- 6. pending@vacas.com (role: 3 - PENDING_APPROVAL)
