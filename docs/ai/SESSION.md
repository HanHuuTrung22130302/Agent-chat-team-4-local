# SESSION.md — Session Handoff Log

> **Mọi phiên làm việc kết thúc tại đây.** Ghi lại tiến độ, quyết định, và các bước tiếp theo.

---

## Session 2026-10-20 (Phase 1 & Phase 2: Core Platform, Subcontractors & FIDIC PPC)

- **Vai trò thực hiện**: Lead Agent / Orchestrator
- **Công việc đã hoàn thành**:
  1. Điều tra và giải quyết triệt để lỗi thực thi lệnh trên Windows:
     - Khi `subprocess.run(shell=True)` chạy trên Windows, các ký tự xuống dòng `\n` trong prompt khiến `cmd.exe` ngắt lệnh thành nhiều dòng, làm mất cờ `--dangerously-skip-permissions` và gây treo interactive prompt / rỗng output.
     - Đã nâng cấp `engines.py` tự động phát hiện binary `.exe` trực tiếp (`agy.exe`, `opencode.exe`) và đặt `use_shell=False`. Với `.cmd` fallback, sanitize chuỗi prompt không chứa ký tự ngắt dòng.
  2. Soạn thảo tài liệu đặc tả đầy đủ Module 04: `docs/specs/SPEC-04-SUBCONTRACTORS.md` theo chuẩn FIDIC Subcontract và pháp lý xây dựng Việt Nam.
  3. Xây dựng tầng cơ sở dữ liệu:
     - Schema `subcontractor_mgmt` trong `backend/src/main/resources/db/migration/V2__subcontractor_and_ppc.sql`.
  4. Hiện thực hóa Backend Java 21 + Spring Boot 3:
     - Các entity JPA: `Subcontractor`, `Subcontract`, `SubcontractItem`, `PaymentCertificate`, `PpcDetail`.
     - Các repository Spring Data: `SubcontractorRepository`, `SubcontractRepository`, `PaymentCertificateRepository`, `SubcontractItemRepository`.
     - Tầng dịch vụ `SubcontractorService` tính toán tự động chứng chỉ PPC: khấu trừ tạm ứng 10%, giữ lại bảo hành FIDIC 5%, phạt contra-charges, VAT 8%, và tính số tiền thực chi.
     - Tầng API REST: `SubcontractorController`, `PaymentCertificateController`.
  5. Xây dựng bộ kiểm thử JUnit 5: `SubcontractorServiceTest.java`.
  6. Nâng cấp Frontend React 18:
     - Thêm phân hệ Quản lý Thầu phụ & FIDIC PPC trên giao diện.
     - Bảng tra cứu chứng chỉ PPC với các khoản khấu trừ trực quan.
  7. Nâng cấp Giao diện Web Dashboard (`http://192.168.1.50:8000`):
     - Thêm scroll view độc lập (`h-[560px]`, `overflow-y-auto`, `custom-scrollbar`) cho từng cột Kanban (Backlog, In Progress, Review, Completed), chấm dứt hiện tượng kéo dài toàn màn hình.
     - Xây dựng pop-up modal Task Detail & Logs: Cho phép click vào bất kỳ thẻ task nào trên Task Board để xem toàn bộ thông tin chi tiết, prompt yêu cầu, và toàn bộ log thực thi / output của AI engine.
     - Bổ sung nút Copy Context và Copy Full Log nhanh chóng.
  8. Triển khai Hệ thống lên Docker trên Ubuntu Server (`192.168.1.50`) & Nối Cloudflare Tunnel:
     - Tạo `docker-compose.yml` cho ERP ADB với 3 services: `erp-adb-backend` (port 8085), `erp-adb-frontend` (port 3000), và `cf-tunnel-erpadb`.
     - Build thành công Maven Java 21 + Spring Boot 3.3.4 và React 18 TypeScript.
     - Khởi chạy Cloudflare Quick Tunnel thành công, cung cấp đường link truy cập công khai: `https://resolved-commander-price-reduces.trycloudflare.com`.
  9. Tối ưu hóa Thực thi Đồng thời Đa tác nhân (Concurrent Multi-Agent Execution):
     - Đồng loạt dispatch 3 nhiệm vụ Giai đoạn 2: TASK-011 (BA), TASK-012 (Developer), TASK-013 (Tester).
     - Hệ thống Hub phân phối đồng thời sang 3 máy trạm vật lý (`ba-hant_lap`, `developer-desktop-cgqq2oo`, `tester-desktop-khkher1`) cùng ở trạng thái BUSY và hoàn thành song song.
  10. Đồng bộ hóa toàn diện mã nguồn, công cụ và tài liệu lên cả hai kho lưu trữ:
     - `Erp-ADB-Building.git`
     - `Agent-chat-team-4-local.git`

---

## Kế hoạch Phiên Kế tiếp (Next Actions)

1. Triển khai Cycle 3 theo `MASTER_ROADMAP.md`:
   - Soạn thảo đặc tả chi tiết Module 05: Quản lý Cung ứng Vật tư, Mua sắm (PO) & Kho Công trường (GRN/GIN đối soát định mức WBS hao hụt sắt thép, cát, đá, xi măng).
   - Thiết kế Flyway Migration `V3__inventory_and_procurement.sql`.
   - Viết API Spring Boot cho Material Requisitions và Kho công trường.
   - Viết giao diện React theo dõi vật tư công trường.
