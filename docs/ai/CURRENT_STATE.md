# CURRENT_STATE.md — Live Project Status

> **Check this file at the start of every session.** Updated after each work session.

## Current Phase

| Field | Value |
|---|---|
| Phase | **Continuous Autonomous Evolution Loop (Active)** |
| Scope | Full 12-Module Enterprise D&B ERP (Ánh Dương Building) |
| Architecture | Java 21 + Spring Boot 3 + PostgreSQL + React 18 TS |
| Repositories | `Erp-ADB-Building.git` (Full product + tool + docs) & `Agent-chat-team-4-local.git` (Platform) |
| Last updated | 2026-10-20 |

---

## Status Summary

### ✅ Completed

- [x] Company research & requirements gathering (ADB profile, Grade I D&B general contractor)
- [x] Platform Hub & Real-time Web Dashboard deployed on Ubuntu Server (`http://192.168.1.50:8000`)
- [x] Agent Daemons verified & online on all 4 physical machines (Lead, BA, Dev, Tester)
- [x] Strict budget protection locked (100% Free models: `gemini-3.8-flash-high`, `deepseek-v4.1-flash-free`)
- [x] Master Autonomous Roadmap established (`docs/plans/MASTER_ROADMAP.md`)
- [x] Core IAM Spec written (`docs/specs/SPEC-01-CORE-IAM.md`)
- [x] Project Management & WBS Spec written (`docs/specs/SPEC-02-PROJECTS-WBS.md`)
- [x] BOQ Estimating & Job Costing Spec written (`docs/specs/SPEC-03-BOQ-COSTING.md`)
- [x] **Module 04: Subcontractors & FIDIC PPC** written (`docs/specs/SPEC-04-SUBCONTRACTORS.md`)
- [x] **Backend Implementation (Java 21 + Spring Boot 3)**:
  - Flyway DDL `V1__init_schema.sql` (Core IAM, Project Management, BOQ)
  - Flyway DDL `V2__subcontractor_and_ppc.sql` (Subcontractors, Subcontracts, Payment Certificates, Backcharges)
  - Spring Boot JPA Entities, Repositories, Services, and REST Controllers for Project WBS, Site Diary, Subcontractors, and PPC
  - Automated test suites: `ProjectServiceTest.java`, `SubcontractorServiceTest.java` (JUnit 5 + Mockito)
- [x] **Frontend Implementation (React 18 + TypeScript + Vite + Tailwind CSS)**:
  - Project Portfolio Dashboard & Contract Values
  - Interactive WBS Progress Tracker
  - Digital Site Diary (Nghị định 06/2021/NĐ-CP)
  - Subcontractor Directory & FIDIC PPC Certificate Inspector
- [x] **Platform Engine Resolution**: Fixed Windows subprocess cmd.exe newline argument parsing via direct `.exe` binary discovery and `use_shell=False`.

---

### ⏳ Autonomous Evolution Pipeline

1. **Cycle 1**: Core IAM & Project Management & Site Diary ✅ (Done)
2. **Cycle 2**: Subcontractor Management & Progress Payment Certificates (PPC) ✅ (Done)
3. **Cycle 3**: BOQ Estimating, Vietnamese Norms (TT 12/2021) & Job Costing (EVM) 🔄 (Next)
4. **Cycle 4**: Material Procurement & Site Warehouse Inventory (GRN / GIN)
5. **Cycle 5**: Machinery & Equipment Fleet Management
6. **Cycle 6**: WinSteel Pre-Engineered Steel Factory Module (BOM & Nesting)
7. **Cycle 7**: GPS Site Attendance & Vietnamese Labor Payroll
8. **Cycle 8**: Construction WIP Accounting (TK 154) & Financial Reporting
9. **Cycle 9**: Executive BI Cockpit & Risk Heatmap

---

## Network Topology & Connectivity

```
[PC-3: Lead (192.168.1.2)]      ──┐
[PC-4: BA (192.168.1.2)]        ──┼──► Viettel LAN (192.168.1.x)
[PC-1: Dev (192.168.1.3)]       ──┤
[PC-2: Tester (192.168.1.4)]    ──┤
[Server: Hub (192.168.1.50)]    ◄─┴── Hub (:8000) & PostgreSQL (:5432/adb_erp)
```
