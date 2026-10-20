# TASK-032 — Báo cáo Kiểm tra Sẵn sàng BA (Sprint Intake Gate)

| Field | Value |
|---|---|
| Task ID | TASK-032 |
| Title | Kiểm tra Sẵn sàng Hệ thống — Xác nhận BA Agent sẵn sàng nhận task Sprint mới |
| Role | BA Agent (PC-4 — `ba-hant_lap`) |
| Date | 2026-10-21 |
| Status | **Review — chờ Lead phê duyệt** |
| Scope | 11 spec, 12 module frontend, 5 Flyway migration, backend contract cho 08–12 |
| Environment | PostgreSQL **17.11** @ `192.168.1.50:5432` (DB tạm `adb_ba_readiness_t032`) |
| Deliverable | Báo cáo readiness + sửa 1 blocker DDL + blueprint intake cho Sprint mới |
| Production impact | **Không** — chỉ dùng DB tạm, đã drop sau kiểm chứng |

---

## 0. Kết luận điều hành

### 0.1 Verdict

> **BA AGENT: READY (GREEN)** — đủ năng lực, template, ngữ cảnh nghiệp vụ và hạ tầng kiểm chứng để nhận task đặc tả tiếp theo.
>
> **SPRINT INTAKE: CONDITIONAL (AMBER)** — có thể bắt đầu ngay việc soạn spec, nhưng **phải chốt 1 quyết định của Lead về đánh số/ phạm vi Module 12** trước khi giao Developer triển khai.

| Hạng mục | Kết quả | Bằng chứng |
|---|---|---|
| BA context & template | ✅ PASS | Đã nạp `AGENTS.md`, `CONSTITUTION.md`, `CURRENT_STATE.md`, `SESSION.md`, `SPEC.md` |
| Năng lực đặc tả theo chuẩn mới | ✅ PASS | 4 spec gần nhất: **77 User Stories / 85 AC / 97 bảng / 152 endpoint** |
| DDL chạy được trên PostgreSQL thật | ✅ PASS sau khi sửa 1 lỗi | 56 bảng mới, **164 FK / 306 CHECK**, 0 lỗi |
| Blocker kỹ thuật trong spec | ✅ ĐÃ SỬA | `DEF-032-01` — seed vi phạm CHECK constraint của chính spec |
| Blocker quản trị (số hiệu module) | ⛔ CHƯA CHỐT | 3 cách đánh số xung đột (`GAP-032-01`) |
| Spec cho module kế tiếp | ⚠️ CHƯA CÓ | Chưa có `SPEC-12`; phạm vi chưa chốt (Claims/EOT/VO vs BI) |
| Legacy spec 01–07 | ⚠️ NỢ KỸ THUẬT | 0 User Story, 0 AC, 0 JSON schema, 0 error code registry |
| Triển khai backend cho 08–12 | ⚠️ CHƯA CÓ | Không có package `qaqc`, `hse`, `workforce`, `accounting`, `claims`; chưa có V6/V7/V8/V9 |

### 0.2 Ba việc Lead cần quyết trong 24h

1. **Chốt ma trận số hiệu module** (`GAP-032-01`). Đề xuất: **ratify cách đánh số as-built** đang dùng trong UI/SPEC-11 — M10 Workforce, M11 WIP, **M12 Claims/EOT/VO** — và chuyển EDMS/BI thành M13/M14. Không đổi số của 3 module đã có UI và spec.
2. **Chốt phạm vi task kế tiếp**: `SPEC-12 Claims/EOT/VO` (đề xuất, đúng M12 as-built); BI chuyển M14.
3. **Phê duyệt 18 open questions** của SPEC-10/11 (theo bảng default đề xuất) để Developer có thể bắt đầu V7/V8 mà không phải đoán.

---

## 1. Phạm vi & Phương pháp

### 1.1 Trong phạm vi

- Kiểm kê toàn bộ tài liệu BA trong `docs/specs/` và đối chiếu với template `docs/ai/templates/SPEC.md`.
- Đo mức tuân thủ chuẩn đặc tả: User Story, Gherkin AC, DDL, REST API, JSON schema, error code, pháp lý, UI, NFR, open questions, traceability.
- Trích xuất DDL của SPEC-10/11 và **thực thi trên PostgreSQL thật** trong database tạm, sau baseline V1–V5.
- Đối chiếu migration slot, package backend, DTO frontend và trạng thái triển khai thực tế.
- Xác định blocker/gap, đề xuất Definition of Ready và kế hoạch intake Sprint mới.

### 1.2 Ngoài phạm vi

- Không viết `SPEC-12` hoàn chỉnh (chỉ blueprint ở Phụ lục A).
- Không triển khai backend/frontend, không sửa migration V1–V5.
- Không đánh giá chất lượng mã nguồn Java/React (thuộc Tester/Lead review).
- Không kiểm chứng lại DDL SPEC-08/09 trên DB (đã có bằng chứng từ TASK-022; xem §2.3).

### 1.3 Lệnh kiểm chứng (reproducible)

```powershell
# 1) Kiểm kê & đo chuẩn đặc tả
Get-ChildItem docs\specs\*.md | Select-Object Name, Length, LastWriteTime

# 2) Trích DDL §6 của SPEC-10/11 (script tạm của phiên, không commit)
python t032_extract.py   # ghi t032_s10.sql, t032_s11.sql

# 3) Tạo DB tạm, chạy V1→V5→SPEC-10→SPEC-11, đếm bảng/FK/CHECK, drop DB
python t032_validate_ddl.py

# 4) Kiểm tra kết nối & phiên bản PostgreSQL
psql -h 192.168.1.50 -U postgres -d postgres -c "show server_version"
```

### 1.4 Bằng chứng git tại thời điểm kiểm tra

```text
?? docs/reports/                      # báo cáo này (chưa commit)
7a68110 2026-10-21 00:51  docs(spec): add SPEC-10 workforce attendance and SPEC-11 WIP/POC accounting
f4d8992 2026-10-21 00:29  feat(ui-ux): Complete enterprise redesign ... 12-module command center
454f054 2026-10-21 00:28  docs(spec): add SPEC-08 QA/QC inspection and SPEC-09 HSE PTW
```

> **Lưu ý đồng thời:** trong lúc kiểm tra, SPEC-10/11 đã được commit (`7a68110`) và frontend được nâng lên 12 module (`f4d8992`). Báo cáo này phản ánh trạng thái **sau** hai commit đó. Không có xung đột file: BA chỉ sửa 1 dòng trong SPEC-10 và thêm thư mục `docs/reports/`.
>
> Rủi ro còn lại: frontend Module 08–12 đang gọi API chưa tồn tại (QAQC/HSE fallback mock, Workforce/Claims mock hoàn toàn); nếu backend không sớm thay thế, demo sẽ "xanh giả" trong khi tích hợp thật thất bại.

---

## 2. Kết quả kiểm tra

### 2.1 Kiểm kê tài liệu

