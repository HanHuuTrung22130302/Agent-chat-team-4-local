# SESSION.md — Session Handoff Log

## Session: 2026-10-20 (Continuous Autonomous Assembly Line)

### Summary
- Transitioned multi-agent orchestration into a **Fully Concurrent Continuous Assembly Line (Dây chuyền thực thi đồng thời liên tục)**:
  - Lead architected the full 12-module D&B ERP suite in `docs/plans/ENTERPRISE_ARCHITECTURE_ROADMAP.md`.
  - Upgraded Hub task queue in `agentforge/hub/app.py`: automatically pulls and auto-dispatches pending tasks to matching agents the instant they complete a task or register.
  - Implemented Module 05 (Material Procurement, Warehouse, Circular 12/2021 Norm Reconciliation, Flyway `V3`, Spring Boot `inventory` package, `MaterialNormReconciliationTest.java`).
  - Implemented Module 06 (Heavy Equipment Fleet, Mobilization, Digital Engine Hours, Diesel Norms, Flyway `V4`, Spring Boot `equipment` package, `EquipmentFuelNormTest.java`).
  - Implemented Module 07 (WinSteel Pre-Engineered Steel Factory, BOM Decomposition, 5-Stage Shopline, Nesting Scrap < 3%, QR Site Erection, Flyway `V5`, Spring Boot `winsteel` package, `WinSteelNestingTest.java`).
  - Expanded React 18 TypeScript Frontend with full interactive modules for Projects, WBS, Daily Diary, BOQ & EVM Analysis, Subcontractor FIDIC PPC, Warehouse Inventory, Equipment Fleet, and WinSteel QR tracker.

### Decisions Made
- [x] Auto-assign pending tasks on Hub whenever agents become idle (removes sequential bottlenecks).
- [x] Integrate Modules 05, 06, 07 into the unified PostgreSQL database schemas (`inventory_mgmt`, `equipment_mgmt`, `winsteel_mgmt`).
- [x] Expose all business endpoints via REST and embed real-time visualizations into the React frontend.

### Next Recommended Actions
1. Maintain continuous assembly line for Modules 10 (Workforce & Payroll), 11 (Accounting WIP & Financial Statements), and 12 (FIDIC Claims, EOT & Variation Orders).
2. Continue executing live tests across all physical PC nodes.

---

## Session: 2026-10-21 (Enterprise UI/UX Design System & Modular Frontend Overhaul)

### Summary
- **Enterprise UI/UX Design System Skill**:
  - Authored and deployed `skills/enterprise-ui-ux-design-system/SKILL.md` (and `.opencode/skills/enterprise-ui-ux/SKILL.md`).
  - Integrated auto-injection into `agentforge/agent/agent_daemon.py` to enforce high-contrast dark slate aesthetics, >=12px typography, balanced badge tokens, KPI metric cards, and domain-specific rules.
  - Automatically pushed to `Agent-chat-team-4-local.git` per user invariant rule.
- **Frontend Modular Re-architecture (`frontend/src/`)**:
  - Decomposed monolithic `App.tsx` into 14 distinct, production-grade components:
    - Common: `Header.tsx`, `Sidebar.tsx`.
    - Modals: `CreateProjectModal.tsx`, `ActionModal.tsx`.
    - Modules: `ProjectDashboard.tsx`, `WBSExplorer.tsx`, `SiteDiaryModule.tsx`, `BOQEVMModule.tsx`, `SubcontractorPPCModule.tsx`, `MaterialWarehouseModule.tsx`, `EquipmentFleetModule.tsx`, `WinSteelFactoryModule.tsx`, `QAQCModule.tsx`, `HSEModule.tsx`.
- **Domain Modules 08 (QA/QC) & 09 (HSE)**:
  - QA/QC: RFI inspection checklists per Nghị định 06/2021/NĐ-CP, concrete compressive strength log (R7/R28 MPa per TCVN 9340:2012), steel weld ultrasonic testing (UT), and NCR defect report lifecycle.
  - HSE: Permit To Work (PTW) for hot work, heavy lifting, and working at height; Near-miss incident tracking with 0 LTI milestone; and Toolbox meeting logs.
- **Concurrent Multi-PC Execution**:
  - Dispatched TASK-022 to BA (`ba-hant_lap`), TASK-023 to Developer (`developer-desktop-cgqq2oo`), and TASK-024 to Tester (`tester-desktop-khkher1`) simultaneously.
