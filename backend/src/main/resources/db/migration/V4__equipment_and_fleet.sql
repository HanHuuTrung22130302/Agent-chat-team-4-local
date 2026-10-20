-- ==========================================================
-- V4__equipment_and_fleet.sql - ERP Ánh Dương Building
-- Equipment & Machinery Fleet Management, Engine Hours & Diesel Fuel Norm
-- ==========================================================

-- 1. SCHEMA
CREATE SCHEMA IF NOT EXISTS equipment_mgmt;

-- 2. EQUIPMENTS CATALOG
CREATE TABLE IF NOT EXISTS equipment_mgmt.equipments (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- CRANE, EXCAVATOR, ROLLER, PILING_RIG, GENERATOR, TRUCK
    brand VARCHAR(100),
    model VARCHAR(100),
    manufacture_year INT,
    serial_number VARCHAR(100),
    plate_number VARCHAR(50),
    owner_type VARCHAR(30) DEFAULT 'INTERNAL', -- INTERNAL, RENTED
    current_project_id BIGINT REFERENCES project_mgmt.projects(id) ON DELETE SET NULL,
    status VARCHAR(30) DEFAULT 'OPERATIONAL', -- OPERATIONAL, STANDBY, MAINTENANCE, BREAKDOWN, DEMOBILIZED
    standard_fuel_norm NUMERIC(6, 2) NOT NULL DEFAULT 0.00, -- Định mức dầu Diesel (lít/giờ) TT 12/2021
    total_engine_hours NUMERIC(10, 2) DEFAULT 0.00,
    safety_inspection_expiry DATE NOT NULL,
    insurance_expiry DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. MOBILIZATION ORDERS
CREATE TABLE IF NOT EXISTS equipment_mgmt.mobilization_orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    equipment_id BIGINT REFERENCES equipment_mgmt.equipments(id) ON DELETE RESTRICT,
    from_project_id BIGINT REFERENCES project_mgmt.projects(id) ON DELETE SET NULL,
    to_project_id BIGINT REFERENCES project_mgmt.projects(id) ON DELETE RESTRICT,
    dispatch_date DATE NOT NULL,
    arrival_date DATE,
    transport_company VARCHAR(255),
    transport_cost NUMERIC(18, 2) DEFAULT 0.00,
    status VARCHAR(30) DEFAULT 'IN_TRANSIT', -- IN_TRANSIT, MOBILIZED, REJECTED
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. EQUIPMENT ENGINE HOUR & FUEL LOGS
CREATE TABLE IF NOT EXISTS equipment_mgmt.equipment_logs (
    id BIGSERIAL PRIMARY KEY,
    log_number VARCHAR(50) UNIQUE NOT NULL,
    equipment_id BIGINT REFERENCES equipment_mgmt.equipments(id) ON DELETE RESTRICT,
    project_id BIGINT REFERENCES project_mgmt.projects(id) ON DELETE RESTRICT,
    wbs_item_id BIGINT REFERENCES project_mgmt.wbs_items(id) ON DELETE SET NULL,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    operator_name VARCHAR(150) NOT NULL,
    start_engine_hour NUMERIC(10, 2) NOT NULL,
    end_engine_hour NUMERIC(10, 2) NOT NULL,
    worked_hours NUMERIC(6, 2) NOT NULL,
    fuel_issued_liters NUMERIC(8, 2) NOT NULL DEFAULT 0.00,
    expected_fuel_liters NUMERIC(8, 2) NOT NULL,
    fuel_variance_rate NUMERIC(5, 2) NOT NULL, -- % chênh lệch nhiên liệu
    work_description TEXT NOT NULL,
    alert_flag VARCHAR(30) DEFAULT 'NORMAL', -- NORMAL, OVER_CONSUMPTION, CRITICAL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. MAINTENANCE RECORDS
CREATE TABLE IF NOT EXISTS equipment_mgmt.maintenance_records (
    id BIGSERIAL PRIMARY KEY,
    equipment_id BIGINT REFERENCES equipment_mgmt.equipments(id) ON DELETE CASCADE,
    maintenance_type VARCHAR(50) NOT NULL, -- 250H_PERIODIC, 500H_PERIODIC, EMERGENCY_REPAIR
    engine_hours_at_maintenance NUMERIC(10, 2) NOT NULL,
    maintenance_date DATE NOT NULL,
    performed_by VARCHAR(255) NOT NULL,
    parts_replaced TEXT,
    total_cost NUMERIC(18, 2) DEFAULT 0.00,
    next_maintenance_engine_hours NUMERIC(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. SEED CORE FLEET EQUIPMENT
INSERT INTO equipment_mgmt.equipments (code, name, category, brand, model, manufacture_year, serial_number, owner_type, status, standard_fuel_norm, total_engine_hours, safety_inspection_expiry) VALUES
('EQ-CRANE-50T-01', 'Cần cẩu bánh xích Hitachi KH180-3 50T', 'CRANE', 'Hitachi', 'KH180-3', 2019, 'SN-HTC-50T-01', 'INTERNAL', 'OPERATIONAL', 18.50, 4250.00, '2026-12-31'),
('EQ-CRANE-TOWER-01', 'Cần trục tháp Zoomlion TC6013A-6 6T', 'CRANE', 'Zoomlion', 'TC6013A-6', 2021, 'SN-ZML-6013-01', 'INTERNAL', 'OPERATIONAL', 0.00, 2180.00, '2026-11-15'),
('EQ-EXC-KOMATSU-01', 'Máy xúc đào bánh xích Komatsu PC200-8 0.8m3', 'EXCAVATOR', 'Komatsu', 'PC200-8', 2020, 'SN-KMT-200-01', 'INTERNAL', 'OPERATIONAL', 15.20, 3120.00, '2026-10-30'),
('EQ-ROLLER-SAKAI-01', 'Máy lu rung Sakai SV520DH 14T', 'ROLLER', 'Sakai', 'SV520DH', 2022, 'SN-SKI-520-01', 'INTERNAL', 'OPERATIONAL', 12.00, 1450.00, '2027-03-20')
ON CONFLICT (code) DO NOTHING;