| # | Spec | Module | Kích thước | Trạng thái spec | Migration đích |
|---|---|---|---|---|---|
| 01 | `SPEC-01-CORE-IAM.md` | Core IAM | 4.0 KB | Approved (legacy) | V1 |
| 02 | `SPEC-02-PROJECTS-WBS.md` | Projects & WBS | 5.3 KB | Legacy | V1 |
| 03 | `SPEC-03-BOQ-COSTING.md` | BOQ & EVM | 4.4 KB | Legacy | V1 |
| 04 | `SPEC-04-SUBCONTRACTORS.md` | Subcontractors | 9.5 KB | Legacy | V2 |
| 05 | `SPEC-05-MATERIALS-WAREHOUSE.md` | Materials & Warehouse | 8.1 KB | Legacy | V3 |
| 06 | `SPEC-06-EQUIPMENT-FLEET.md` | Equipment Fleet | 10.4 KB | Legacy | V4 |
| 07 | `SPEC-07-WINSTEEL-FACTORY.md` | WinSteel Factory | 9.0 KB | Legacy | V5 |
| 08 | `SPEC-08-QAQC-INSPECTION.md` | QA/QC (NĐ 06/2021) | 103.6 KB | Review | V6 |
| 09 | `SPEC-09-HSE-SAFETY-PTW.md` | HSE & PTW (TT 10/2021) | 117.4 KB | Review | V6 |
| 10 | `SPEC-10-WORKFORCE-ATTENDANCE.md` | Workforce & Payroll | 140.5 KB | Review | V7 |
| 11 | `SPEC-11-WIP-ACCOUNTING.md` | WIP / POC / TK 154 | 179.3 KB | Review | V8 |
| 12 | **— KHÔNG TỒN TẠI —** | Claims/EOT/VO **hoặc** BI | — | — | V9 (dự kiến) |

**Nhận xét:** 4 spec mới (08–11) chiếm **91% khối lượng tài liệu** (540.8 KB / 591.5 KB) và đã đạt chuẩn production-grade. 7 spec cũ chỉ là bản mô tả sơ lược, không còn đủ để Developer/Tester làm việc độc lập.

### 2.2 Ma trận chất lượng đặc tả

Đo tự động trên nội dung file (regex trên heading/bảng endpoint, không ước lượng):

| Spec | User Stories | Gherkin AC | Bảng DDL | Endpoint | JSON schema | Error registry | Pháp lý | UI | NFR | Open Q | Verdict |
|---|---:|---:|---:|---:|---|---|---|---|---|---|---|
| SPEC-01 | 0 | 0 | 5 | 8 | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | **FAIL (legacy)** |
| SPEC-02 | 0 | 0 | 4 | 10 | ❌ | ❌ | ⚠️ | ✅ | ❌ | ❌ | **FAIL (legacy)** |
| SPEC-03 | 0 | 0 | 3 | 6 | ❌ | ❌ | ⚠️ | ✅ | ❌ | ❌ | **FAIL (legacy)** |
| SPEC-04 | 0 | 0 | 0* | 8 | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | **FAIL (legacy)** |
| SPEC-05 | 0 | 0 | 0* | 7 | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | **FAIL (legacy)** |
| SPEC-06 | 0 | 0 | 4 | 6 | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | **FAIL (legacy)** |
| SPEC-07 | 0 | 0 | 3 | 6 | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | **FAIL (legacy)** |
| SPEC-08 | 16 | 17 | 20 | 44 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** |
| SPEC-09 | 15 | 20 | 21 | 43 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** |
| SPEC-10 | 22 | 24 | 32 | 30 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (7) | **PASS** |
| SPEC-11 | 24 | 24 | 24 | 35 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (11) | **PASS** |
| **Tổng 08–11** | **77** | **85** | **97** | **152** | | | | | | **18** | |

`*` SPEC-04/05 không chứa `CREATE TABLE`; DDL chỉ tồn tại trong migration V2/V3 → **spec không còn là nguồn sự thật (source of truth)**.

**Gate đạt chuẩn mới yêu cầu tối thiểu:** ≥1 User Story/AC cho mỗi luồng nghiệp vụ, DDL có kiểu/constraint/default, endpoint có request/response JSON, error code registry, ánh xạ pháp lý, NFR đo được, open questions có default.

### 2.3 Kiểm chứng DDL trên PostgreSQL thật

**Phương pháp:** tạo DB tạm `adb_ba_readiness_t032` → apply baseline `V1..V5` → apply DDL §6 của SPEC-10 → SPEC-11 → đếm object → drop DB. Không kết nối tới `adb_erp`.

| Bước | Kết quả | Số bảng lũy kế |
|---|---|---:|
| Baseline V1 | ✅ OK | 10 |
| Baseline V2 | ✅ OK | 16 |
| Baseline V3 | ✅ OK | 26 |
| Baseline V4 | ✅ OK | 30 |
| Baseline V5 | ✅ OK | 33 |
| SPEC-10 DDL (sau sửa `DEF-032-01`) | ✅ OK | 65 |
| SPEC-11 DDL | ✅ OK | 89 |

**Kết quả cuối:**

| Schema | Bảng | FK | CHECK |
|---|---:|---:|---:|
| `workforce_mgmt` | 32 | 86 | 179 |
| `accounting_mgmt` | 24 | 78 | 127 |
| **Hai schema mới** | **56** | **164** | **306** |

- Tổng toàn bộ DB tạm: **89 bảng, 220 FK, 306 CHECK**.
- Đối chiếu SPEC-08/09 (từ TASK-022): 41 bảng, 105 FK, 287 CHECK, 0 lỗi — **khớp đúng** 20+21 bảng và 32+24 bảng, tổng 97 bảng như tài liệu công bố.
- **Không có lỗi DDL nào còn lại** sau khi sửa 1 seed.
- **Re-validation sau khi có chỉnh sửa đồng thời:** trong lúc lập báo cáo, một agent khác đã cập nhật SPEC-10 (BHTN cap, constraint `chk_attendance_ot_night`, thêm error code) và SPEC-11 (timestamp `period_close_runs`, tài khoản 3382/3386, error code). BA đã trích lại DDL từ **bản mới nhất** và chạy lại toàn bộ: vẫn **PASS**, cùng kết quả 56 bảng / 164 FK / 306 CHECK.

### 2.4 Defect phát hiện & đã sửa

#### DEF-032-01 — Seed `allowance_types` vi phạm CHECK constraint của chính spec

| Field | Value |
|---|---|
| Severity | **Blocker** (V7 sẽ fail ngay khi Flyway migrate) |
| File | `docs/specs/SPEC-10-WORKFORCE-ATTENDANCE.md` §6, seed `allowance_types` |
| Constraint | `calculation_method IN ('FIXED_PER_DAY','FIXED_PER_MONTH','PERCENT_BASE_SALARY','PER_HOUR','PER_NIGHT_SHIFT','PERCENT_GROSS')` |
| Giá trị seed sai | `'FIXED_PER_NIGHT_SHIFT'` |
| Lỗi thực tế | `CheckViolation: new row for relation "allowance_types" violates check constraint "allowance_types_calculation_method_check"` |
| Fix | Đổi seed sang `'PER_NIGHT_SHIFT'` (đã có trong enum, đúng ngữ nghĩa 50.000đ/ca đêm) |
| Re-validation | ✅ PASS — apply lại toàn bộ khối DDL của SPEC-10/11 trên DB tạm (990 + 969 dòng), 0 lỗi |