- **Production Docker & Cloudflare Tunnel**:
  - Rebuilt `erp-adb-frontend` container on Ubuntu Server `192.168.1.50`.
  - Both LAN endpoint (`http://192.168.1.50:3000`) and Cloudflare tunnel (`https://resolved-commander-price-reduces.trycloudflare.com`) verified HTTP 200.

---

## Session: 2026-10-21 (TASK-022 — Đặc tả Module 08 QA/QC & Module 09 HSE)

### Summary
- **Deliverables (BA Agent, PC-4 `ba-hant_lap`)**:
  - `docs/specs/SPEC-08-QAQC-INSPECTION.md` — Module 08 Quản lý Chất lượng QA/QC (NĐ 06/2021/NĐ-CP):
    16 User Stories → 17 Gherkin AC; 8 quy trình (ITP Hold/Witness/Surveillance, RFI công tác ẩn SLA 48h + escalation L1/L2/L3, mẫu bê tông R7/R14/R28 theo TCVN 9340:2012, siêu âm đường hàn TCVN 6735, vòng đời NCR 9 trạng thái, CO/CQ vật tư, hồ sơ HBCT + Punch List, 3 mốc BBNT NĐ 06);
    PostgreSQL DDL schema `qaqc_mgmt` (**20 bảng**); **41 REST endpoint**; 9 giao diện UI.
  - `docs/specs/SPEC-09-HSE-SAFETY-PTW.md` — Module 09 An toàn Lao động & Cấp phép HSE (TT 10/2021/TT-BXD):
    15 User Stories → 20 Gherkin AC; 8 quy trình (HĐND/JSA 5×5, vòng đời PTW 9 trạng thái, 7 loại giấy phép, near-miss & 5 Whys, họp an toàn đầu giờ, ứng cứu khẩn cấp, chứng chỉ huấn luyện Nhóm 1/2/3/4 theo NĐ 44/2016, biên bản vi phạm an toàn → khấu trừ PPC);
    PostgreSQL DDL schema `hse_mgmt` (**21 bảng**); **40 REST endpoint**; 10 giao diện UI.
- **Xác minh DDL trên PostgreSQL thật** (`192.168.1.50:5432`): database tạm `adb_ddl_validation_t022` (baseline `V1__init_schema.sql` → DDL 2 spec → kiểm tra bảng/seed → drop DB).
  **97 câu lệnh, 0 lỗi, 41 bảng, 105 FK, 287 CHECK constraint.** Không đụng dữ liệu production.
- **Đối chiếu hợp đồng DTO với frontend đang chạy** (`frontend/src/types/index.ts`): đã đổi tên field về đúng contract đang được compile trong `QAQCModule.tsx` / `HSEModule.tsx` —
  `strengthR28Mpa`, `strengthR7Mpa`, `requiredStrengthMpa`, `sampleCode`, `ncrNumber`, `inspectionCode`, `ptwNumber`, `permitType`, `incidentCode`, `lostDays`, `remedialAction`;
  enum PTW chuẩn hoá về `WORKING_AT_HEIGHT` (bỏ `WORK_AT_HEIGHTS`); bổ sung `concrete_batches.slump_mm`.
  Kèm §7.3 "Canonical DTO Contract & Frontend Compatibility" + bảng chiếu enum DB → DTO cho cả 2 spec.

### Decisions Made
- [x] Số hiệu Module 08 = QA/QC, Module 09 = HSE — xác nhận theo `docs/plans/ENTERPRISE_ARCHITECTURE_ROADMAP.md` (bản `MASTER_ROADMAP.md` cũ đã lịch sử).
- [x] Tên file theo đúng bảng nhiệm vụ của roadmap: `SPEC-08-QAQC-INSPECTION.md`, `SPEC-09-HSE-SAFETY-PTW.md`.
- [x] FK chéo schema không cưỡng chế khi schema đích chưa được migrate (`inventory_mgmt` V3, `equipment_mgmt` V4) — dùng logical reference để `V6` deploy độc lập.
- [x] Mọi ngưỡng nghiệm thu (bê tông, siêu âm hàn, SLA) nằm trong bảng cấu hình có ngày hiệu lực, không hard-code trong service.
- [x] Quy tắc 2 bình chữa cháy áp dụng cho cả `HOT_WORK` và `WORKING_AT_HEIGHT` — khớp phản ánh của Tester trong TASK-024.
- [x] Business rule giữ trên **state machine DB**; DTO chỉ là lớp chiếu (projection) — đã ghi rõ trong §7.3.5 / §7.3.4.

