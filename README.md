## 🗂️ Full Project Structure

```
ai-agent/
│
├── 📁 .claude/                         # 🤖 AI Agent Configuration
│   │
│   ├── 📁 agents/                      # Chuyên gia AI theo vai trò
│   │   ├── frontend.md                 # 🖥️  Next.js, React, TypeScript, UI
│   │   ├── backend.md                  # 🔧  Express, Prisma, Redis, BullMQ
│   │   ├── project-manager.md          # 📋  User stories, Sprint planning
│   │   ├── systems-architect.md        # 🏗️  ADR, System design, Scalability
│   │   ├── ui-ux-designer.md           # 🎨  Design system, UX patterns, a11y
│   │   ├── qa.md                       # ✅  Test plans, Vitest, Playwright
│   │   └── copywriter-seo.md           # ✍️  Microcopy, SEO, Schema markup
│   │
│   ├── 📁 commands/                    # Lệnh tự động hóa
│   │   ├── deploy.md                   # Deploy pipeline
│   │   ├── fix-issue.md                # Bug analysis & fix workflow
│   │   └── review.md                   # Code review checklist
│   │
│   ├── 📁 rules/                       # 📜 Luật BẮT BUỘC cho AI & Dev
│   │   │
│   │   ├── — Code Quality —
│   │   ├── clean-code.md               # Clean Code JS (variables, fn, SOLID)
│   │   ├── code-style.md               # Formatting, naming conventions
│   │   ├── error-handling.md           # AppError class, global handler
│   │   │
│   │   ├── — Architecture —
│   │   ├── tech-stack.md               # Approved stack (Next, PG, Redis...)
│   │   ├── system-design.md            # CAP, caching, scaling, queues
│   │   ├── project-structure.md        # Layered architecture, folder layout
│   │   ├── api-conventions.md          # REST standards, response envelopes
│   │   │
│   │   ├── — Data & Naming —
│   │   ├── naming-conventions.md       # Cache keys, DB, queues, env vars
│   │   ├── database.md                 # Prisma patterns, transactions, N+1
│   │   │
│   │   └── — Operations —
│   │   ├── security.md                 # 🔒 CRITICAL security rules
│   │   ├── monitoring.md               # Prometheus, Grafana, alerts, logging
│   │   ├── testing.md                  # Vitest, coverage thresholds
│   │   └── git-workflow.md             # Git Flow, conventional commits
│   │
│   ├── 📁 skills/                      # Kỹ năng nâng cao
│   │   ├── deploy/SKILL.md             # Full deploy pipeline automation
│   │   └── security-review/SKILL.md    # Security audit checklist
│   │
│   ├── settings.json                   # Project-level AI settings
│   ├── settings.local.json             # Local settings (gitignored)
│   ├── CLAUDE.md                       # Master AI instructions
│   └── CLAUDE.local.md                 # Local overrides (gitignored)
│
├── 📁 src/                             # Application source code
│   ├── app/                            # Next.js App Router
│   ├── components/                     # UI components
│   ├── controllers/                    # Route handlers (thin)
│   ├── services/                       # Business logic
│   ├── repositories/                   # Data access layer
│   ├── middleware/                     # Express middleware
│   ├── lib/                            # Singletons (db, redis, logger)
│   ├── queues/                         # BullMQ queue definitions
│   ├── utils/                          # Utilities & helpers
│   └── types/                          # TypeScript types
│
├── 📁 tests/
│   ├── unit/                           # Vitest unit tests
│   ├── integration/                    # API integration tests
│   └── e2e/                            # Playwright E2E tests
│
├── 📁 docs/
│   ├── architecture/                   # System diagrams + ADRs
│   │   └── adr/                        # Architecture Decision Records
│   └── api/                            # OpenAPI / Swagger specs
│
├── 📁 scripts/                         # Build & utility scripts
├── .env.example                        # Environment template (commit this)
├── .gitignore
└── README.md
```

---

## 🚀 Approved Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router) + TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **State** | Zustand + TanStack Query |
| **Backend** | Express.js + TypeScript |
| **ORM** | Prisma |
| **Database** | PostgreSQL 16 |
| **Cache** | Redis (ioredis) |
| **Queue** | BullMQ |
| **Auth** | NextAuth.js / JWT + bcrypt |
| **Testing** | Vitest + Playwright |
| **Monitoring** | Prometheus + Grafana + Pino |
| **CI/CD** | GitHub Actions |
| **Deploy** | Vercel + Railway / Fly.io |
| **API Docs** | OpenAPI 3.0 / Swagger |

---

## 🤖 AI Agent Roles

Khi làm việc, gọi đúng agent cho từng loại task:

```
"Act as the Frontend Developer agent and build the login page"
"As Project Manager, write user stories for the checkout feature"
"Systems Architect: design the notification system architecture"
"QA: write E2E tests for the payment flow"
```

| Agent | Khi nào dùng |
|-------|-------------|
| 🖥️ Frontend | Component, page, state, performance |
| 🔧 Backend | API, service, DB, queue, job |
| 📋 PM | Planning, user story, sprint, status |
| 🏗️ Architect | ADR, system design, infra decision |
| 🎨 UI/UX | Design system, wireframe, UX review |
| ✅ QA | Test plan, test code, bug report |
| ✍️ SEO | Copy, meta tags, schema markup |

---

## 📋 Rules Overview (13 rules)

Tất cả AI và Developer phải tuân thủ:

| Category | Rules |
|----------|-------|
| **Code Quality** | clean-code, code-style, error-handling |
| **Architecture** | tech-stack, system-design, project-structure, api-conventions |
| **Data & Naming** | naming-conventions, database |
| **Operations** | security 🔒, monitoring, testing, git-workflow |

---

## ⚡ Quick Start

```bash
# Clone & setup
cp .env.example .env

# Install
npm install

# Database
npx prisma migrate dev
npx prisma generate

# Dev server
npm run dev

# Tests
npm test
npm run test:e2e
```

---

## 🛡️ Security Notes

> **Không bao giờ commit:**
> - `.env` files
> - `.claude/settings.local.json`
> - API keys, secrets, passwords

---