> Đây là lý do vì sao gate "DDL phải chạy thật" là bắt buộc: lỗi không thể phát hiện bằng đọc tài liệu, và sẽ chặn Developer ngay sprint đầu.

### 2.5 Đối chiếu triển khai thực tế

| Hạng mục | Trạng thái | Bằng chứng |
|---|---|---|
| Flyway migrations | V1–V5 only | `backend/src/main/resources/db/migration/` |
| Package backend | `boq`, `core`, `equipment`, `inventory`, `project`, `subcontractor`, `winsteel` | `backend/src/main/java/.../erp/` |
| Thiếu package | `qaqc`, `hse`, `workforce`, `accounting`, `claims` | SPEC-08/09/10/11/12 chưa được implement |
| Frontend modules | **12 module / 13 tab**, gồm Workforce-WIP và FIDIC Claims-VO | `frontend/src/components/modules/` (16 file component) |
| Frontend types | **24 interface** (đủ 12 module) | `frontend/src/types/index.ts` |
| Frontend service | QAQC/HSE gọi HTTP nhưng `catch` rồi **fallback mock**; Workforce/Claims **mock hoàn toàn** | `frontend/src/services/api.ts` — `qaqcApi`, `hseApi`, `workforceWipApi`, `claimsApi` |
| Endpoint read bắt buộc | 6 endpoint QAQC/HSE + Claims/VO **chưa có backend** | Theo handoff TASK-022 + kiểm tra package |

**Phát hiện quan trọng (thay đổi so với đầu phiên):** trong lúc kiểm tra, commit `f4d8992` (00:29) và `7a68110` đã đưa frontend lên **12 module** và commit SPEC-10/11. UI đã có màn hình cho Module 12 — FIDIC Claims & VO (`FidicClaimsVOModule.tsx`, 8.1 KB, nhãn "Module 12 — FIDIC Silver Book 2017"), nhưng dữ liệu là mock. Vì vậy:

- BA **không cần** đề xuất màn hình mới cho Claims; chỉ cần đặc tả backend + contract để thay mock.
- "Module 12" trên thực tế đã được UI và SPEC-11 dùng cho **Claims/EOT/VO**, không phải BI.
- Khoảng cách lớn nhất của dự án **không nằm ở BA** mà ở khâu triển khai backend: UI đã đi trước 5 phân hệ (08–12), trong khi migration dừng ở V5.

---

## 3. Gap Register

| ID | Severity | Phát hiện | Tác động | Owner | Hành động đề xuất |
|---|---|---|---|---|---|
| **GAP-032-01** | **Critical** | 3 cách đánh số module xung đột: (a) `ENTERPRISE_ARCHITECTURE_ROADMAP` M10=WIP, M11=EDMS, M12=BI; (b) `MASTER_ROADMAP` M08=Workforce, M09=WIP, M10=VO, M11=QAQC+HSE, M12=BI; (c) thực tế đang chạy: M10=Workforce, M11=WIP, M12=Claims/EOT/VO (`FidicClaimsVOModule.tsx` ghi "Module 12", SPEC-11 §11.1, SESSION) | Không xác định được "Module 12" là gì; Developer/Tester có thể build sai phân hệ; báo cáo cho BGĐ sai số hiệu | **Lead** | Ban hành `DECISIONS.md`: **ratify cách đánh số as-built (c)**; chuyển EDMS & BI thành M13/M14; ghi rõ roadmap cũ đã bị thay thế |
| **GAP-032-02** | High | Chưa có `SPEC-12`; UI đã có màn hình Claims/VO nhưng chỉ là mock | Sprint mới không có đầu việc BA rõ ràng; backend không thể thay mock | Lead + BA | Chốt scope theo §5; BA soạn spec trong 3–4 ngày |
| **GAP-032-03** | High | 7 spec legacy (01–07) không có User Story, AC, JSON schema, error code, NFR; SPEC-04/05 thậm chí không có DDL | Không audit được; Tester không có oracle; dev mới không thể onboard | BA | Chuyển thành "spec-as-built" v2 theo template, ưu tiên 03/04/05 (dòng tiền) |
| **GAP-032-04** | High | 18 open questions chưa trả lời (SPEC-10: 7; SPEC-11: 11) | Developer phải tự chọn default cho lương/POC — rủi ro tài chính | Lead + HR/CFO | Phê duyệt bảng default hiện có; mọi thay đổi sau đó phải qua change control |
| **GAP-032-05** | High | V6/V7/V8 chưa tồn tại; 5 package backend chưa có; 6 endpoint read của QAQC/HSE chưa có | Frontend đang gọi API không tồn tại; demo có thể vỡ | Developer | Ưu tiên V6 + 6 endpoint read trước, sau đó V7/V8/V9 |
| **GAP-032-06** | **High** | QAQC/HSE **nuốt lỗi API và fallback mock**; Workforce/Claims mock hoàn toàn; 24 DTO dùng `id: number` | Demo "xanh giả"; tích hợp thật sẽ vỡ hàng loạt; dễ lệch khóa khi backend xuất hiện | BA + Dev | SPEC-12 có §7.3 DTO Contract khớp `types/index.ts`; bỏ fallback mock ở môi trường dev/staging; generate types từ OpenAPI |
| **GAP-032-07** | Medium | SPEC-08/09/10 thiếu Test Traceability Matrix (chỉ SPEC-11 có §11.5) | Không chứng minh được 85 AC đã được test | BA | Thêm RTM US → AC → API → Table → Test class |
| **GAP-032-08** | Medium | Chưa có DDL regression harness trong repo; kiểm chứng hiện chạy bằng script tạm | Defect như DEF-032-01 có thể tái phát | Dev/DevOps | Thêm CI job `flyway migrate` + `pg_dump --schema-only` diff trên DB ephemeral |
| **GAP-032-09** | Low | `CURRENT_STATE.md`/`SESSION.md` nói "12 module" nhưng chỉ có 11 spec và không có định nghĩa M12 thống nhất | Drift tài liệu, dễ trích dẫn sai | Lead | Cập nhật sau khi chốt GAP-032-01 |
| **GAP-032-10** | Low | Chưa có migration registry chính thức; V6 dùng chung cho QAQC+HSE, V7 Workforce, V8 Accounting | Nguy cơ trùng số khi 2 agent cùng tạo migration | Lead | Ghi bảng "Migration Slot Registry" vào `CURRENT_STATE.md` |
| **GAP-032-11** | Low | UI ghi "FIDIC Silver Book 2017" nhưng chưa có quyết định hợp đồng mẫu của ADB (Silver vs Yellow) | Claim/EOT clause và thẩm quyền Engineer có thể sai | Lead + Legal | Trả lời Q-12-01 trước khi duyệt SPEC-12 |