### Next Recommended Actions
1. Lead review & duyệt SPEC-08 / SPEC-09, trả lời các câu hỏi mở ở §12 (ngưỡng bê tông, tiêu chí UT, ngưỡng toolbox 90%, nguồn `total_hours_worked`).
2. Developer (TASK-023) hiện thực `V6__create_qaqc_and_hse_tables.sql` + JPA/Service/Controller theo entity mapping contract §6.1; **bắt buộc** implement đúng 6 endpoint read mà frontend đang gọi: `/qaqc/inspections`, `/qaqc/concrete-tests`, `/qaqc/ncrs`, `/hse/permits`, `/hse/incidents`, `/hse/toolbox`.
3. Tester (TASK-024) viết `ConcreteStrengthServiceTest` & `PermitToWorkServiceTest` theo AC-08-01/02/03 và AC-09-01/02/03.
4. Lead: `MASTER_ROADMAP.md` nên được ghi chú là đã bị `ENTERPRISE_ARCHITECTURE_ROADMAP.md` thay thế để tránh trích dẫn sai số hiệu phân hệ.

---

## Session: 2026-10-21 (TASK-025 — Đặc tả Module 10 Nhân lực & Module 11 Kế toán WIP/POC)

### Summary
- **Deliverables (BA Agent, PC-4 `ba-hant_lap`)**:
  - `docs/specs/SPEC-10-WORKFORCE-ATTENDANCE.md` — Module 10 Nhân lực, Chấm công FaceID/GPS & Bảng lương:
    22 User Stories → 24 Gherkin AC; 9 quy trình (vòng đời chấm công ngày, cây quyết định FaceID + GPS, offline sync idempotent, làm thêm giờ với trần luật định, tổ đội khoán, đóng bảng lương & hạch toán GL, tranh chấp công, vòng đời đồng thuận sinh trắc học theo NĐ 13/2023, audit trail);
    PostgreSQL DDL schema `workforce_mgmt` (**32 bảng**, `V7__create_workforce_tables.sql`); 27 REST endpoint; 4 màn hình UI.
  - `docs/specs/SPEC-11-WIP-ACCOUNTING.md` — Module 11 Kế toán chi phí dở dang (TK 154), doanh thu POC & đối chiếu nghiệm thu:
    24 User Stories → 24 Gherkin AC; 9 quy trình (tích lũy chi phí, đóng kỳ tháng, tính/duyệt POC, doanh thu–hóa đơn–TK 337, FIDIC IPC, EAC & lỗ dự kiến, sửa sai bằng đảo bút toán, đối chiếu thuế, Variation Order);
    PostgreSQL DDL schema `accounting_mgmt` (**24 bảng**, `V8__create_wip_accounting_tables.sql`); 35 REST endpoint; 5 màn hình UI.

### Decisions Made
- [x] Tách `employees` (đối tượng lương ADB) khỏi `workers` (danh tính công trường, gồm cả thầu phụ) — chấm công thầu phụ phục vụ FIDIC/HSE/PPC nhưng không vào bảng lương ADB.
- [x] FaceID/GPS theo NĐ 13/2023: không theo dõi nền, đồng thuận trước, xóa template khi rút đồng thuận, lưu ảnh 90 ngày.
- [x] POC ba phương pháp (`COST_TO_COST`, `SURVEY_CERTIFIED`, `MILESTONE`); WIP = chi phí phát sinh − POC × EAC; TK 337 là cầu nối doanh thu và hóa đơn.
- [x] Lỗ dự kiến ghi nhận ngay theo VAS 15 đoạn 36; giữ lại bảo hành 3–5% theo NĐ 06/2021; thu hồi tạm ứng có trần; sửa sai chỉ bằng đảo bút toán.
- [x] Chi phí từ module khác chỉ gửi **cost transaction**, SPEC-11 sở hữu toàn bộ bút toán và khóa kỳ.
- [x] Ghi rõ xung đột đánh số: TASK-025 dùng Module 10 = Nhân lực, Module 11 = WIP; roadmap gọi WIP là Phân hệ 10.

