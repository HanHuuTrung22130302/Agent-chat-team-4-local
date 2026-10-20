---
name: enterprise-ui-ux-design-system
description: Enterprise-grade React & Tailwind CSS UI/UX Design System for B2B SaaS & Industrial Construction ERP applications. Provides standards for visual hierarchy, dark-mode color palettes, layout structures, interactive components (modals, slide-over drawers, KPI metric cards, data tables, filter toolbars, status badges, progress gauges), and form validations.
---

# Enterprise UI/UX Design System for Industrial ERP

> **Standard for Frontend Developers & AI Agents**  
> **Target Framework**: React 18+ (TypeScript), Tailwind CSS v3+, Lucide React Icons  
> **Design Philosophy**: High Information Density, Crystal-Clear Visual Hierarchy, Action-Oriented Ergonomics, Dark Slate Enterprise Aesthetic (inspired by Linear, Vercel, Stripe, and Procore).

---

## 1. Visual Hierarchy & Color System

### 1.1. Color Palette (Dark Slate Enterprise Default)
- **Background Root**: `bg-slate-950` (`#020617`) — Never pure black `#000000`; use deep slate for rich contrast.
- **Surface Level 1 (Sidebars / Cards / Panels)**: `bg-slate-900` (`#0f172a`) with subtle border `border-slate-800` (`#1e293b`).
- **Surface Level 2 (Sub-panels / Table headers / Form inputs)**: `bg-slate-950/80` or `bg-slate-800/60` with `border-slate-700/60`.
- **Card Hover States**: `hover:bg-slate-800/50 hover:border-slate-700 transition duration-150`.
- **Active Navigation Indicator**: Solid brand color (e.g. `bg-sky-600 text-white shadow-lg shadow-sky-600/20`).

### 1.2. Semantic Status Colors & Badges
Always use balanced badge styles with 10% opacity background, matching border, and high-contrast text:
- **Success / Active / Approved**:
  `bg-emerald-950/60 text-emerald-400 border border-emerald-800/80`
- **Warning / Pending / Over-consumption**:
  `bg-amber-950/60 text-amber-400 border border-amber-800/80`
- **Danger / Critical / Over-Norm / Rejected**:
  `bg-rose-950/60 text-rose-400 border border-rose-800/80`
- **In-Progress / Running**:
  `bg-sky-950/60 text-sky-400 border border-sky-800/80`
- **Manufacturing / Special Process**:
  `bg-purple-950/60 text-purple-400 border border-purple-800/80`
- **Draft / Inactive / Closed**:
  `bg-slate-800/80 text-slate-400 border border-slate-700/80`

### 1.3. Typography Standards
- **Font Scale**: Standard system fonts (`font-sans`: Inter, SF Pro, Segoe UI).
- **Minimum Floor**: Never use font sizes below `text-xs` (12px). Micro-text smaller than 12px causes severe fatigue on construction dashboards.
- **Section Headers**: `text-lg font-bold text-white tracking-tight flex items-center space-x-2.5`.
- **KPI Metric Values**: `text-2xl font-extrabold text-white tracking-tight`.
- **Table Column Headers**: `text-[11px] font-semibold text-slate-400 uppercase tracking-wider py-3 px-4`.
- **Currency & Numerics**: Always use `font-mono font-medium` or `tabular-nums` formatted with `Intl.NumberFormat('vi-VN')`.

---

## 2. Core Layout Architecture