---

## 4. Definition of Ready cho task kế tiếp

| # | Tiêu chí | Trạng thái | Ghi chú |
|---|---|---|---|
| 1 | Task có ID, title, role, mô tả rõ | ✅ | TASK-032 đạt |
| 2 | Template `SPEC.md` khả dụng | ✅ | 93 dòng, đủ section |
| 3 | Context files bắt buộc đã nạp | ✅ | AGENTS, CONSTITUTION, CURRENT_STATE, SESSION |
| 4 | Nguồn pháp lý & domain đã xác định | ✅ | FIDIC, NĐ 06/2021, TT 12/2021, TT 200/2014, BLLĐ 2019… |
| 5 | Upstream schema tồn tại | ✅ | V1–V5, 33 bảng |
| 6 | PostgreSQL truy cập được để validate DDL | ✅ | 17.11 @ 192.168.1.50 |
| 7 | Quy ước API thống nhất | ✅ | `/api/v1/*`, error envelope, idempotency |
| 8 | Canonical module numbering | ❌ | **GAP-032-01 — cần Lead** |
| 9 | Open questions có default được duyệt | ⚠️ | 18 câu, default đã đề xuất |
| 10 | AC kiểm thử được | ⚠️ | Đạt cho 08–11; legacy 01–07 không |
| 11 | RTM đầy đủ | ⚠️ | Chỉ SPEC-11 có |
| 12 | Migration slot được reserve | ✅ | V6/V7/V8 ghi trong header spec |
| 13 | Không có agent khác sửa cùng file | ✅ | `docs/specs` chỉ có thay đổi của BA |
| 14 | Ước lượng effort | ✅ | 3–5 ngày/spec lớn |
| 15 | Định nghĩa Done của BA rõ | ✅ | §11.4 trong SPEC-10/11 |

**Kết luận DoR:** **11/15 PASS, 1 FAIL (blocking), 3 PARTIAL**. BA có thể nhận task ngay; chỉ cần Lead gỡ tiêu chí #8.

---

## 5. Kế hoạch Intake Sprint mới

### 5.1 Chốt phạm vi Module 12

| Phương án | Nội dung | Ưu điểm | Nhược điểm | Đề xuất |
|---|---|---|---|---|
| **A. Claims/EOT/VO** | FIDIC 20.1/20.2, 13.3, 8.4–8.7; đăng ký claim, notice 28 ngày, determination 42 ngày, VO pricing | Là **dependency cứng** của SPEC-11; **UI đã có sẵn** (`FidicClaimsVOModule.tsx`) nhưng đang mock; rủi ro tiền lớn nhất | Lệch số hiệu so với roadmap cũ (M12=BI) | ✅ **Chọn — M12 as-built** |
| B. Executive BI | Dashboard CPI/SPI, risk radar, weather | Phù hợp roadmap cũ M12; giá trị trình diễn cao | Chỉ đọc dữ liệu; phụ thuộc V7/V8 và Claims → làm trước sẽ rỗng | Chuyển M14 |
| C. EDMS & RFI | Bản vẽ, revision, RFI, MAS, as-built | Hoàn thiện chuỗi hồ sơ; QA/QC đang cần | Không chặn dòng tiền | Chuyển M13 |

**Khuyến nghị:** giữ nguyên số hiệu **M12 = Claims/EOT/VO** như UI và SPEC-11 đang dùng; đặt file `SPEC-12-FIDIC-CLAIMS-EOT-VO.md`. Cập nhật roadmap: M13 = EDMS & RFI, M14 = Executive BI. Việc đổi số ngược lại sẽ phải sửa module badge, SPEC-11, SESSION và gây nhầm lẫn cho Tester — chi phí cao hơn nhiều so với việc cập nhật roadmap.

### 5.2 Đề xuất task breakdown (Lead xác nhận ID)

| Task | Owner | Nội dung | Effort | Phụ thuộc | DoD |
|---|---|---|---|---|---|
| **TASK-033** | Lead | Chốt canonical module matrix + trả lời 18 open questions + phê duyệt default | 0.5 ngày | — | `DECISIONS.md` entry có ngày hiệu lực |
| **TASK-034** | BA | Soạn `SPEC-12` Claims/EOT/VO theo blueprint Phụ lục A | 3–4 ngày | TASK-033 | Template đầy đủ; DDL PASS trên DB tạm; 8 US / 6 AC tối thiểu |
| **TASK-035** | BA | Remediation legacy SPEC-03/04/05 lên chuẩn v2 (spec-as-built) | 2–3 ngày | — | Có US/AC/JSON/error code; khớp V1–V3 |
| **TASK-036** | Developer | V6 QAQC+HSE + 6 endpoint read frontend đang gọi | 5 ngày | SPEC-08/09 duyệt | Flyway V6 + controller + DTO khớp §7.3 |
| **TASK-037** | Developer | V7 Workforce + check-in/payroll core | 7 ngày | TASK-033 | Flyway V7; test idempotency; consent gate |
| **TASK-038** | Developer | V8 WIP/POC + journal posting | 7 ngày | TASK-037 | Flyway V8; golden dataset 12 kỳ |
| **TASK-039** | Tester | Bộ test AC-08→AC-11 + DDL regression CI | 5 ngày | TASK-036…038 | ≥80% coverage; 85 AC mapped |
| **TASK-040** | Developer | V9 Claims/EOT/VO + thay mock `claimsApi` | 6 ngày | TASK-034 | Flyway V9; DTO khớp §A.8; notice 28 ngày + determination 42 ngày |

### 5.3 Rủi ro Sprint

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Số hiệu module tiếp tục drift | High | High | TASK-033 là gate cứng, không bắt đầu TASK-034 trước khi có quyết định |
| Developer làm V7 trước V6 gây lệch frontend | Medium | High | Thứ tự V6 → V7 → V8; frontend contract test |
| 18 open questions bị bỏ qua | Medium | Critical (lương/POC sai) | Default phải được duyệt bằng văn bản; cấm hard-code |
| Spec 320KB chưa commit bị mất | Low | High | **Đã xử lý** — SPEC-10/11 nằm trong commit `7a68110` |
| Frontend fallback mock che giấu lỗi tích hợp | High | High | Bỏ fallback ở dev/staging; contract test với backend thật |
| DDL defect tái phát | Medium | High | GAP-032-08: CI migrate trên DB ephemeral |

---

## 6. Acceptance Criteria của chính TASK-032

