# 🛒 Hướng Dẫn Prompt: Xây Dựng E-Commerce App với AI Agents

Tài liệu này hướng dẫn bạn cách tận dụng tối đa bộ khung `.claude/agents` để xây dựng một dự án thực tế (ví dụ: Trang web bán hàng). Bí quyết ở đây là **KHÔNG** yêu cầu AI làm toàn bộ mọi thứ trong một prompt. Thay vào đó, bạn sẽ đóng vai trò là "Giám đốc dự án" (Director), đi phân việc cho từng "Nhân viên AI" (Agent) theo trình tự từng bước.

---

## 🧭 Nguyên Tắc Cốt Lõi Khi Gửi Prompt

1. **Luôn gọi tên Agent**: Mở đầu prompt bằng `"Act as the [Tên Agent] agent..."` để AI tự động tải đúng ngữ cảnh làm việc và các luật lệ (rules).
2. **Đi từ Tổng quan đến Chi tiết (Top-Down)**: Bắt đầu với Architect/PM (Thiết kế hệ thống, DB) -> Backend (API) -> Frontend (UI/UX) -> QA (Testing).
3. **Giới hạn phạm vi**: Yêu cầu làm **từng feature nhỏ** thay vì toàn bộ hệ thống. (Vd: "Chỉ làm tính năng Giỏ hàng" thay vì "Làm trang web bán hàng").
4. **Yêu cầu đối chiếu Rules**: Luôn nhắc nhẹ AI đọc kỹ các rules (Ví dụ: `Reference tech-stack.md and database.md before implementing`).

---

## 🚀 Workflow & Mẫu Prompts Chuyên Sâu

Dưới đây là kịch bản (Script) chi tiết để bạn ra lệnh xây dựng dự án E-Commerce từ đầu. Hãy copy từng prompt này và gửi cho AI.

### Phase 1: Planning & System Design (Lên kế hoạch & Thiết kế Database)

Đầu tiên, bạn cần định hình kiến trúc và Database. Chúng ta sẽ giao việc này cho **Systems Architect** và **Backend Developer**.

> **Prompt 1: Khởi tạo schema Database (Gửi cho Backend/Architect Agent)**
> 
> ```text
> Act as the Systems Architect and Backend Developer agent.
> I want to build an E-commerce platform selling physical products (Electronics, Clothing).
> 
> Task:
> 1. Design the Prisma schema (schema.prisma) for the core entities: User, Product, Category, Order, OrderItem, and Cart.
> 2. Ensure you follow the rules in `.claude/rules/database.md` and `.claude/rules/naming-conventions.md`.
> 3. Include proper relations, indexes, and timestamps.
> 
> Please output the exact contents for `schema.prisma`.
> ```

> **Prompt 2: Lên danh sách API (Gửi cho Systems Architect)**
> 
> ```text
> Act as the Systems Architect agent.
> Based on the Prisma schema we just created, design the RESTful API endpoints for the Product catalog and Shopping Cart.
> Refer to `.claude/rules/api-conventions.md` for standard response envelopes.
> Please output the API specification in a clean Markdown table format.
> ```

---

### Phase 2: Phát triển Backend (API & Business Logic)

Sau khi có thiết kế, lúc này "Backend Developer" vào cuộc để viết code thực tế.

> **Prompt 3: Xây dựng Service & Controller (Gửi cho Backend Agent)**
> 
> ```text
> Act as the Backend Developer agent.
> I need you to implement the logic for the "Shopping Cart" feature.
> 
> Task:
> 1. Create the Repository and Service layer for `Cart` (add item, remove item, update quantity).
> 2. Create the Express Controller layer mapping to these services.
> 3. Remember to use our global ErrorHandler as defined in `error-handling.md` and keep the controllers thin (`project-structure.md`).
> 
> Output the code for: `cart.repository.ts`, `cart.service.ts`, and `cart.controller.ts`.
> ```

> **Prompt 4: Thiết lập Background Job (Gửi cho Backend Agent)**
> 
> ```text
> Act as the Backend Developer agent.
> When an Order is placed, we need to send a confirmation email asynchronously.
> Please implement a BullMQ job for this following `system-design.md` and `tech-stack.md`. Create the queue worker in `src/queues/email.worker.ts`.
> ```

---

### Phase 3: Phát triển Frontend (Giao diện & Tương tác)

Backend đã xong, giờ chuyển sang Frontend để làm UI.

> **Prompt 5: Cấu trúc Component cốt lõi (Gửi cho Frontend Agent)**
> 
> ```text
> Act as the Frontend Developer agent.
> Now we will build the E-commerce UI using Next.js 14 App Router, Tailwind CSS, and shadcn/ui.
> 
> Task:
> Implement the `ProductCard` and `ProductGrid` components.
> Rule checks: Use `next/image` for product photos, ensure it's responsive (mobile-first), and follows the structural rules in your specific `frontend.md` agent file.
> ```

> **Prompt 6: Fetching Data bằng TanStack Query (Gửi cho Frontend Agent)**
> 
> ```text
> Act as the Frontend Developer agent.
> Create a Client Component hook to fetch products with pagination and filtering (by category/price).
> Please use `TanStack Query` as per our tech stack. Include loading skeletons and error states.
> ```

---

### Phase 4: Kiểm thử & Triển khai (Testing & Deploy)

Cuối cùng là để QA review và Viết tests.

> **Prompt 7: Viết Unit Test (Gửi cho QA Agent)**
> 
> ```text
> Act as the QA Engineer agent.
> Please write Vitest unit tests for the `cart.service.ts` that the Backend Developer created earlier. 
> Cover edge cases such as: adding negative quantities, or adding products that are out of stock. Reference `testing.md`.
> ```

---

## 🎯 Mẹo Tối Ưu (Pro-tips)

1. **Workflow Khắc phục Lỗi**: Nếu lúc chạy gặp lỗi, đừng chép mỗi đoạn lỗi rồi quăng vào. Hãy gọi Agent:
   *`"Act as the Backend Developer agent. I ran into this error when hitting the POST /api/cart endpoint: [dán mã lỗi]. Review the cart.controller.ts and fix the issue."`*
2. **Nếu code sai chuẩn (Sai Cấu Trúc Lớp)**: Bạn có quyền "mắng" nhẹ Agent để họ tự sửa sai:
   *`"You put business logic inside the controller! Please review 'project-structure.md' and move the logic to the Service layer."`*
3. **Mỗi chức năng một luồng (Chat session) mới**: Gợi ý nên tách riêng việc code Backend Cart và Frontend Cart ra các luồng trò chuyện khác nhau để AI không bị quá tải ngữ cảnh (context window).