### Verification
- Cấu trúc đủ 11 mục theo `docs/ai/templates/SPEC.md`; không còn marker tạm.
- 26 khối JSON trong SPEC-11 parse thành công bằng `json.loads`; 104 dấu code fence cân bằng.
- Rà soát thủ công DDL: sửa trigger `trg_journal_balance` để chặn `INSERT` trực tiếp trạng thái `POSTED` (trước đó có thể bỏ qua kiểm tra cân đối); thống nhất cờ `is_postable` cho TK 131/154 với ma trận bút toán.
- Kiểm tra cú pháp DDL bằng `pglast 8.7` (libpg_query PostgreSQL 17): SPEC-10 **94 câu lệnh OK**, SPEC-11 **87 câu lệnh OK**, 0 lỗi cú pháp.
- **Chưa execute DDL trên PostgreSQL thật** (khác TASK-022). Cần Developer/Tester chạy `V7` + `V8` trên database tạm trước khi lập trình.

### Next Recommended Actions
1. Lead review & duyệt SPEC-10 / SPEC-11; trả lời câu hỏi mở §11.3 (POC method mặc định, thẩm quyền duyệt EAC, retention 3% hay 5%, tỷ giá USD).
2. Tester/Developer chạy `V7` + `V8` trên PostgreSQL 17 tạm; xác nhận 56 bảng, trigger, seed tài khoản và các generated column.
3. Developer hiện thực `V7` + `V8` cùng package `com.anhduongbuilding.erp.workforce` / `.accounting`; ưu tiên cost ingestion idempotent và POC cost-to-cost.
4. Tester xây golden dataset 12 kỳ-dự án (gồm 1 dự án lỗ dự kiến, 1 dự án survey) đối chiếu Excel do Kế toán trưởng ký.

---

## Session: 2026-10-21 (Production Tier-1 EPC Command Center Overhaul & BA Unblocking)

### Summary
- **Unblocked BA Agent & Engine Resilience**:
  - Diagnosed TASK-025 & TASK-032 hang: Windows non-TTY stdin pipe deadlock and expired OpenCode API key.
  - Refactored `agentforge/agent/engines.py`: added `stdin=subprocess.DEVNULL`, `--auto` parameter, 180s timeout, and immediate auto-fallback to `AntigravityEngine (gemini-3.8-flash-high)`.
  - Upgraded `agentforge/agent/agent_daemon.py`: automated `git pull --rebase origin main` before executing any task.
  - Unblocked TASK-032 via Hub reset API (`/api/tasks/TASK-032/reset`) and restarted `agentforge-hub`. All 4 physical cluster agents (`lead-hantpc`, `ba-hant_lap`, `developer-desktop-cgqq2oo`, `tester-desktop-khkher1`) are 100% online, healthy, and idle.
- **Frontend Complete Rebuild (Autodesk / Procore Grade EPC Command Center)**:
  - Eliminated the low-density static UI.
  - Rebuilt `frontend/src/` with Light/Dark mode switcher (`Header.tsx` & `App.tsx`).
  - Implemented high-density Executive Command Center (`ProjectDashboard.tsx`):
    - Real interactive S-Curve SVG chart (Planned Value vs Actual Progress vs Earned Value with hover tooltips).
    - Multi-phase mini-Gantt milestone progression cards.
    - Weather forecast radar (temperature, rain probability, wind speed) and Tower Crane Operating Radar (wind safety limit < 14 m/s).
    - Quick Action approval drawers and slide-overs.
  - Completed modules:
    - Module 10 & 11 (`WorkforceWIPModule.tsx`): GPS FaceID attendance with geofence validation & WIP percentage of completion revenue recognition per Circular 200.
    - Module 12 (`FidicClaimsVOModule.tsx`): FIDIC Clause 20.1 28-day notice rule tracking & Variation Orders workflow.
- **Deployment & Cloudflare Tunnel Verification**:
  - Built & deployed `erp-adb-frontend` Docker container on Ubuntu Server `192.168.1.50`.
  - Verified live access via Cloudflare tunnel: `https://resolved-commander-price-reduces.trycloudflare.com` (HTTP 200 OK).
  - Pushed all tools, documentation, and code changes to both repositories: `Agent-chat-team-4-local.git` and `Erp-ADB-Building.git`.

### Next Recommended Actions
1. Maintain continuous multi-agent execution across Lead, BA, Dev, and Tester for advanced features (BIM 3D visual integration, automated monthly billing, sub-contractor portal).
2. Monitor background tasks and keep physical agent daemons running with live health checks.