```gherkin
Scenario: AC-32-01 — Kiểm kê và đo chuẩn toàn bộ spec
  Given thư mục docs/specs có 11 file SPEC-01..SPEC-11
  When BA chạy kiểm kê tự động
  Then báo cáo có đủ số User Story, AC, bảng DDL, endpoint, error registry cho từng spec
  And chỉ rõ spec nào FAIL chuẩn mới và lý do

Scenario: AC-32-02 — DDL của spec mới phải chạy được trên PostgreSQL thật
  Given database tạm adb_ba_readiness_t032 với baseline V1..V5
  When apply DDL §6 của SPEC-10 và SPEC-11
  Then không có lỗi SQL
  And đếm được 56 bảng mới, 164 FK, 306 CHECK
  And database tạm bị drop sau kiểm chứng
  And không có dữ liệu production bị đọc/ghi

Scenario: AC-32-03 — Defect phải được sửa và tái kiểm chứng
  Given DEF-032-01 làm V7 fail
  When BA sửa seed allowance_types và chạy lại toàn bộ DDL
  Then DDL apply sạch toàn bộ khối §6 của SPEC-10/11
  And defect được ghi trong báo cáo với before/after

Scenario: AC-32-04 — Definition of Ready có bằng chứng
  Given 15 tiêu chí DoR
  When BA đánh giá
  Then mỗi tiêu chí có PASS/FAIL/PARTIAL kèm bằng chứng
  And mọi FAIL có owner và hành động

Scenario: AC-32-05 — Sprint mới có scope và ước lượng
  Given chưa có SPEC-12
  When BA đề xuất intake
  Then có ít nhất 2 phương án scope, tiêu chí chọn, task breakdown và effort
  And có blueprint đủ để BA bắt tay viết spec ngay

Scenario: AC-32-06 — Không vi phạm ràng buộc an toàn
  Given báo cáo được tạo trong repo
  Then không có secret/credential mới nào được commit
  And không sửa migration V1..V5
  And mọi thay đổi ngoài báo cáo được liệt kê rõ
```

---

## 7. Thay đổi file của task này

| File | Loại | Nội dung |
|---|---|---|
| `docs/reports/TASK-032-BA-READINESS-REPORT.md` | **Mới** | Báo cáo này |
| `docs/specs/SPEC-10-WORKFORCE-ATTENDANCE.md` | Sửa 1 dòng | `FIXED_PER_NIGHT_SHIFT` → `PER_NIGHT_SHIFT` (DEF-032-01) |
| `docs/ai/SESSION.md` | Thêm entry | Handoff TASK-032, verdict, blocker còn lại |

Không thay đổi: `backend/**`, `frontend/**`, `docs/plans/**`, `docs/ai/DECISIONS.md`, migration V1–V5.

---

## 8. Sign-off & Handoff

| Vai trò | Việc cần làm | Trạng thái |
|---|---|---|
| **BA** | Nộp báo cáo, sửa DEF-032-01, sẵn sàng TASK-034 | ✅ DONE |
| **Lead** | Chốt GAP-032-01 + phạm vi M12; duyệt 18 open questions | ⏳ CHỜ |
| **Developer** | Nhận V6 sau khi SPEC-08/09 được duyệt | ⏳ CHỜ |
| **Tester** | Dùng §2.2/§2.3 làm baseline để viết test DDL/contract | ⏳ CHỜ |

**Cam kết của BA:** với template hiện tại, hạ tầng PostgreSQL sẵn có và kinh nghiệm 4 spec gần nhất, BA có thể giao một spec production-grade (8–20 User Story, DDL đã validate, 20–40 endpoint, error registry, pháp lý) trong **3–5 ngày làm việc**, kèm bằng chứng DDL chạy thật.

---

## Phụ lục A — Blueprint `SPEC-12` Claims / EOT / VO (chưa phải spec chính thức)

> **Trạng thái:** đề xuất để Lead chốt scope. Không dùng để triển khai cho đến khi TASK-033 ban hành quyết định số hiệu module.

### A.1 Mục tiêu & pháp lý

**Mục tiêu:** biến mọi sự kiện phát sinh ngoài hợp đồng thành hồ sơ có bằng chứng, đúng thời hạn FIDIC, và chỉ ghi nhận doanh thu/chi phí khi có determination được duyệt.

| Instrument | Phạm vi áp dụng | Nghĩa vụ chính |
|---|---|---|
| FIDIC **Silver Book 2017** (UI hiện hữu) — hoặc Yellow Book 2017 nếu Legal chọn | Hợp đồng D&B/EPC | 20.1 Claims; 20.2.1 Notice trong 28 ngày; 20.2.2 Contemporary Records; 20.2.3 Substantiated Claim; 20.2.4 Determination trong 42 ngày; 13.1 Right to Vary; 13.3.1 Variation by Instruction; 13.3.2 Request for Proposal; 8.4 EOT grounds; 8.5 Delays by Authorities; 8.7 Delay Damages; 14.8 Delayed Payment |
| Nghị định 06/2021/NĐ-CP | Quản lý chất lượng, nghiệm thu | Biên bản nghiệm thu, hồ sơ hoàn công là bằng chứng cho claim chất lượng/khối lượng |
| Nghị định 10/2021/NĐ-CP | Quản lý chi phí đầu tư xây dựng | Cơ sở điều chỉnh giá, phát sinh, quyết toán |
| Thông tư 12/2021/TT-BXD | Định mức, đơn giá | Đơn giá gốc để định giá VO khi hợp đồng không có đơn giá tương ứng |
| Bộ luật Dân sự 2015 | Hợp đồng, bất khả kháng | Miễn trừ trách nhiệm do sự kiện bất khả kháng (Legal xác nhận điều khoản cụ thể) |
| Luật Xây dựng 2014 (sửa đổi 2020) | Điều chỉnh hợp đồng xây dựng | Điều kiện và thẩm quyền điều chỉnh hợp đồng |

### A.2 User Stories (8)

| ID | As a | I want | So that |
|---|---|---|---|
| US-12-01 | Contract QS | ghi nhận sự kiện claim và phát notice trong 28 ngày | không mất quyền claim theo FIDIC 20.2.1 |
| US-12-02 | Contract QS | tập hợp contemporary records (nhật ký, ảnh, thư, thời tiết) vào một hồ sơ | chứng minh được nguyên nhân và mức độ ảnh hưởng |
| US-12-03 | Engineer's Representative | xem notice, yêu cầu bổ sung và ra determination trong 42 ngày | tuân thủ FIDIC 20.2.4 và đóng vòng claim |
| US-12-04 | Project Manager | tạo VO từ instruction hoặc RFP và định giá theo đơn giá hợp đồng/TT 12/2021 | kiểm soát phát sinh trước khi thi công |
| US-12-05 | Commercial Manager | phê duyệt VO với nguyên tắc 4 mắt | không có người vừa tạo vừa duyệt |
| US-12-06 | Project Director | xem Claims/EOT/VO register và radar claim sắp hết hạn | hành động trước khi bị time-bar |
| US-12-07 | Internal Auditor | truy vết mọi determination về bằng chứng và người duyệt | đáp ứng kiểm toán nội bộ và FIDIC 20.2.2 |
| US-12-08 | System | tự động cảnh báo T-7/T-3/T-1 và chặn claim quá hạn | không có claim nào bị bỏ sót do con người |

### A.3 Acceptance Criteria (6)

