-- ==========================================================
-- V3__inventory_and_procurement.sql - ERP Ánh Dương Building
-- Materials Procurement, Warehouse & Circular 12/2021 Norm Reconciliation
-- ==========================================================

-- 1. SCHEMA
CREATE SCHEMA IF NOT EXISTS inventory_mgmt;

-- 2. MATERIALS CATALOG
CREATE TABLE IF NOT EXISTS inventory_mgmt.materials (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- STEEL, CONCRETE, CEMENT, AGGREGATES, FINISHING, MEP
    unit VARCHAR(30) NOT NULL, -- TẤN, M3, BAO, M2, KG
    standard_norm_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00, -- Hao hụt định mức TT 12/2021 (%)
    specs TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. MATERIAL REQUISITIONS (MR)
CREATE TABLE IF NOT EXISTS inventory_mgmt.material_requisitions (
    id BIGSERIAL PRIMARY KEY,
    mr_number VARCHAR(50) UNIQUE NOT NULL,
    project_id BIGINT REFERENCES project_mgmt.projects(id) ON DELETE RESTRICT,
    wbs_item_id BIGINT REFERENCES project_mgmt.wbs_items(id) ON DELETE SET NULL,
    required_date DATE NOT NULL,
    priority VARCHAR(20) DEFAULT 'NORMAL', -- NORMAL, URGENT, CRITICAL
    status VARCHAR(30) DEFAULT 'DRAFT', -- DRAFT, SUBMITTED, APPROVED_PM, ORDERED, FULFILLED
    requested_by BIGINT REFERENCES core_iam.users(id),
    approved_by BIGINT REFERENCES core_iam.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_mgmt.material_requisition_items (
    id BIGSERIAL PRIMARY KEY,
    requisition_id BIGINT REFERENCES inventory_mgmt.material_requisitions(id) ON DELETE CASCADE,
    material_id BIGINT REFERENCES inventory_mgmt.materials(id) ON DELETE RESTRICT,
    requested_quantity NUMERIC(14, 3) NOT NULL,
    approved_quantity NUMERIC(14, 3) DEFAULT 0.000,
    notes VARCHAR(255)
);

-- 4. PURCHASE ORDERS (PO)
CREATE TABLE IF NOT EXISTS inventory_mgmt.purchase_orders (
    id BIGSERIAL PRIMARY KEY,
    po_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    supplier_tax_code VARCHAR(30),
    project_id BIGINT REFERENCES project_mgmt.projects(id) ON DELETE RESTRICT,
    total_amount NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    delivery_deadline DATE,
    payment_terms TEXT,
    status VARCHAR(30) DEFAULT 'ISSUED', -- ISSUED, PARTIALLY_DELIVERED, COMPLETED, CANCELLED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_mgmt.purchase_order_items (
    id BIGSERIAL PRIMARY KEY,
    po_id BIGINT REFERENCES inventory_mgmt.purchase_orders(id) ON DELETE CASCADE,
    material_id BIGINT REFERENCES inventory_mgmt.materials(id) ON DELETE RESTRICT,
    quantity NUMERIC(14, 3) NOT NULL,
    unit_price NUMERIC(18, 2) NOT NULL,
    total_price NUMERIC(18, 2) NOT NULL,
    received_quantity NUMERIC(14, 3) DEFAULT 0.000
);

-- 5. GOODS RECEIPT NOTES (GRN)
CREATE TABLE IF NOT EXISTS inventory_mgmt.goods_receipt_notes (
    id BIGSERIAL PRIMARY KEY,
    grn_number VARCHAR(50) UNIQUE NOT NULL,
    po_id BIGINT REFERENCES inventory_mgmt.purchase_orders(id) ON DELETE RESTRICT,
    project_id BIGINT REFERENCES project_mgmt.projects(id) ON DELETE RESTRICT,
    delivery_truck_plate VARCHAR(30),
    weighing_slip_number VARCHAR(50),
    has_co_cq BOOLEAN DEFAULT TRUE,
    inspector_notes TEXT,
    received_by BIGINT REFERENCES core_iam.users(id),
    receipt_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_mgmt.goods_receipt_items (
    id BIGSERIAL PRIMARY KEY,
    grn_id BIGINT REFERENCES inventory_mgmt.goods_receipt_notes(id) ON DELETE CASCADE,
    material_id BIGINT REFERENCES inventory_mgmt.materials(id) ON DELETE RESTRICT,
    quantity NUMERIC(14, 3) NOT NULL,
    notes VARCHAR(255)
);

-- 6. GOODS ISSUE NOTES (GIN)
CREATE TABLE IF NOT EXISTS inventory_mgmt.goods_issue_notes (
    id BIGSERIAL PRIMARY KEY,
    gin_number VARCHAR(50) UNIQUE NOT NULL,
    project_id BIGINT REFERENCES project_mgmt.projects(id) ON DELETE RESTRICT,
    wbs_item_id BIGINT REFERENCES project_mgmt.wbs_items(id) ON DELETE SET NULL,
    subcontractor_id BIGINT REFERENCES subcontractor_mgmt.subcontractors(id) ON DELETE SET NULL,
    recipient_name VARCHAR(150) NOT NULL,
    purpose TEXT NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_mgmt.goods_issue_items (
    id BIGSERIAL PRIMARY KEY,
    gin_id BIGINT REFERENCES inventory_mgmt.goods_issue_notes(id) ON DELETE CASCADE,
    material_id BIGINT REFERENCES inventory_mgmt.materials(id) ON DELETE RESTRICT,
    quantity NUMERIC(14, 3) NOT NULL,
    notes VARCHAR(255)
);

-- 7. STOCK BALANCES
CREATE TABLE IF NOT EXISTS inventory_mgmt.stock_balances (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES project_mgmt.projects(id) ON DELETE CASCADE,
    material_id BIGINT REFERENCES inventory_mgmt.materials(id) ON DELETE RESTRICT,
    current_quantity NUMERIC(14, 3) NOT NULL DEFAULT 0.000,
    minimum_threshold NUMERIC(14, 3) DEFAULT 0.000,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_project_material UNIQUE (project_id, material_id)
);

-- 8. SEED STANDARD MATERIALS WITH TT 12/2021 NORM RATES
INSERT INTO inventory_mgmt.materials (code, name, category, unit, standard_norm_rate, specs) VALUES
('MAT-STEEL-CB400', 'Thép thanh vằn Hòa Phát CB400 D20-D32', 'STEEL', 'TẤN', 2.50, 'TCVN 1651-2:2018'),
('MAT-STEEL-H300', 'Thép hình Posco SS400 H300x300x10x15', 'STEEL', 'TẤN', 2.50, 'JIS G3101 SS400'),
('MAT-CONC-M300', 'Bê tông thương phẩm mác M300 R28', 'CONCRETE', 'M3', 1.50, 'TCVN 9340:2012'),
('MAT-CONC-M350', 'Bê tông chống thấm B8 mác M350 R28', 'CONCRETE', 'M3', 1.50, 'TCVN 9340:2012 B8'),
('MAT-SAND-GOLD', 'Cát vàng xây tô bê tông hạt to', 'AGGREGATES', 'M3', 3.00, 'TCVN 7570:2006'),
('MAT-STONE-1X2', 'Đá xanh nghiền 1x2 trạm nghiền Hóa An', 'AGGREGATES', 'M3', 3.00, 'TCVN 7570:2006'),
('MAT-CEMENT-PCB40', 'Xi măng Holcim/Insee PCB40 bao 50kg', 'CEMENT', 'BAO', 1.00, 'TCVN 6260:2020')
ON CONFLICT (code) DO NOTHING;