```
+--------------------------------------------------------------------------------------+
| SIDEBAR (w-64, bg-slate-900, border-r border-slate-800)                              |
| +----------------------------------------------------------------------------------+ |
| | Logo ADB + "Ánh Dương Building D&B ERP"                                          | |
| | Module Navigation (Projects, WBS, Diary, BOQ, Subcontractors, Warehouse, etc.)   | |
| | System Status + Live Network Indicator                                           | |
| +----------------------------------------------------------------------------------+ |
+--------------------------------------------------------------------------------------+
| TOPBAR (h-16, bg-slate-900/60 backdrop-blur-md border-b border-slate-800)            |
| - Project Selector Dropdown with Badges & Budget Progress Meter                     |
| - Search Bar & Quick Action Button ("+ Tạo Mới")                                    |
| - User Role Badge ("Chỉ huy trưởng", "Giám đốc Dự án", "QS Lead")                   |
+--------------------------------------------------------------------------------------+
| MAIN WORKSPACE (p-6, space-y-6, max-w-7xl mx-auto)                                   |
| - KPI Summary Cards (4 Columns with Trend Badges & Mini Meters)                     |
| - Filter Toolbar (Search input, Category filter, Status dropdown, Export CSV)       |
| - Interactive Data Grid / Kanban / Stepper View                                     |
| - Pagination & Selected Item Counter                                                |
+--------------------------------------------------------------------------------------+
```

---

## 3. Mandatory Component Specifications

### 3.1. KPI Metric Summary Card
Every module dashboard MUST start with 3 to 4 high-impact KPI summary cards:
```tsx
<div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 hover:border-slate-700 transition">
  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
    <span className="font-medium text-slate-300">{title}</span>
    <div className="p-2 rounded-lg bg-slate-800/80 text-sky-400">{icon}</div>
  </div>
  <div className="text-2xl font-extrabold text-white tracking-tight">{value}</div>
  <div className="flex items-center space-x-2 mt-2 text-xs">
    <span className={`inline-flex items-center font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
      {trend}
    </span>
    <span className="text-slate-500">{subtitle}</span>
  </div>
</div>
```

### 3.2. Rich Interactive Data Table
Tables must NOT be static text dumps:
1. **Zebra Striping & Hover**: `hover:bg-slate-800/50 transition cursor-pointer`.
2. **Click-to-Inspect**: Clicking any row MUST open the Item Detail Drawer or Pop-up Modal.
3. **Sticky Header**: `sticky top-0 bg-slate-900/95 backdrop-blur z-10`.
4. **Action Column**: Dropdown menu or buttons for View, Edit, Approve, Download CO/CQ.

### 3.3. Modal Dialogs & Slide-Over Drawers
Every module MUST provide action modals:
- **Create / Record Modal**: Form with inputs, labels, validation messages, and submit/cancel buttons.
- **Detail Inspector Drawer**: Shows full metadata, calculation formulas, attachments, and audit trail.

---

## 4. Construction ERP Domain Rules

1. **FIDIC Subcontract PPC**:
   - Always display the formula clearly:  
     $$\text{Net Payable} = \text{Gross} - \text{Advance Recovery} - \text{5\% Retention} - \text{Backcharges} + \text{VAT 8\%}$$
   - Clearly display cumulative gross and remaining retention balance.
2. **Circular 12/2021/TT-BXD Norm Reconciliations**:
   - When actual waste exceeds allowed norm (Steel $>2.5\%$, Concrete $>1.5\%$, Aggregates $>3.0\%$), display an animated pulsating red warning badge `CRITICAL_OVER_NORM` with explicit variance tonnage.
3. **WinSteel Pre-Engineered Steel Factory**:
   - Provide a 5-step visual stepper for fabrication stages: `CNC Cắt` $\to$ `Gá Đính` $\to$ `Hàn SAW & NDT` $\to$ `Bắn Bi Sa 2.5` $\to$ `Sơn Epoxy DFT 80μm`.
   - Provide a quick QR code lookup bar to simulate mobile site scanning.
4. **Equipment Fleet**:
   - Highlight any machine whose `safety_inspection_expiry` is within 30 days in amber, and overdue in flashing red with disabled operation button.

---

## 5. Coding Standards for Developer Agent
- Break large views into separate component files under `frontend/src/components/`.
- Never place more than 250 lines in a single component.
- Handle loading, empty, and error states gracefully.
- Include dummy fallback data so the dashboard never renders blank or crashes if the backend is restarting.