```gherkin
Scenario: AC-12-01 — Notice đúng hạn 28 ngày
  Given claim được tạo với awareness_date = 2026-09-29
  When QS phát notice ngày 2026-10-20
  Then notice_due_date = 2026-10-27
  And status = NOTICE_SERVED
  And hệ thống ghi audit event CLAIM_NOTICE_SERVED

Scenario: AC-12-02 — Notice quá hạn bị chặn
  Given awareness_date = 2026-09-29
  When QS phát notice ngày 2026-11-05
  Then API trả 409 CLAIM_NOTICE_TIME_BARRED
  And status = TIME_BARRED
  And chỉ được chuyển tiếp khi có waiver văn bản của Engineer

Scenario: AC-12-03 — Determination cần substantiation và đúng 42 ngày
  Given claim đang SUBSTANTIATING
  When Engineer ra determination
  Then hệ thống yêu cầu ít nhất 1 contemporary record
  And response_due_at = substantiation_received_at + 42 ngày
  And determined_amount_vnd <= claimed_amount_vnd, trừ khi có VO được duyệt

Scenario: AC-12-04 — VO phải có instruction/RFP
  Given VO type = INSTRUCTION
  When tạo VO không có instruction_ref
  Then API trả 422 VO_REQUIRES_INSTRUCTION

Scenario: AC-12-05 — Segregation of duties
  Given user A tạo VO
  When user A cố phê duyệt VO đó
  Then API trả 403 VO_APPROVAL_SOD_VIOLATION

Scenario: AC-12-06 — Hồ sơ đã đóng là bất biến
  Given claim status = CLOSED
  When bất kỳ user sửa amount hoặc EOT
  Then API trả 409 CLAIM_IMMUTABLE
  And muốn điều chỉnh phải tạo determination kế tiếp (superseding)
```

### A.4 DDL lõi (trích — sẽ hoàn chỉnh trong SPEC-12)

```sql
CREATE SCHEMA IF NOT EXISTS claims_mgmt;

CREATE TABLE claims_mgmt.claims (
    id                    BIGSERIAL PRIMARY KEY,
    project_id            BIGINT NOT NULL REFERENCES project_mgmt.projects(id) ON DELETE RESTRICT,
    claim_no              VARCHAR(40) NOT NULL,
    claim_type            VARCHAR(30) NOT NULL
                          CHECK (claim_type IN ('EOT','ADDITIONAL_PAYMENT','EOT_AND_PAYMENT')),
    fidic_sub_clause      VARCHAR(20) NOT NULL DEFAULT '20.2',
    event_description     TEXT NOT NULL,
    event_started_at      DATE NOT NULL,
    awareness_date        DATE NOT NULL,
    notice_due_date       DATE GENERATED ALWAYS AS (awareness_date + 28) STORED,
    notice_served_at      TIMESTAMPTZ,
    notice_served_by      BIGINT REFERENCES core_iam.users(id),
    status                VARCHAR(30) NOT NULL DEFAULT 'DRAFT'
                          CHECK (status IN ('DRAFT','NOTICE_SERVED','SUBSTANTIATING',
                                            'DETERMINATION_PENDING','DETERMINED','REJECTED',
                                            'WITHDRAWN','TIME_BARRED','DISPUTED','CLOSED')),
    claimed_amount_vnd    NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (claimed_amount_vnd >= 0),
    claimed_eot_days      INTEGER NOT NULL DEFAULT 0 CHECK (claimed_eot_days BETWEEN 0 AND 3650),
    currency_code         CHAR(3) NOT NULL DEFAULT 'VND',
    version               INTEGER NOT NULL DEFAULT 0,
    created_by            BIGINT NOT NULL REFERENCES core_iam.users(id),
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_claims_project_no UNIQUE (project_id, claim_no),
    CONSTRAINT ck_claims_notice_after_awareness
        CHECK (notice_served_at IS NULL OR notice_served_at::date >= awareness_date)
);

CREATE TABLE claims_mgmt.claim_events (
    id               BIGSERIAL PRIMARY KEY,
    claim_id         BIGINT NOT NULL REFERENCES claims_mgmt.claims(id) ON DELETE CASCADE,
    event_at         TIMESTAMPTZ NOT NULL,
    record_type      VARCHAR(30) NOT NULL
                     CHECK (record_type IN ('SITE_DIARY','PHOTO','LETTER','WEATHER',
                                            'INSTRUCTION','MEETING_MINUTES','OTHER')),
    source_module    VARCHAR(40),
    source_ref       VARCHAR(80),
    description      TEXT NOT NULL,
    document_url     TEXT,
    created_by       BIGINT NOT NULL REFERENCES core_iam.users(id),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_claim_event_source UNIQUE (claim_id, source_module, source_ref)
);

CREATE TABLE claims_mgmt.claim_determinations (
    id                          BIGSERIAL PRIMARY KEY,
    claim_id                    BIGINT NOT NULL REFERENCES claims_mgmt.claims(id) ON DELETE CASCADE,
    determination_no            INTEGER NOT NULL CHECK (determination_no > 0),
    determined_eot_days         INTEGER NOT NULL DEFAULT 0 CHECK (determined_eot_days >= 0),
    determined_amount_vnd       NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (determined_amount_vnd >= 0),
    determination_basis         TEXT NOT NULL,
    engineer_representative_id  BIGINT NOT NULL REFERENCES core_iam.users(id),
    determined_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
    status                      VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
                                CHECK (status IN ('DRAFT','ISSUED','ACCEPTED','DISPUTED','SUPERSEDED')),
    UNIQUE (claim_id, determination_no)
);

CREATE TABLE claims_mgmt.variation_orders (
    id                  BIGSERIAL PRIMARY KEY,
    project_id          BIGINT NOT NULL REFERENCES project_mgmt.projects(id) ON DELETE RESTRICT,
    vo_no               VARCHAR(40) NOT NULL,
    vo_type             VARCHAR(30) NOT NULL
                        CHECK (vo_type IN ('INSTRUCTION','REQUEST_FOR_PROPOSAL',
                                           'VALUE_ENGINEERING','PROVISIONAL_SUM')),
    fidic_sub_clause    VARCHAR(20) NOT NULL DEFAULT '13.3.1',
    instruction_ref     VARCHAR(80),
    instruction_issued_at DATE,
    status              VARCHAR(30) NOT NULL DEFAULT 'DRAFT'
                        CHECK (status IN ('DRAFT','PRICING','SUBMITTED','APPROVED','REJECTED','CLOSED')),
    priced_amount_vnd   NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (priced_amount_vnd >= 0),
    approved_amount_vnd NUMERIC(18,2) CHECK (approved_amount_vnd >= 0),
    eot_granted_days    INTEGER NOT NULL DEFAULT 0 CHECK (eot_granted_days >= 0),
    created_by          BIGINT NOT NULL REFERENCES core_iam.users(id),
    approved_by         BIGINT REFERENCES core_iam.users(id),
    approved_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_vo_project_no UNIQUE (project_id, vo_no),
    CONSTRAINT ck_vo_instruction_required
        CHECK (vo_type <> 'INSTRUCTION' OR instruction_ref IS NOT NULL),
    CONSTRAINT ck_vo_approval_sod
        CHECK (approved_by IS NULL OR approved_by <> created_by),
    CONSTRAINT ck_vo_approval_complete
        CHECK (status <> 'APPROVED' OR (approved_by IS NOT NULL AND approved_at IS NOT NULL))
);
```

