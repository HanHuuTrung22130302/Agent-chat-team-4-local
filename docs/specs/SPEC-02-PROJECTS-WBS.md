# SPEC-02: Project Management, WBS Progress & Digital Site Diary

> **Module**: 02. Project Management, WBS & Site Operations  
> **Author**: BA Agent / Lead Architect  
> **Status**: Approved  
> **Stack**: Java 21 + Spring Boot 3.3.x + PostgreSQL 17 + React 18 + TypeScript

---

## 1. Business Objectives & Legal Basis

- **Legal Compliance**:
  - Follows **Nghị định 06/2021/NĐ-CP** regarding construction quality management and electronic site diaries (Nhật ký thi công điện tử).
  - WBS decomposition aligns with Vietnamese construction breakdown (Giai đoạn chuẩn bị, Thi công cọc móng, Kết cấu ngầm, Thân thô, Hoàn thiện, Cơ điện MEP, Nghiệm thu bàn giao).
- **Core Functionality**:
  - Multi-project portfolio tracking (Industrial factories, warehouses, commercial logistics).
  - 4-level Work Breakdown Structure (WBS) with planned vs actual progress tracking.
  - Interactive Gantt chart calculation (Critical Path Method - CPM).
  - Daily Site Diary: Records weather conditions (nhiệt độ, mưa/nắng gây ngừng việc), direct manpower, subcontractor workers, equipment on-site, safety toolbox meeting records, and photo attachments.

---

## 2. Database Schema (PostgreSQL DDL)

```sql
-- Schema: project_mgmt
CREATE SCHEMA IF NOT EXISTS project_mgmt;

-- Table: projects
CREATE TABLE IF NOT EXISTS project_mgmt.projects (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_type VARCHAR(50) NOT NULL, -- INDUSTRIAL_FACTORY, LOGISTICS, COMMERCIAL
    contract_value NUMERIC(18, 2) NOT NULL,
    start_date DATE NOT NULL,
    planned_end_date DATE NOT NULL,
    actual_end_date DATE,
    status VARCHAR(50) DEFAULT 'ACTIVE', -- PLANNING, ACTIVE, SUSPENDED, COMPLETED
    project_director_id BIGINT,
    site_manager_id BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: wbs_items
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
    assigned_to BIGINT,
    status VARCHAR(50) DEFAULT 'NOT_STARTED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: daily_site_diaries
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

-- Table: site_diary_photos
CREATE TABLE IF NOT EXISTS project_mgmt.site_diary_photos (
    id BIGSERIAL PRIMARY KEY,
    diary_id BIGINT REFERENCES project_mgmt.daily_site_diaries(id) ON DELETE CASCADE,
    photo_url VARCHAR(500) NOT NULL,
    caption VARCHAR(255),
    taken_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. REST API Specifications

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/projects` | Get all projects with summary metrics (progress %, budget vs actual) |
| `POST` | `/api/v1/projects` | Create a new project charter |
| `GET` | `/api/v1/projects/{id}` | Get detailed project overview |
| `PUT` | `/api/v1/projects/{id}` | Update project metadata |
| `GET` | `/api/v1/projects/{id}/wbs` | Get hierarchical WBS tree with progress percentages |
| `POST` | `/api/v1/projects/{id}/wbs` | Add new WBS work package |
| `PUT` | `/api/v1/projects/{id}/wbs/{wbsId}/progress` | Update WBS progress and recalculate parent progress |
| `GET` | `/api/v1/projects/{id}/site-diaries` | List daily site diaries for a date range |
| `POST` | `/api/v1/projects/{id}/site-diaries` | Submit electronic site diary with weather & workforce |
| `POST` | `/api/v1/projects/{id}/site-diaries/{diaryId}/photos` | Upload field photos to diary |

---

## 4. Frontend Requirements

- **Project Portfolio Grid**: Visual cards with project progress bars, budget health indicators, and status chips.
- **Interactive Gantt View**: Rendered using high-performance SVG/Canvas showing task dependencies, critical path, and baseline milestones.
- **Site Diary Creation Wizard**: Step-by-step form for site engineers to log weather, manpower counters, work items performed, and attach inspection photos.
