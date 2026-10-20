-- ==========================================================
-- V1__init_schema.sql - ERP Ánh Dương Building
-- Core IAM, Project Management & BOQ Estimating
-- ==========================================================

-- 1. SCHEMAS
CREATE SCHEMA IF NOT EXISTS core_iam;
CREATE SCHEMA IF NOT EXISTS project_mgmt;
CREATE SCHEMA IF NOT EXISTS estimating_costing;

-- 2. CORE IAM TABLES
CREATE TABLE IF NOT EXISTS core_iam.roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS core_iam.permissions (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS core_iam.role_permissions (
    role_id BIGINT REFERENCES core_iam.roles(id) ON DELETE CASCADE,
    permission_id BIGINT REFERENCES core_iam.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS core_iam.users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    role_id BIGINT REFERENCES core_iam.roles(id),
    department VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS core_iam.audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES core_iam.users(id),
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details TEXT,
    ip_address VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. PROJECT MANAGEMENT TABLES
CREATE TABLE IF NOT EXISTS project_mgmt.projects (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_type VARCHAR(50) NOT NULL,
    contract_value NUMERIC(18, 2) NOT NULL,
    start_date DATE NOT NULL,
    planned_end_date DATE NOT NULL,
    actual_end_date DATE,
    progress_percentage NUMERIC(5, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    project_director_id BIGINT REFERENCES core_iam.users(id),
    site_manager_id BIGINT REFERENCES core_iam.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_mgmt.wbs_items (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES project_mgmt.projects(id) ON DELETE CASCADE,
    parent_id BIGINT REFERENCES project_mgmt.wbs_items(id),
    wbs_code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    planned_start_date DATE,
    planned_end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    weight_percentage NUMERIC(5, 2) DEFAULT 0.00,
    progress_percentage NUMERIC(5, 2) DEFAULT 0.00,
    assigned_to BIGINT REFERENCES core_iam.users(id),
    status VARCHAR(50) DEFAULT 'NOT_STARTED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_mgmt.daily_site_diaries (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES project_mgmt.projects(id) ON DELETE CASCADE,
    diary_date DATE NOT NULL,
    weather_morning VARCHAR(100),
    weather_afternoon VARCHAR(100),
    temperature_celsius NUMERIC(4, 1),
    is_weather_stoppage BOOLEAN DEFAULT FALSE,
    stoppage_hours NUMERIC(4, 1) DEFAULT 0.0,
    direct_manpower_count INTEGER DEFAULT 0,
    subcontractor_manpower_count INTEGER DEFAULT 0,
    work_performed_summary TEXT NOT NULL,
    issues_and_risks TEXT,
    safety_notes TEXT,
    site_manager_signature VARCHAR(100),
    consultant_signature VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, diary_date)
);

-- 4. ESTIMATING & BOQ TABLES
CREATE TABLE IF NOT EXISTS estimating_costing.boq_headers (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES project_mgmt.projects(id) ON DELETE CASCADE,
    version_name VARCHAR(100) NOT NULL,
    total_material_cost NUMERIC(18, 2) DEFAULT 0.00,
    total_labor_cost NUMERIC(18, 2) DEFAULT 0.00,
    total_equipment_cost NUMERIC(18, 2) DEFAULT 0.00,
    total_overhead_cost NUMERIC(18, 2) DEFAULT 0.00,
    total_estimated_amount NUMERIC(18, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS estimating_costing.boq_items (
    id BIGSERIAL PRIMARY KEY,
    boq_header_id BIGINT REFERENCES estimating_costing.boq_headers(id) ON DELETE CASCADE,
    item_code VARCHAR(50) NOT NULL,
    description VARCHAR(500) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    quantity NUMERIC(14, 4) NOT NULL,
    material_unit_rate NUMERIC(16, 2) DEFAULT 0.00,
    labor_unit_rate NUMERIC(16, 2) DEFAULT 0.00,
    equipment_unit_rate NUMERIC(16, 2) DEFAULT 0.00,
    unit_rate NUMERIC(16, 2) NOT NULL,
    total_amount NUMERIC(18, 2) NOT NULL,
    wbs_item_id BIGINT REFERENCES project_mgmt.wbs_items(id),
    actual_completed_quantity NUMERIC(14, 4) DEFAULT 0.00,
    actual_incurred_cost NUMERIC(18, 2) DEFAULT 0.00
);

-- 5. INITIAL SEED DATA
-- Default Roles
INSERT INTO core_iam.roles (name, description) VALUES
('ROLE_BOD', 'Ban Tổng Giám đốc / Hội đồng Quản trị'),
('ROLE_PROJECT_DIRECTOR', 'Giám đốc Dự án D&B'),
('ROLE_SITE_MANAGER', 'Chỉ huy trưởng Công trường'),
('ROLE_CHIEF_ACCOUNTANT', 'Kế toán trưởng Xây dựng'),
('ROLE_QS_ENGINEER', 'Kỹ sư Quản lý Khối lượng & Chi phí (QS)'),
('ROLE_SUBCONTRACTOR', 'Đại diện Đơn vị Thầu phụ')
ON CONFLICT (name) DO NOTHING;

-- Default Admin User (Password: admin123)
-- bcrypt: $2a$10$w4rI.Z8y4oG6J0.w3ZJjweFqJ1bN.jK0L1Z7y5oG6J0.w3ZJjweFq (sample hash)
INSERT INTO core_iam.users (username, email, password_hash, full_name, phone_number, role_id, department)
VALUES
('admin', 'admin@anhduongbuilding.vn', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', 'Quản trị viên Hệ thống', '0901234567', 1, 'Ban Điều hành')
ON CONFLICT (username) DO NOTHING;

-- Sample Projects
INSERT INTO project_mgmt.projects (code, name, client_name, location, project_type, contract_value, start_date, planned_end_date, progress_percentage, status, project_director_id, site_manager_id)
VALUES
('DA-ADB-2026-001', 'Nhà máy Cơ khí Chính xác & Logistics Ánh Dương', 'Tập đoàn Công nghiệp Ánh Dương', 'KCN Sóng Thần 3, TP. Thủ Dầu Một, Bình Dương', 'INDUSTRIAL_FACTORY', 185000000000.00, '2026-02-01', '2026-11-30', 38.50, 'ACTIVE', 1, 1),
('DA-ADB-2026-002', 'Nhà xưởng Công nghệ cao & Kho Thông minh WinSteel', 'Công ty Cổ phần Thép WinSteel', 'KCN VSIP II-A, Bắc Tân Uyên, Bình Dương', 'LOGISTICS', 120000000000.00, '2026-03-15', '2026-12-15', 18.20, 'ACTIVE', 1, 1)
ON CONFLICT (code) DO NOTHING;

-- Sample WBS for Project 1
INSERT INTO project_mgmt.wbs_items (project_id, wbs_code, name, level, planned_start_date, planned_end_date, weight_percentage, progress_percentage, status)
VALUES
(1, 'WBS-1.0', 'Giai đoạn Chuẩn bị & Cọc thử nghiệm móng', 1, '2026-02-01', '2026-03-01', 10.00, 100.00, 'COMPLETED'),
(1, 'WBS-2.0', 'Thi công Kết cấu Móng & Bể nước ngầm PCCC', 1, '2026-03-02', '2026-05-15', 25.00, 85.00, 'IN_PROGRESS'),
(1, 'WBS-3.0', 'Gia công & Lắp dựng Khung Kết cấu Thép (WinSteel)', 1, '2026-04-10', '2026-07-30', 35.00, 20.00, 'IN_PROGRESS'),
(1, 'WBS-4.0', 'Thi công Bao che, Tấm lợp & Nền bê tông xoa phẳng', 1, '2026-06-01', '2026-09-15', 15.00, 0.00, 'NOT_STARTED'),
(1, 'WBS-5.0', 'Hệ thống Cơ điện MEP & PCCC Tự động', 1, '2026-07-01', '2026-10-30', 15.00, 0.00, 'NOT_STARTED')
ON CONFLICT DO NOTHING;

-- Sample Daily Site Diary
INSERT INTO project_mgmt.daily_site_diaries (project_id, diary_date, weather_morning, weather_afternoon, temperature_celsius, is_weather_stoppage, stoppage_hours, direct_manpower_count, subcontractor_manpower_count, work_performed_summary, issues_and_risks, safety_notes, site_manager_signature, consultant_signature)
VALUES
(1, CURRENT_DATE, 'Nắng nhẹ, không mưa', 'Mây nhiều, chiều tối có mưa rào nhẹ', 32.5, FALSE, 0.0, 18, 45, 'Tiếp tục đổ bê tông dầm giằng móng trục A-E; Gia công lắp đặt cốt thép đài móng ĐM-04; Đội WinSteel tập kết 35 tấn kèo thép tại bãi.', 'Đường nội bộ tạm thời bị sình lầy do mưa đêm qua, đã điều máy ủi rải đá cấp phối dặm vá.', 'Đã tổ chức họp an toàn đầu giờ (TBM). 100% công nhân trang bị đầy đủ bảo hộ PPE, dây đai an toàn khi làm việc trên hố móng.', 'Nguyễn Văn Hải - CHT', 'Trần Đình Trọng - TVGS')
ON CONFLICT (project_id, diary_date) DO NOTHING;
