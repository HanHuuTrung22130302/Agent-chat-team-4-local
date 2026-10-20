# CURRENT_STATE.md — Live Project Status

> **Check this file at the start of every session.** Updated after each work session.

## Current Phase

| Field | Value |
|---|---|
| Phase | **Continuous Autonomous Evolution Loop (Active - Assembly Line)** |
| Scope | Full 12-Module Enterprise D&B ERP (Ánh Dương Building) — Modular Architecture |
| Architecture | Java 21 + Spring Boot 3 + PostgreSQL + React 18 TS + Enterprise UI/UX Design System |
| Repositories | `Erp-ADB-Building.git` (Full product + tool + docs) & `Agent-chat-team-4-local.git` (Platform) |
| Live Public URL | `https://resolved-commander-price-reduces.trycloudflare.com` |
| Last updated | 2026-10-21 |

---

## Status Summary

### ✅ Completed Modules & Architecture

1. **Enterprise Architecture Roadmap**: `docs/plans/ENTERPRISE_ARCHITECTURE_ROADMAP.md` covering all 12 modules for Ánh Dương Building D&B EPC.
2. **Enterprise UI/UX Design System Skill**:
   - `skills/enterprise-ui-ux-design-system/SKILL.md` & `.opencode/skills/enterprise-ui-ux/SKILL.md`
   - Dark slate palette (`bg-slate-950`, `bg-slate-900`, `border-slate-800`), typography floors (>= 12px / `text-xs`), balanced status tokens, KPI summary cards, click-to-inspect drawers, quick action modals.
3. **Module 01: Project Management & WBS**:
   - Project Portfolio Dashboard (`ProjectDashboard.tsx`) with search, status filters, milestone tracking, and "+ Thao tác Mới" modal.
   - WBS Explorer (`WBSExplorer.tsx`) with hierarchical breakdown, weight allocation, and interactive progress slider.
4. **Module 02: Digital Site Diary**:
   - `SiteDiaryModule.tsx` with daily logs, morning/afternoon weather, direct vs subcontractor manpower count, HSE notes, and dual digital signatures (Chỉ huy trưởng & TVGS).
5. **Module 03: BOQ Estimating & EVM Analysis**:
   - `BOQEVMModule.tsx` with EVM cockpit (BAC, PV, EV, AC, CPI, SPI, EAC), interactive What-If cost delta slider, and Circular 12/2021 norm unit rate mapping.
6. **Module 04: Subcontractor & FIDIC PPC**:
   - `SubcontractorPPCModule.tsx` with subcontracts directory, FIDIC PPC payment certificate table ($\text{Gross} - \text{Advance} - \text{Retention 5\%} - \text{Backcharges} + \text{VAT 8\%}$), and live "Duyệt PPC" approval action.
7. **Module 05: Material Procurement & Warehouse**:
   - `MaterialWarehouseModule.tsx` with stock balances, low-stock indicators, and Circular 12/2021/TT-BXD norm reconciliation calculator (Steel $> 2.5\%$, Concrete $> 1.5\%$, Aggregates $> 3.0\%$).
8. **Module 06: Heavy Equipment & Machinery Fleet**:
   - `EquipmentFleetModule.tsx` with fleet inventory, engine hours, interactive diesel variance calculator with `OVER_CONSUMPTION` ($> 5\%$) and `CRITICAL` ($> 15\%$) alerts, safety inspection expiry countdown.
9. **Module 07: WinSteel Pre-Engineered Steel Factory**:
   - `WinSteelFactoryModule.tsx` with 5-stage fabrication line tracker, Nesting cut scrap calculator (rejects if scrap $> 3\%$), interactive QR Code site erection simulator updating status to `ERECTED` in real time.
