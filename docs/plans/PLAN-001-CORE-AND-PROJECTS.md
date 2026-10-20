# PLAN-001: Kế hoạch Phát triển Giai đoạn 1 — Nền tảng Core IAM, Quản lý Dự án WBS & Nhật ký Công trường

> **Lead Architect**: Lead Agent (PC-3)  
> **Áp dụng cho**: BA Agent (PC-4), Developer Agent (PC-1), Tester Agent (PC-2)  
> **Trạng thái**: Đang thực thi (In Progress)  
> **Mục tiêu**: Hoàn thiện bộ khung Core IAM, phân quyền dự án đa cấp, phân rã tiến độ WBS 4 cấp độ và số hóa nhật ký thi công điện tử theo Nghị định 06/2021/NĐ-CP.

---

## 1. Tầm nhìn & Ý tưởng Cốt lõi của ERP Ánh Dương Building

**Ánh Dương Building (ADB)** là Tổng thầu Thiết kế & Thi công (Design & Build) Hạng I tại Việt Nam. Điểm khác biệt sống còn của ERP xây lắp so với ERP bán hàng thông thường:
1. **Quản trị theo từng Công trình (Project-centric)**: Mọi chi phí (vật tư, nhân công, máy thi công, chi phí thầu phụ) đều gắn chặt với mã công trình (`projectId`) và mã công việc WBS (`wbsCode`).
2. **Tiến độ kép (Schedule vs Cost / EVM)**: Không chỉ theo dõi % hoàn thành vật lý, mà đo lường giá trị khối lượng thực hiện (Earned Value - EV) so với chi phí thực tế (Actual Cost - AC) để cảnh báo sớm lỗ/lãi.
3. **Pháp lý xây dựng Việt Nam**:
   - Nhật ký thi công điện tử theo **Nghị định 06/2021/NĐ-CP** (thời tiết, nhân lực, công việc trong ngày, chữ ký CHT & TVGS).
   - Quản lý chi phí và định mức theo **Thông tư 12/2021/TT-BXD**.
   - Hợp đồng giao khoán thầu phụ theo chuẩn **FIDIC**.

---

## 2. Phân rã Nhiệm vụ Đa tác nhân (Task Breakdown)

| Task ID | Tiêu đề Nhiệm vụ | Vai trò Phụ trách | Đầu ra Bắt buộc |
|---|---|---|---|
| **TASK-008** | Soạn thảo Đặc tả Module 04: Quản lý Thầu phụ & Thanh toán PPC | **BA** (`ba-hant_lap`) | File `docs/specs/SPEC-04-SUBCONTRACTORS.md` |
| **TASK-009** | Hiện thực hóa Bộ API Quản lý Dự án & Nhật ký Công trường | **Developer** (`developer-desktop-cgqq2oo`) | Code Spring Boot Controller, Service, DTO trong `backend/` |
| **TASK-010** | Xây dựng Bộ Kiểm thử Tự động JUnit 5 cho Project Service | **Tester** (`tester-desktop-khkher1`) | Unit Tests JUnit 5 & Mockito trong `backend/src/test/` |

---

## 3. Tiêu chí Nghiệm thu Kỹ thuật (Acceptance Criteria)

1. **BA Agent**:
   - Đặc tả rõ các luồng: Ký hợp đồng thầu phụ, nghiệm thu khối lượng hoàn thành, trừ tiền tạm ứng (advance payment deduction), giữ lại bảo hành 5% (retention rate), và xuất chứng chỉ PPC.
2. **Developer Agent**:
   - Đảm bảo các API `GET /api/v1/projects`, `GET /api/v1/projects/{id}/wbs`, `POST /api/v1/projects/{id}/site-diaries` trả về JSON chuẩn, không bị lỗi đệ quy serialization.
3. **Tester Agent**:
   - Đảm bảo 100% test case kiểm tra tính toán tự động % tiến độ dự án từ các hạng mục con WBS chạy pass.