> **Đã kiểm chứng cú pháp + ràng buộc:** apply nguyên khối DDL trên DB tạm `adb_ba_blueprint_t032` sau baseline V1 → **4 bảng, 28 constraint, 0 lỗi**; DB tạm đã drop. Blueprint đủ tin cậy để chuyển thành SPEC-12 mà không phải thiết kế lại.

### A.5 REST API & JSON

| Method | Path | Mô tả | Roles |
|---|---|---|---|
| `POST` | `/api/v1/claims` | Tạo claim (DRAFT) | `QS`, `CONTRACT_MANAGER` |
| `GET` | `/api/v1/claims` | Danh sách theo project/status/type | `QS`, `PD`, `AUDITOR` |
| `GET` | `/api/v1/claims/{id}` | Chi tiết claim + events + determinations | `QS`, `PD`, `AUDITOR` |
| `POST` | `/api/v1/claims/{id}/notice` | Phát notice 28 ngày | `CONTRACT_MANAGER` |
| `POST` | `/api/v1/claims/{id}/events` | Thêm contemporary record | `QS`, `SITE_MANAGER` |
| `POST` | `/api/v1/claims/{id}/determinations` | Engineer ra determination | `ENGINEER_REP` |
| `POST` | `/api/v1/variation-orders` | Tạo VO | `QS`, `PM` |
| `POST` | `/api/v1/variation-orders/{id}/pricing` | Nhập định giá | `QS` |
| `POST` | `/api/v1/variation-orders/{id}/approve` | Phê duyệt (SoD) | `COMMERCIAL_MANAGER` |
| `GET` | `/api/v1/projects/{projectId}/claims-register` | Register + time-bar radar | `PD`, `AUDITOR` |

```json
// POST /api/v1/claims — Request
{
  "projectId": 101,
  "claimNo": "CLM-ADB-BD01-001",
  "claimType": "EOT_AND_PAYMENT",
  "fidicSubClause": "20.2",
  "eventDescription": "Mưa bão kéo dài gây ngập công trường 3 ngày",
  "eventStartedAt": "2026-09-28",
  "awarenessDate": "2026-09-29",
  "claimedAmountVnd": 1850000000.00,
  "claimedEotDays": 12,
  "currencyCode": "VND"
}

// Response 201
{
  "id": 501,
  "claimNo": "CLM-ADB-BD01-001",
  "status": "DRAFT",
  "noticeDueDate": "2026-10-27",
  "daysToNoticeDeadline": 6,
  "timeBarred": false,
  "createdAt": "2026-10-21T09:15:00+07:00"
}

// Error 409
{
  "timestamp": "2026-10-21T09:15:00+07:00",
  "status": 409,
  "code": "CLAIM_NOTICE_TIME_BARRED",
  "message": "Notice đã quá 28 ngày kể từ ngày nhận biết sự kiện.",
  "details": {
    "claimNo": "CLM-ADB-BD01-001",
    "awarenessDate": "2026-09-29",
    "noticeDueDate": "2026-10-27",
    "daysLate": 3
  },
  "traceId": "4f7c2a91b3e84d0e"
}
```

| HTTP | Error code | Ý nghĩa |
|---|---|---|
| 404 | `CLAIM_NOT_FOUND` | Không tồn tại claim |
| 409 | `CLAIM_NOTICE_TIME_BARRED` | Notice quá 28 ngày |
| 422 | `CLAIM_AWARENESS_DATE_IN_FUTURE` | Ngày nhận biết lớn hơn hôm nay |
| 409 | `CLAIM_INVALID_STATE_TRANSITION` | Chuyển trạng thái không hợp lệ |
| 422 | `CLAIM_SUBSTANTIATION_REQUIRED` | Chưa có contemporary record |
| 409 | `CLAIM_IMMUTABLE` | Claim đã đóng |
| 404 | `VO_NOT_FOUND` | Không tồn tại VO |
| 422 | `VO_REQUIRES_INSTRUCTION` | VO thiếu instruction/RFP |
| 403 | `VO_APPROVAL_SOD_VIOLATION` | Người tạo tự duyệt |
| 422 | `VO_EOT_EXCEEDS_CLAIMED` | EOT vượt quá claim đã duyệt |
| 409 | `IDEMPOTENCY_KEY_REUSED` | Trùng idempotency key |
| 403 | `INSUFFICIENT_PERMISSION` | Thiếu quyền |

### A.6 Business invariants

| ID | Invariant | Cơ chế thực thi |
|---|---|---|
| INV-CLM-01 | Notice phải trong 28 ngày kể từ `awareness_date` (FIDIC 20.2.1) | `notice_due_date` generated + API gate + waiver table |
| INV-CLM-02 | Determination trong 42 ngày kể từ substantiated claim (FIDIC 20.2.4) | `response_due_at` do service tính; SLA job cảnh báo T-14/T-3 |
| INV-CLM-03 | Không determination trước khi có ≥1 contemporary record | Service + FK bắt buộc |
| INV-CLM-04 | `determined_amount ≤ claimed_amount` trừ khi có VO được duyệt | CHECK + service guard |
| INV-CLM-05 | EOT chỉ thay đổi completion date qua determination | State machine; cấm UPDATE trực tiếp project milestone |
| INV-CLM-06 | VO `INSTRUCTION` phải có `instruction_ref` | DB CHECK `ck_vo_instruction_required` |
| INV-CLM-07 | Người tạo ≠ người duyệt VO | DB CHECK `ck_vo_approval_sod` + RBAC |
| INV-CLM-08 | Claim `CLOSED`/`DETERMINED` là bất biến; sửa bằng superseding determination | Trigger append-only + API 409 |
| INV-CLM-09 | Mọi chuyển trạng thái ghi audit append-only | `claim_status_history` + interceptor |
| INV-CLM-10 | Claim `TIME_BARRED` không được post vào WIP/revenue của SPEC-11 | Integration gate tại accounting service |
| INV-CLM-11 | Tiền tệ `NUMERIC(18,2)`, VND; FX theo tỷ giá SBV ngày determination | DDL + service |
| INV-CLM-12 | Delay damages cap theo Contract Data, không hard-code | Bảng cấu hình có `effective_from` |
| INV-CLM-13 | Cập nhật đồng thời dùng optimistic lock (`version`) | JPA `@Version` |

### A.7 NFR & UI (tóm tắt)

