-- ==========================================================
-- V5__winsteel_factory.sql - ERP Ánh Dương Building
-- WinSteel Pre-Engineered Steel Factory: BOM, Nesting & QR Code Erection
-- ==========================================================

-- 1. SCHEMA
CREATE SCHEMA IF NOT EXISTS winsteel_mgmt;

-- 2. STEEL MANUFACTURING ORDERS
CREATE TABLE IF NOT EXISTS winsteel_mgmt.steel_orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    project_id BIGINT REFERENCES project_mgmt.projects(id) ON DELETE RESTRICT,
    total_tonnage NUMERIC(10, 3) NOT NULL,
    drawing_approval_date DATE,
    target_delivery_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'IN_PRODUCTION', -- BOM_IMPORTING, NESTING, IN_PRODUCTION, ERECTING, COMPLETED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. STEEL COMPONENTS (BOM)
CREATE TABLE IF NOT EXISTS winsteel_mgmt.steel_components (
    id BIGSERIAL PRIMARY KEY,
    steel_order_id BIGINT REFERENCES winsteel_mgmt.steel_orders(id) ON DELETE CASCADE,
    component_mark VARCHAR(50) NOT NULL,
    component_type VARCHAR(50) NOT NULL, -- COLUMN, RAFTER, PURLIN, BRACING, GUSSET_PLATE
    profile_specs VARCHAR(100) NOT NULL,
    steel_grade VARCHAR(30) DEFAULT 'SS400',
    length_mm INT NOT NULL,
    weight_kg NUMERIC(10, 2) NOT NULL,
    grid_location VARCHAR(50),
    qr_code_uid VARCHAR(100) UNIQUE NOT NULL,
    
    -- 5 SHOP STAGES
    cut_status VARCHAR(20) DEFAULT 'PENDING',
    fit_status VARCHAR(20) DEFAULT 'PENDING',
    weld_status VARCHAR(20) DEFAULT 'PENDING',
    blast_status VARCHAR(20) DEFAULT 'PENDING',
    paint_status VARCHAR(20) DEFAULT 'PENDING',
    
    -- SITE ERECTION
    shipping_status VARCHAR(20) DEFAULT 'IN_SHOP',
    erection_status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, ERECTED, INSPECTED_OK
    erected_at TIMESTAMP WITH TIME ZONE,
    erected_by VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. NESTING OPTIMIZATION PLANS
CREATE TABLE IF NOT EXISTS winsteel_mgmt.nesting_plans (
    id BIGSERIAL PRIMARY KEY,
    plan_code VARCHAR(50) UNIQUE NOT NULL,
    steel_order_id BIGINT REFERENCES winsteel_mgmt.steel_orders(id) ON DELETE CASCADE,
    raw_plate_specs VARCHAR(100) NOT NULL,
    raw_plate_weight_kg NUMERIC(10, 2) NOT NULL,
    utilized_weight_kg NUMERIC(10, 2) NOT NULL,
    scrap_weight_kg NUMERIC(10, 2) NOT NULL,
    scrap_rate NUMERIC(5, 2) NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
