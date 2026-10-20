# SPEC-03: BOQ Estimating, Vietnamese Construction Norms & Job Costing (EVM)

> **Module**: 03. Estimating, BOQ & Job Costing  
> **Author**: BA Agent / Lead Architect  
> **Status**: Approved  
> **Stack**: Java 21 + Spring Boot 3.3.x + PostgreSQL 17 + React 18 + TypeScript

---

## 1. Business Objectives & Legal Basis

- **Legal Compliance**:
  - Compliant with **Thông tư 12/2021/TT-BXD** on construction cost norms (Định mức dự toán xây dựng công trình).
  - Compliant with **Nghị định 10/2021/NĐ-CP** on construction investment cost management.
- **Key Capabilities**:
  - Structured Bill of Quantities (BOQ) with multi-level hierarchical breakdown.
  - Cost analysis split into 4 standard construction expense groups:
    1. Direct Material Cost (Chi phí vật liệu trực tiếp - VL)
    2. Direct Labor Cost (Chi phí nhân công trực tiếp - NC)
    3. Construction Machinery & Equipment (Chi phí máy thi công - MTC)
    4. General Site Overheads & Margin (Chi phí chung & Lợi nhuận định mức - CPC)
  - Earned Value Management (EVM) tracking:
    - Planned Value (PV)
    - Earned Value (EV)
    - Actual Cost (AC)
    - Cost Performance Index ($CPI = EV / AC$)
    - Schedule Performance Index ($SPI = EV / PV$)

---

## 2. Database Schema (PostgreSQL DDL)

```sql
-- Schema: estimating_costing
CREATE SCHEMA IF NOT EXISTS estimating_costing;

-- Table: boq_headers
CREATE TABLE IF NOT EXISTS estimating_costing.boq_headers (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL,
    version_name VARCHAR(100) NOT NULL, -- 'BOQ_TENDER', 'BOQ_APPROVED_EXECUTION', 'BOQ_VARIATION_01'
    total_material_cost NUMERIC(18, 2) DEFAULT 0.00,
    total_labor_cost NUMERIC(18, 2) DEFAULT 0.00,
    total_equipment_cost NUMERIC(18, 2) DEFAULT 0.00,
    total_overhead_cost NUMERIC(18, 2) DEFAULT 0.00,
    total_estimated_amount NUMERIC(18, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: boq_items
CREATE TABLE IF NOT EXISTS estimating_costing.boq_items (
    id BIGSERIAL PRIMARY KEY,
    boq_header_id BIGINT REFERENCES estimating_costing.boq_headers(id) ON DELETE CASCADE,
    item_code VARCHAR(50) NOT NULL, -- E.g. 'AF.11111' per Circular 12/2021
    description VARCHAR(500) NOT NULL,
    unit VARCHAR(30) NOT NULL, -- 'm3', 'tan', 'm2', 'md'
    quantity NUMERIC(14, 4) NOT NULL,
    material_unit_rate NUMERIC(16, 2) DEFAULT 0.00,
    labor_unit_rate NUMERIC(16, 2) DEFAULT 0.00,
    equipment_unit_rate NUMERIC(16, 2) DEFAULT 0.00,
    unit_rate NUMERIC(16, 2) NOT NULL,
    total_amount NUMERIC(18, 2) NOT NULL,
    wbs_item_id BIGINT,
    actual_completed_quantity NUMERIC(14, 4) DEFAULT 0.00,
    actual_incurred_cost NUMERIC(18, 2) DEFAULT 0.00
);

-- Table: cost_variances (EVM metrics)
CREATE TABLE IF NOT EXISTS estimating_costing.cost_variances (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL,
    evaluation_date DATE NOT NULL,
    planned_value NUMERIC(18, 2) NOT NULL, -- PV
    earned_value NUMERIC(18, 2) NOT NULL,  -- EV
    actual_cost NUMERIC(18, 2) NOT NULL,   -- AC
    cost_variance NUMERIC(18, 2) NOT NULL, -- CV = EV - AC
    schedule_variance NUMERIC(18, 2) NOT NULL, -- SV = EV - PV
    cpi NUMERIC(5, 4) NOT NULL,            -- CPI = EV / AC
    spi NUMERIC(5, 4) NOT NULL,            -- SPI = EV / PV
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. REST API Specifications

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/projects/{projectId}/boq` | Get active BOQ with itemized breakdown |
| `POST` | `/api/v1/projects/{projectId}/boq` | Create a new BOQ version |
| `POST` | `/api/v1/projects/{projectId}/boq/items` | Add line item to BOQ |
| `POST` | `/api/v1/projects/{projectId}/boq/import-excel` | Import BOQ spreadsheet (Excel/XLSX) |
| `GET` | `/api/v1/projects/{projectId}/job-costing/evm` | Compute real-time EVM metrics (PV, EV, AC, CPI, SPI) |
| `GET` | `/api/v1/projects/{projectId}/job-costing/variance-report` | Cost variance analysis report |

---

## 4. Frontend Requirements

- **BOQ Spreadsheet Editor**: Fast, Excel-like editable grid with formula recalculation.
- **Excel Importer**: Upload modal with column mapping (Code, Description, Unit, Quantity, Rates).
- **EVM Control Dashboard**: Interactive charts tracking S-Curve (PV vs EV vs AC) and gauges for CPI & SPI health.
