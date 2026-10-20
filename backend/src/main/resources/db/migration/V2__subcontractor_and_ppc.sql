-- ==========================================================
-- V2__subcontractor_and_ppc.sql - ERP Ánh Dương Building
-- Subcontractor Management & FIDIC Progress Payment Certificates (PPC)
-- ==========================================================

-- 1. SCHEMA
CREATE SCHEMA IF NOT EXISTS subcontractor_mgmt;

-- 2. SUBCONTRACTORS TABLE
CREATE TABLE IF NOT EXISTS subcontractor_mgmt.subcontractors (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    tax_code VARCHAR(30) UNIQUE NOT NULL,
    representative VARCHAR(150),
    phone VARCHAR(30),
    email VARCHAR(150),
    address VARCHAR(255),
    specialty VARCHAR(100),
    rating_grade VARCHAR(10) DEFAULT 'B',
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. SUBCONTRACTS (FIDIC) TABLE
CREATE TABLE IF NOT EXISTS subcontractor_mgmt.subcontracts (
    id BIGSERIAL PRIMARY KEY,
    contract_number VARCHAR(100) UNIQUE NOT NULL,
    project_id BIGINT REFERENCES project_mgmt.projects(id) ON DELETE RESTRICT,
    subcontractor_id BIGINT REFERENCES subcontractor_mgmt.subcontractors(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    contract_type VARCHAR(50) DEFAULT 'UNIT_PRICE',
    total_value NUMERIC(18, 2) NOT NULL,
    advance_payment_rate NUMERIC(5, 2) DEFAULT 10.00,
    advance_payment_amount NUMERIC(18, 2) DEFAULT 0.00,
    retention_rate NUMERIC(5, 2) DEFAULT 5.00,
    retention_accumulated NUMERIC(18, 2) DEFAULT 0.00,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'EXECUTING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. SUBCONTRACT BOQ ITEMS TABLE
CREATE TABLE IF NOT EXISTS subcontractor_mgmt.subcontract_items (
    id BIGSERIAL PRIMARY KEY,
    subcontract_id BIGINT REFERENCES subcontractor_mgmt.subcontracts(id) ON DELETE CASCADE,
    wbs_item_id BIGINT REFERENCES project_mgmt.wbs_items(id),
    item_code VARCHAR(50),
    description TEXT NOT NULL,
    unit VARCHAR(30) NOT NULL,
    contract_quantity NUMERIC(14, 3) NOT NULL,
    unit_price NUMERIC(18, 2) NOT NULL,
    total_amount NUMERIC(18, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. PAYMENT CERTIFICATES (PPC) TABLE
CREATE TABLE IF NOT EXISTS subcontractor_mgmt.payment_certificates (
    id BIGSERIAL PRIMARY KEY,
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    subcontract_id BIGINT REFERENCES subcontractor_mgmt.subcontracts(id) ON DELETE RESTRICT,
    period_number INT NOT NULL,
    billing_start_date DATE NOT NULL,
    billing_end_date DATE NOT NULL,
    gross_amount NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    cumulative_gross_amount NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    advance_deduction NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    retention_deduction NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    backcharges_deduction NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    net_payable_amount NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'DRAFT',
    created_by_user_id BIGINT REFERENCES core_iam.users(id),
    approved_by_user_id BIGINT REFERENCES core_iam.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. PPC DETAILS TABLE (Per-item valuation)
CREATE TABLE IF NOT EXISTS subcontractor_mgmt.ppc_details (
    id BIGSERIAL PRIMARY KEY,
    certificate_id BIGINT REFERENCES subcontractor_mgmt.payment_certificates(id) ON DELETE CASCADE,
    subcontract_item_id BIGINT REFERENCES subcontractor_mgmt.subcontract_items(id),
    previous_quantity NUMERIC(14, 3) DEFAULT 0.00,
    current_quantity NUMERIC(14, 3) NOT NULL,
    cumulative_quantity NUMERIC(14, 3) NOT NULL,
    current_amount NUMERIC(18, 2) NOT NULL,
    cumulative_amount NUMERIC(18, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. BACKCHARGES TABLE (Penalties / Contra-charges)
CREATE TABLE IF NOT EXISTS subcontractor_mgmt.backcharges (
    id BIGSERIAL PRIMARY KEY,
    subcontract_id BIGINT REFERENCES subcontractor_mgmt.subcontracts(id) ON DELETE CASCADE,
    certificate_id BIGINT REFERENCES subcontractor_mgmt.payment_certificates(id),
    incident_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'SAFETY_VIOLATION', 'MATERIAL_WASTAGE', 'EQUIPMENT_DAMAGE', 'POWER_WATER'
    description TEXT NOT NULL,
    amount NUMERIC(18, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. INITIAL SEED DATA FOR SUBCONTRACTORS
INSERT INTO subcontractor_mgmt.subcontractors (code, name, tax_code, representative, phone, specialty, rating_grade, status)
VALUES 
    ('SUB-STEEL-001', 'Công ty Cổ phần Cơ khí Xây dựng Việt Thép', '0301234567', 'Nguyễn Văn Hùng', '0903112233', 'Kết cấu thép nhà xưởng & Gia công xà gồ', 'A', 'ACTIVE'),
    ('SUB-MEP-002', 'Công ty TNHH Cơ điện Lạnh Á Châu', '0309876543', 'Trần Đình Trọng', '0918445566', 'Hệ thống HVAC, PCCC & Điện trung thế', 'A', 'ACTIVE'),
    ('SUB-FOUND-003', 'Công ty CP Nền móng & Thi công Cọc Đại Nam', '0311556677', 'Lê Hoàng Nam', '0982334455', 'Ép cọc dự ứng lực & Khoan nhồi D1200', 'B', 'ACTIVE')
ON CONFLICT (code) DO NOTHING;