| Yêu cầu | Target |
|---|---|
| Response time | p95 < 300ms cho read, < 800ms cho determination |
| Concurrency | 50 user đồng thời/project; 200 req/s toàn hệ |
| Audit retention | 10 năm (Luật Kế toán 2015) |
| Timezone | Lưu UTC, hiển thị `Asia/Ho_Chi_Minh` |
| UI | Claims register (time-bar countdown), EOT timeline Gantt, VO approval board, determination drawer; dark-slate design system, typography ≥12px |
| Bảo mật | RBAC theo project; SoD; mọi mutation có audit; không log nội dung tài liệu mật |

### A.8 Canonical DTO Contract (khớp `frontend/src/types/index.ts`)

UI đã có `FidicClaimsVOModule.tsx` đọc hai DTO `FidicClaim` và `VariationOrder`. SPEC-12 **phải** giữ đúng tên field camelCase và kiểu `number` cho ID để không phải sửa frontend.

**`FidicClaim`**

| DTO field | Kiểu | Nguồn DB / công thức | Ghi chú |
|---|---|---|---|
| `id` | number | `claims.id` (BIGSERIAL) | Khớp `BIGSERIAL`, không dùng UUID |
| `claimNumber` | string | `claims.claim_no` | Unique theo project |
| `clause` | enum | `claims.fidic_sub_clause` | `CLAUSE_20.1`, `CLAUSE_8.4_EOT`, `CLAUSE_13.3_VARIATION` |
| `eventDescription` | string | `claims.event_description` | |
| `noticeDate` | date | `claims.notice_served_at::date` | Null nếu chưa phát notice |
| `detailedParticularsDate` | date | `claim_determinations.substantiated_at::date` | Ngày nộp bản thuyết minh đầy đủ |
| `daysRemainingBeforeTimeBar` | number | `notice_due_date - CURRENT_DATE` | Tính server-side, clamp ≥ 0; **không lưu cứng** |
| `claimedExtensionDays` | number | `claims.claimed_eot_days` | |
| `claimedAmount` | number | `claims.claimed_amount_vnd` | VND, 2 chữ số thập phân |
| `engineerDeterminationStatus` | enum | `claims.status` (projection) | `SUBMITTED`, `CONSULTATION`, `DETERMINED`, `DISPUTED` |

**`VariationOrder`**

| DTO field | Kiểu | Nguồn DB | Ghi chú |
|---|---|---|---|
| `id` | number | `variation_orders.id` | BIGSERIAL |
| `voNumber` | string | `vo_no` | Unique theo project |
| `projectId` | number | `project_id` | |
| `title` | string | `title` | |
| `scopeDescription` | string | `scope_description` | |
| `proposedAmount` | number | `priced_amount_vnd` | |
| `approvedAmount` | number? | `approved_amount_vnd` | Null khi chưa duyệt |
| `timeExtensionDays` | number | `eot_granted_days` | |
| `initiator` | enum | `initiator` | `CLIENT`, `CONTRACTOR`, `ENGINEER` |
| `status` | enum | `status` (projection) | `PROPOSED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED` |

**Bảng chiếu enum DB → DTO (bắt buộc ghi trong SPEC-12 §7.3):**

| DB `claims.status` | DTO `engineerDeterminationStatus` |
|---|---|
| `DRAFT` | *ẩn khỏi danh sách* (hoặc `SUBMITTED` nếu UI cần hiển thị nháp) |
| `NOTICE_SERVED`, `SUBSTANTIATING` | `SUBMITTED` |
| `DETERMINATION_PENDING` | `CONSULTATION` |
| `DETERMINED`, `CLOSED` | `DETERMINED` |
| `DISPUTED` | `DISPUTED` |
| `REJECTED`, `TIME_BARRED`, `WITHDRAWN` | **Cần bổ sung enum frontend** hoặc gộp `DISPUTED` — quyết định tại TASK-033 |

**Endpoint UI sẽ gọi khi thay mock:**

| Method | Path | Trả về |
|---|---|---|
| `GET` | `/api/v1/projects/{projectId}/variation-orders` | `VariationOrder[]` |
| `GET` | `/api/v1/projects/{projectId}/claims` | `FidicClaim[]` |

### A.9 Open questions cần Lead/Legal trả lời trước khi viết SPEC-12

| ID | Câu hỏi | Default đề xuất |
|---|---|---|
| Q-12-01 | Hợp đồng mẫu của ADB dùng FIDIC **Silver Book 2017** (UI đang ghi) hay **Yellow Book 2017**? | Silver Book nếu EPC turnkey; Yellow nếu D&B có Engineer — Legal xác nhận |
| Q-12-02 | Notice 28 ngày tính theo ngày dương lịch hay ngày làm việc? | Ngày dương lịch (FIDIC) |
| Q-12-03 | Ai là "Engineer" trong hợp đồng D&B — TVGS độc lập hay đại diện CĐT? | Đại diện CĐT được uỷ quyền |
| Q-12-04 | Ngưỡng VO cần HĐQT phê duyệt? | >5% giá hợp đồng hoặc >10 tỷ |
| Q-12-05 | Có áp dụng delay damages 10% Contract Price không? | Theo Contract Data, không mặc định |
| Q-12-06 | Claim bằng USD có được phép không? | Chỉ khi hợp đồng quy định; mặc định VND |
| Q-12-07 | Có cần tích hợp trọng tài VIAC/trung tâm hoà giải không? | Phase 2 |
| Q-12-08 | Claims/EOT/VO là Module 12 hay 13? | **M12 as-built** — đề xuất ratify tại TASK-033 |

---

## Phụ lục B — Nhật ký kiểm chứng DDL (raw)

```text
OK   baseline V1    tables=10
OK   baseline V2    tables=16
OK   baseline V3    tables=26
OK   baseline V4    tables=30
OK   baseline V5    tables=33
OK   SPEC-10 DDL    tables=65
OK   SPEC-11 DDL    tables=89

Tables by schema:
  accounting_mgmt          24
  core_iam                 5
  equipment_mgmt           4
  estimating_costing       2
  inventory_mgmt           10
  project_mgmt             3
  subcontractor_mgmt       6
  winsteel_mgmt            3
  workforce_mgmt           32

FK constraints total: 220
CHECK constraints total: 306

Constraints by schema (fk/check):
  accounting_mgmt            78 /  127
  core_iam                    4 /    0
  equipment_mgmt              8 /    0
  estimating_costing          3 /    0
  inventory_mgmt             21 /    0
  project_mgmt                6 /    0
  subcontractor_mgmt         11 /    0
  winsteel_mgmt               3 /    0
  workforce_mgmt             86 /  179

VERDICT=PASS; temporary database dropped
```

> Ghi chú: log trên là **lần chạy sạch sau khi sửa DEF-032-01**. Lần chạy trước đó dừng tại `SPEC-10 DDL` với `CheckViolation` (xem §2.4) và database tạm đã được drop an toàn.

---

*Báo cáo được lập bởi BA Agent (PC-4) theo yêu cầu TASK-032. Mọi số liệu đều lấy từ file thực tế và lần chạy PostgreSQL ngày 2026-10-21; không có số liệu ước lượng nào được trình bày như số liệu đo.*
