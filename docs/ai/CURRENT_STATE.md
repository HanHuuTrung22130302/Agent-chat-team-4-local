# CURRENT_STATE.md — Live Project Status

> **Check this file at the start of every session.** Updated after each work session.

## Current Phase

| Field | Value |
|---|---|
| Phase | **Continuous Autonomous Evolution Loop (Active - Assembly Line)** |
| Scope | Full 12-Module Enterprise D&B ERP (Ánh Dương Building) |
| Architecture | Java 21 + Spring Boot 3 + PostgreSQL + React 18 TS |
| Repositories | `Erp-ADB-Building.git` (Full product + tool + docs) & `Agent-chat-team-4-local.git` (Platform) |
| Live Public URL | `https://resolved-commander-price-reduces.trycloudflare.com` |
| Last updated | 2026-10-20 |

---

## Status Summary

### ✅ Completed Modules & Architecture

1. **Enterprise Architecture Roadmap**: `docs/plans/ENTERPRISE_ARCHITECTURE_ROADMAP.md` covering all 12 modules for Ánh Dương Building D&B EPC.
2. **Module 01: Project Management & WBS**: Core Entity, DDL V1, REST API, WBS 4-level hierarchy.
3. **Module 02: Digital Site Diary**: Daily logs, weather, manpower, safety notes (Nghị định 06/2021/NĐ-CP).
4. **Module 03: BOQ Estimating & EVM Analysis**: Earned Value Management (BAC, PV, EV, AC, CPI, SPI, EAC), unit rates, and `JobCostingEVMTest.java`.
5. **Module 04: Subcontractor & FIDIC PPC**: Advance payments, 5% retention, backcharges, VAT 8%, and `SubcontractorServiceTest.java`.
6. **Module 05: Material Procurement & Warehouse**:
   - Spec: `SPEC-05-MATERIALS-WAREHOUSE.md`
   - Flyway: `V3__inventory_and_procurement.sql`
   - Backend: `com.anhduongbuilding.erp.inventory` (MR, PO, GRN, GIN, Stock balances)
   - Tests: `MaterialNormReconciliationTest.java` (Circular 12/2021 norm reconciliations: Steel <= 2.5%, Concrete <= 1.5%, Aggregates <= 3.0%).
7. **Module 06: Heavy Equipment & Machinery Fleet**:
   - Spec: `SPEC-06-EQUIPMENT-FLEET.md`
   - Flyway: `V4__equipment_and_fleet.sql`
   - Backend: `com.anhduongbuilding.erp.equipment` (Equipments, Mobilization orders, Engine hour logs, Diesel norm)
   - Tests: `EquipmentFuelNormTest.java` (Circular 12/2021 diesel consumption variance > 5% / > 15%, safety inspection expiry alert <= 30 days).
8. **Module 07: WinSteel Pre-Engineered Steel Factory**:
   - Spec: `SPEC-07-WINSTEEL-FACTORY.md`
   - Flyway: `V5__winsteel_factory.sql`
   - Backend: `com.anhduongbuilding.erp.winsteel` (BOM components, 5-stage shopline, Nesting plan scrap < 3%, QR site erection)
   - Tests: `WinSteelNestingTest.java` (Nesting optimization approval, scrap rate threshold, QR site erection).
9. **React 18 TypeScript Frontend**:
   - Full 8-tab interactive navigation in `App.tsx` (Projects, WBS, Diary, BOQ & EVM, Subcontractors & FIDIC PPC, Inventory & Warehouse, Equipment Fleet, WinSteel Factory).
10. **Platform Autonomous Assembly Line**:
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