10. **Module 08: QA/QC Quality Inspection (Nghị định 06/2021/NĐ-CP)**:
    - `QAQCModule.tsx` with 3 sub-views: RFI Inspection Checklists, Concrete Compressive Strength test log (R7/R28 MPa with TCVN 9340:2012 evaluation), and NCR defect report lifecycle with severity tokens.
    - Specification: `docs/specs/SPEC-08-QAQC-INSPECTION.md` (20 tables, schema `qaqc_mgmt`, 16 User Stories, 17 Gherkin ACs, 41 REST APIs).
11. **Module 09: HSE Site Safety & Permit To Work (PTW)**:
    - `HSEModule.tsx` with Permit To Work active permits (Hot Work, Working at Heights, Heavy Lifting), Near-miss incident tracking with 0 LTI safety milestone, and Toolbox meeting logs.
    - Specification: `docs/specs/SPEC-09-HSE-SAFETY-PTW.md` (21 tables, schema `hse_mgmt`, 15 User Stories, 20 Gherkin ACs, 40 REST APIs).
12. **Module 10: Quản lý Nhân lực Hiện trường, Chấm công FaceID/GPS & Bảng lương**:
    - Specification: `docs/specs/SPEC-10-WORKFORCE-ATTENDANCE.md` (32 tables, schema `workforce_mgmt`, `V7__create_workforce_tables.sql`, 22 User Stories, 28 Gherkin ACs, 30 REST APIs, US→AC coverage matrix, v1.1.0 review-hardened).
    - Features: Chấm công FaceID + GPS geofence chống gian lận, offline sync idempotent, phân loại lao động nặng nhọc độc hại (BLLĐ 2019 & TT 11/2020), trần OT (NQ 17/2022), tổ đội khoán (crew piece-rate), tính lương & hạch toán TK 622/338.
13. **Module 11: Kế toán Quản trị Chi phí WIP (TK 154) & Doanh thu POC (TT 200/2014/TT-BTC & VAS 15)**:
    - Specification: `docs/specs/SPEC-11-WIP-ACCOUNTING.md` (24 tables, schema `accounting_mgmt`, `V8__create_wip_accounting_tables.sql`, 24 User Stories, 28 Gherkin ACs, 35 REST APIs, US→AC coverage matrix).
    - Features: Tích lũy chi phí WIP (TK 1541-1547), tính & ghi nhận POC 3 phương pháp (Cost-to-cost, Survey, Milestone), hạch toán TK 337 (Contract Asset/Liability), trích lập lỗ dự kiến (VAS 15 đoạn 36), đối chiếu nghiệm thu FIDIC IPC Sub-Clause 14, chênh lệch tạm thời thuế TNDN.
14. **Production Docker Deployment & Cloudflare Tunnel**:
    - Backend: `erp-adb-backend` (port 8085)
    - Frontend: `erp-adb-frontend` (port 3000)
    - Tunnel: `https://resolved-commander-price-reduces.trycloudflare.com` (verified HTTP 200)
15. **Model Diversity Across Multi-PC Cluster**:
    - Lead (`lead-hantpc`): Gemini 3.8 Flash High
    - BA (`ba-hant_lap`): MiniMax M3.1 Flash Free
    - Dev (`developer-desktop-cgqq2oo`): Mimo v2.6 Flash Free
    - Tester (`tester-desktop-khkher1`): GLM 5.3 Flash Free
16. **Platform Autonomous Assembly Line**:
    - Continuous task scheduler in `agentforge/hub/app.py`: Automatically auto-dispatches pending queue tasks as soon as matching agents become idle.
    - All 4 physical nodes concurrently integrated and cooperating in real-time.

---

## Network Topology & Cluster Status

```
[PC-3: Lead (192.168.1.2)]      ──┐
[PC-4: BA (192.168.1.2)]        ──┼──► Viettel LAN (192.168.1.x)
[PC-1: Dev (192.168.1.3)]       ──┤
[PC-2: Tester (192.168.1.4)]    ──┤
[Server: Hub (192.168.1.50)]    ◄─┴── Hub (:8000), ERP Backend (:8085), Frontend (:3000), Cloudflare Tunnel
```
