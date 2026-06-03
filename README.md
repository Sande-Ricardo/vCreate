<div align="center">

# ◈ vCreate

**Intelligent Bilingual CV Generator**

*Craft professional, LaTeX-compiled resumes with automatic translation — serverless, stateless, and blazing fast.*

---

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5-433C3C?style=flat-square)](https://zustand-demo.pmnd.rs/)
[![DeepL](https://img.shields.io/badge/DeepL-API-0F2B46?style=flat-square&logo=deepl)](https://www.deepl.com/pro-api)

</div>

---

## Overview

**vCreate** is a stateless web application for creating, editing, and exporting professional CVs directly from the browser. It renders documents using a real **LaTeX compilation pipeline**, delivers pixel-perfect typography, and can optionally generate fully-translated bilingual packages with a single click — no backend infrastructure, no accounts, no data stored on servers.

The entire processing lifecycle (translation, LaTeX templating, PDF compilation, and ZIP packaging) runs **entirely in-memory** within a single serverless API route, making it fast, private, and portable.

---

## Features

### Document Editing
- **Reactive Form Editor** — Live, section-by-section form. Any change instantly updates the internal state via Zustand.
- **Drag-to-Reorder** — Reorder work experience, projects, and education entries natively using HTML5 Drag & Drop.
- **All CV Sections Supported:**
  - Personal Data (name, title, contact, links)
  - Professional Profile
  - Work Experience (role, company, dates, responsibilities, tech stack)
  - Projects (description, tech, repo/demo links)
  - Education (degree, institution, dates)
  - Certifications
  - Technical Skills (grouped by category)
  - Soft Skills & Languages

### Export Engine
| Format | Description |
|--------|-------------|
| **PDF Only** | Single PDF in the current input language |
| **PDF + JSON (.zip)** | PDF with a JSON backup of your CV data |
| **Bilingual CVs (.zip)** | Auto-translated PDF in both ES & EN |
| **Full Package (.zip)** | Both PDFs + JSON backups in both languages |

### Bilingual Translation (DeepL)
- Translates all free-text fields in a **single batched API request** for performance.
- Translated fields include: roles, descriptions, responsibilities, soft skills, proficiency levels, and **all date fields** (`start_date`, `end_date`, free-form certification dates).
- Section headers and static labels are **independently localized** via a built-in i18n dictionary — DeepL is never used for fixed structural text.
- Automatically selects Free (`api-free.deepl.com`) vs. Pro (`api.deepl.com`) endpoint based on your key suffix.

### Draft Management
- **Load JSON** — Import any previously saved `cv_data.json` to restore your session.
- **Save Draft** — Download the current state as a timestamped JSON file for future sessions.
- **Language Switcher** — Switch the active input language (ES ↔ EN) at any point directly from the sidebar.

### UX & Feedback
- **Real-time Preview** — A live HTML preview panel reflects your CV structure as you type.
- **Global Notification Toast** — Success and error feedback displayed non-intrusively.
- **LaTeX Log Propagation** — If compilation fails, the raw LaTeX compiler log is surfaced in the UI for debugging.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                          Browser (Client)                        │
│   ┌───────────┐  ┌──────────────────┐  ┌─────────────────────┐   │
│   │  Sidebar  │  │   Form Editor    │  │   Live CV Preview   │   │
│   │ Navigator │  │  (Zustand Store) │  │  (HTML/CSS Mirror)  │   │
│   └───────────┘  └────────┬─────────┘  └─────────────────────┘   │
│                           │  POST /api/export                    │
│                  ┌────────▼──────────────────────────────┐       │
│                  │         Export Console + Modal        │       │
│                  └────────────────┬──────────────────────┘       │
└───────────────────────────────────│──────────────────────────────┘
                                    │
┌───────────────────────────────────▼──────────────────────────────┐
│                     Serverless API Route                         │
│                     POST /api/export                             │
│                                                                  │
│  ┌────────────────────┐    ┌───────────────────┐                 │
│  │  DeepL REST API    │    │  labels.ts (i18n) │                 │
│  │  (batch translate  │    │  Static headers   │                 │
│  │ free-text + dates) │    │  ES ↔ EN dicts    │                 │
│  └────────┬───────────┘    └────────┬──────────┘                 │
│           │                         │                            │
│  ┌────────▼─────────────────────────▼─────────────────────┐      │
│  │   Handlebars Template Engine   →   LaTeX Source String │      │
│  └──────────────────────────────────┬─────────────────────┘      │
│                                     │                            │
│                           ┌─────────▼───────────────┐            │
│                           │  YtoTech Compiler API   │            │
│                           │ (pdflatex, in parallel) │            │
│                           └─────────┬───────────────┘            │
│                                     │ PDF Buffer(s)              │
│                           ┌─────────▼───────────────┐            │
│                           │  JSZip (in-memory only) │            │
│                           └─────────┬───────────────┘            │
└─────────────────────────────────────│────────────────────────────┘
                                      │ application/zip stream
                                      ▼
                              Native Browser Download
```

### Key Design Principles

- **Stateless Processing** — Zero files written to disk. All intermediate PDF and JSON data lives in Node.js Buffers for the duration of the HTTP request.
- **Parallel Compilation** — When generating bilingual output, both LaTeX compilations are dispatched concurrently via `Promise.all` to stay within serverless timeout limits.
- **Strict LaTeX Sanitization** — All user-provided text is sanitized by `src/lib/latex/sanitize.ts` before being passed to the Handlebars template engine, preventing injection of raw LaTeX control characters.
- **Batched Translation** — All translatable strings are extracted into a single array and sent to DeepL in one request, then mapped back to their corresponding fields, minimizing latency and API call overhead.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript 5 (strict) |
| **Styling** | Tailwind CSS v4 |
| **State Management** | Zustand 5 + Immer middleware |
| **Template Engine** | Handlebars |
| **LaTeX Compiler** | [YtoTech Public API](https://latex.ytotech.com) |
| **Translation** | DeepL REST API v2 |
| **ZIP Packaging** | JSZip |
| **Package Manager** | pnpm |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **pnpm** (install with `npm i -g pnpm` or `npx pnpm`)
- A **DeepL API key** (free tier available at [deepl.com/pro-api](https://www.deepl.com/pro-api)) — only required for bilingual export.

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/vcreate.git
cd vcreate

# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Optional: Set your DeepL API key server-side.
# If not set here, users can enter it manually in the Export Console UI.
# Keys ending in ':fx' are automatically routed to the free-tier endpoint.
DEEPL_API_KEY=your-deepl-api-key-here
```

### Running Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

### 1. Select a Language
On the sidebar, select `ES` (Spanish) or `EN` (English) as the input language for your CV. This determines the base LaTeX template structure that will be used.

### 2. Fill Out the Form
Navigate between sections using the sidebar — Personal Data, Work Experience, Projects, Education, Certifications, Technical Skills, and Soft Skills & Languages. Each section features dynamic item management (add, remove, reorder via drag & drop).

### 3. Load an Existing Draft *(Optional)*
Click **Load JSON** in the bottom Export Console to import a previously saved `cv_data.json` file and resume editing.

### 4. Export Your CV
Click **Export / Download ZIP** in the console to open the Export Modal. Choose your desired format:
- For bilingual output, paste your DeepL API key in the secure field (it will be saved to `localStorage` for convenience).

### 5. Save a Draft
Click **Save Draft** at any time to download the current Zustand state as a `.json` file with an updated `last_updated` timestamp for future sessions.

---

## Project Structure

```
vCreate/
├── references/             # Project documentation & design specs
│   ├── AGENT_INSTRUCTIONS.md
│   ├── PROJECT_STATE.md
│   ├── SRS.md
│   ├── DESIGN.md
│   └── structure.json      # Source-of-truth JSON schema for CvData
│
└── src/
    ├── app/
    │   ├── page.tsx          # Root page (layout composition)
    │   └── api/
    │       └── export/
    │           └── route.ts  # Core serverless export endpoint
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Sidebar.tsx       # Section navigation + language toggle
    │   │   ├── FormArea.tsx      # Main CV form
    │   │   ├── PreviewPanel.tsx  # Live HTML preview wrapper
    │   │   ├── ExportConsole.tsx # Bottom control bar
    │   │   └── ExportModal.tsx   # Export format selection modal
    │   ├── preview/
    │   │   └── CvPreview.tsx     # HTML/CSS CV mirror component
    │   ├── sections/             # Individual form section components
    │   │   ├── PersonalDataSection.tsx
    │   │   ├── WorkExperienceSection.tsx
    │   │   ├── ProjectsSection.tsx
    │   │   ├── EducationSection.tsx
    │   │   ├── CertificationsSection.tsx
    │   │   ├── TechnicalSkillsSection.tsx
    │   │   └── SoftSkillsLanguagesSection.tsx
    │   └── ui/
    │       ├── Button.tsx
    │       ├── Input.tsx
    │       ├── Notification.tsx  # Global toast notification
    │       └── index.ts
    │
    ├── lib/
    │   ├── latex/
    │   │   ├── compiler.ts    # Handlebars rendering + external PDF compile
    │   │   ├── template.hbs   # LaTeX Handlebars template
    │   │   ├── labels.ts      # i18n dictionaries (ES/EN) for static labels
    │   │   └── sanitize.ts    # LaTeX special character escaping
    │   └── translate.ts       # DeepL batch translation service
    │
    ├── store/
    │   └── cv.store.ts        # Zustand store (state + all actions)
    │
    └── types/
        └── cv.types.ts        # TypeScript interfaces (derived from structure.json)
```

---

## Design System

vCreate implements a custom design language called **"Luminous Professional"** — a high-contrast, dark-mode aesthetic rooted in technical elegance.

- **Theme:** Deep monochromatic dark (surface `#131313`, background gradient to `#000000`)
- **Typography:** Inter — geometric, neutral, and precise
- **Borders:** All UI elements use sharp 90° corners (zero border-radius). Ultra-thin 1px borders in `rgba(255,255,255,0.1)–0.3`
- **Glow Effects:** Active inputs and primary buttons emit a soft white backlight (`box-shadow: 0 0 15px rgba(255,255,255,0.3)`)
- **Icons:** SVG outline style only — no emoji, no raster icons

---

## API Reference

### `POST /api/export`

Orchestrates the full export pipeline. Accepts JSON.

**Request Body:**
```typescript
{
  data: CvData;        // Full CV state object
  format:
    | 'pdf_only'
    | 'zip_single_language_json'
    | 'zip_all_languages'
    | 'zip_all_languages_json';
  apiKey?: string;     // DeepL API key (required for bilingual formats)
}
```

**Response:**
- `200 application/pdf` — Single PDF download
- `200 application/zip` — ZIP archive download
- `400 application/json` — Missing data or API key
- `500 application/json` — LaTeX compilation or translation failure (with log)

---

## Caveats & Limitations

- **LaTeX Compiler** — PDF generation depends on the public [YtoTech API](https://latex.ytotech.com). While stable, it is an external third-party service.
- **DeepL API** — Bilingual export requires a valid DeepL API key. The free tier provides 500,000 characters/month.
- **Dates are free-form** — Date fields (e.g. `"February 2026"`) are translated via DeepL along with other content. Ensure consistent formatting for best results.
- **No Authentication** — vCreate is fully stateless. No user data is ever persisted server-side.
- **No Mobile Editing** — The editor layout is optimized for desktop viewport widths (≥1200px).

---

## License

This project is private and unlicensed. All rights reserved.

---

<div align="center">

*Built with precision. Exported with elegance.*

**◈ vCreate**

</div>
<div align="center">

# ◈ vCreate

**Intelligent Bilingual CV Generator**

*Craft professional, LaTeX-compiled resumes with automatic translation — serverless, stateless, and blazing fast.*

---

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5-433C3C?style=flat-square)](https://zustand-demo.pmnd.rs/)
[![DeepL](https://img.shields.io/badge/DeepL-API-0F2B46?style=flat-square&logo=deepl)](https://www.deepl.com/pro-api)

</div>

---

## Overview

**vCreate** is a stateless web application for creating, editing, and exporting professional CVs directly from the browser. It renders documents using a real **LaTeX compilation pipeline**, delivers pixel-perfect typography, and can optionally generate fully-translated bilingual packages with a single click — no backend infrastructure, no accounts, no data stored on servers.

The entire processing lifecycle (translation, LaTeX templating, PDF compilation, and ZIP packaging) runs **entirely in-memory** within a single serverless API route, making it fast, private, and portable.

---

## Features

### Document Editing
- **Reactive Form Editor** — Live, section-by-section form. Any change instantly updates the internal state via Zustand.
- **Drag-to-Reorder** — Reorder work experience, projects, and education entries natively using HTML5 Drag & Drop.
- **All CV Sections Supported:**
  - Personal Data (name, title, contact, links)
  - Professional Profile
  - Work Experience (role, company, dates, responsibilities, tech stack)
  - Projects (description, tech, repo/demo links)
  - Education (degree, institution, dates)
  - Certifications
  - Technical Skills (grouped by category)
  - Soft Skills & Languages

### Export Engine
| Format | Description |
|--------|-------------|
| **PDF Only** | Single PDF in the current input language |
| **PDF + JSON (.zip)** | PDF with a JSON backup of your CV data |
| **Bilingual CVs (.zip)** | Auto-translated PDF in both ES & EN |
| **Full Package (.zip)** | Both PDFs + JSON backups in both languages |

### Bilingual Translation (DeepL)
- Translates all free-text fields in a **single batched API request** for performance.
- Translated fields include: roles, descriptions, responsibilities, soft skills, proficiency levels, and **all date fields** (`start_date`, `end_date`, free-form certification dates).
- Section headers and static labels are **independently localized** via a built-in i18n dictionary — DeepL is never used for fixed structural text.
- Automatically selects Free (`api-free.deepl.com`) vs. Pro (`api.deepl.com`) endpoint based on your key suffix.

### Draft Management
- **Load JSON** — Import any previously saved `cv_data.json` to restore your session.
- **Save Draft** — Download the current state as a timestamped JSON file for future sessions.
- **Language Switcher** — Switch the active input language (ES ↔ EN) at any point directly from the sidebar.

### UX & Feedback
- **Real-time Preview** — A live HTML preview panel reflects your CV structure as you type.
- **Global Notification Toast** — Success and error feedback displayed non-intrusively.
- **LaTeX Log Propagation** — If compilation fails, the raw LaTeX compiler log is surfaced in the UI for debugging.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                          Browser (Client)                        │
│   ┌───────────┐  ┌──────────────────┐  ┌─────────────────────┐   │
│   │  Sidebar  │  │   Form Editor    │  │   Live CV Preview   │   │
│   │ Navigator │  │  (Zustand Store) │  │  (HTML/CSS Mirror)  │   │
│   └───────────┘  └────────┬─────────┘  └─────────────────────┘   │
│                           │  POST /api/export                    │
│                  ┌────────▼──────────────────────────────┐       │
│                  │         Export Console + Modal        │       │
│                  └────────────────┬──────────────────────┘       │
└───────────────────────────────────│──────────────────────────────┘
                                    │
┌───────────────────────────────────▼──────────────────────────────┐
│                     Serverless API Route                         │
│                     POST /api/export                             │
│                                                                  │
│  ┌────────────────────┐    ┌───────────────────┐                 │
│  │  DeepL REST API    │    │  labels.ts (i18n) │                 │
│  │  (batch translate  │    │  Static headers   │                 │
│  │ free-text + dates) │    │  ES ↔ EN dicts    │                 │
│  └────────┬───────────┘    └────────┬──────────┘                 │
│           │                         │                            │
│  ┌────────▼─────────────────────────▼─────────────────────┐      │
│  │   Handlebars Template Engine   →   LaTeX Source String │      │
│  └──────────────────────────────────┬─────────────────────┘      │
│                                     │                            │
│                           ┌─────────▼───────────────┐            │
│                           │  YtoTech Compiler API   │            │
│                           │ (pdflatex, in parallel) │            │
│                           └─────────┬───────────────┘            │
│                                     │ PDF Buffer(s)              │
│                           ┌─────────▼───────────────┐            │
│                           │  JSZip (in-memory only) │            │
│                           └─────────┬───────────────┘            │
└─────────────────────────────────────│────────────────────────────┘
                                      │ application/zip stream
                                      ▼
                              Native Browser Download
```

### Key Design Principles

- **Stateless Processing** — Zero files written to disk. All intermediate PDF and JSON data lives in Node.js Buffers for the duration of the HTTP request.
- **Parallel Compilation** — When generating bilingual output, both LaTeX compilations are dispatched concurrently via `Promise.all` to stay within serverless timeout limits.
- **Strict LaTeX Sanitization** — All user-provided text is sanitized by `src/lib/latex/sanitize.ts` before being passed to the Handlebars template engine, preventing injection of raw LaTeX control characters.
- **Batched Translation** — All translatable strings are extracted into a single array and sent to DeepL in one request, then mapped back to their corresponding fields, minimizing latency and API call overhead.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript 5 (strict) |
| **Styling** | Tailwind CSS v4 |
| **State Management** | Zustand 5 + Immer middleware |
| **Template Engine** | Handlebars |
| **LaTeX Compiler** | [YtoTech Public API](https://latex.ytotech.com) |
| **Translation** | DeepL REST API v2 |
| **ZIP Packaging** | JSZip |
| **Package Manager** | pnpm |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **pnpm** (install with `npm i -g pnpm` or `npx pnpm`)
- A **DeepL API key** (free tier available at [deepl.com/pro-api](https://www.deepl.com/pro-api)) — only required for bilingual export.

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/vcreate.git
cd vcreate

# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Optional: Set your DeepL API key server-side.
# If not set here, users can enter it manually in the Export Console UI.
# Keys ending in ':fx' are automatically routed to the free-tier endpoint.
DEEPL_API_KEY=your-deepl-api-key-here
```

### Running Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

### 1. Select a Language
On the sidebar, select `ES` (Spanish) or `EN` (English) as the input language for your CV. This determines the base LaTeX template structure that will be used.

### 2. Fill Out the Form
Navigate between sections using the sidebar — Personal Data, Work Experience, Projects, Education, Certifications, Technical Skills, and Soft Skills & Languages. Each section features dynamic item management (add, remove, reorder via drag & drop).

### 3. Load an Existing Draft *(Optional)*
Click **Load JSON** in the bottom Export Console to import a previously saved `cv_data.json` file and resume editing.

### 4. Export Your CV
Click **Export / Download ZIP** in the console to open the Export Modal. Choose your desired format:
- For bilingual output, paste your DeepL API key in the secure field (it will be saved to `localStorage` for convenience).

### 5. Save a Draft
Click **Save Draft** at any time to download the current Zustand state as a `.json` file with an updated `last_updated` timestamp for future sessions.

---

## Project Structure

```
vCreate/
├── references/             # Project documentation & design specs
│   ├── AGENT_INSTRUCTIONS.md
│   ├── PROJECT_STATE.md
│   ├── SRS.md
│   ├── DESIGN.md
│   └── structure.json      # Source-of-truth JSON schema for CvData
│
└── src/
    ├── app/
    │   ├── page.tsx          # Root page (layout composition)
    │   └── api/
    │       └── export/
    │           └── route.ts  # Core serverless export endpoint
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Sidebar.tsx       # Section navigation + language toggle
    │   │   ├── FormArea.tsx      # Main CV form
    │   │   ├── PreviewPanel.tsx  # Live HTML preview wrapper
    │   │   ├── ExportConsole.tsx # Bottom control bar
    │   │   └── ExportModal.tsx   # Export format selection modal
    │   ├── preview/
    │   │   └── CvPreview.tsx     # HTML/CSS CV mirror component
    │   ├── sections/             # Individual form section components
    │   │   ├── PersonalDataSection.tsx
    │   │   ├── WorkExperienceSection.tsx
    │   │   ├── ProjectsSection.tsx
    │   │   ├── EducationSection.tsx
    │   │   ├── CertificationsSection.tsx
    │   │   ├── TechnicalSkillsSection.tsx
    │   │   └── SoftSkillsLanguagesSection.tsx
    │   └── ui/
    │       ├── Button.tsx
    │       ├── Input.tsx
    │       ├── Notification.tsx  # Global toast notification
    │       └── index.ts
    │
    ├── lib/
    │   ├── latex/
    │   │   ├── compiler.ts    # Handlebars rendering + external PDF compile
    │   │   ├── template.hbs   # LaTeX Handlebars template
    │   │   ├── labels.ts      # i18n dictionaries (ES/EN) for static labels
    │   │   └── sanitize.ts    # LaTeX special character escaping
    │   └── translate.ts       # DeepL batch translation service
    │
    ├── store/
    │   └── cv.store.ts        # Zustand store (state + all actions)
    │
    └── types/
        └── cv.types.ts        # TypeScript interfaces (derived from structure.json)
```

---

## Design System

vCreate implements a custom design language called **"Luminous Professional"** — a high-contrast, dark-mode aesthetic rooted in technical elegance.

- **Theme:** Deep monochromatic dark (surface `#131313`, background gradient to `#000000`)
- **Typography:** Inter — geometric, neutral, and precise
- **Borders:** All UI elements use sharp 90° corners (zero border-radius). Ultra-thin 1px borders in `rgba(255,255,255,0.1)–0.3`
- **Glow Effects:** Active inputs and primary buttons emit a soft white backlight (`box-shadow: 0 0 15px rgba(255,255,255,0.3)`)
- **Icons:** SVG outline style only — no emoji, no raster icons

---

## API Reference

### `POST /api/export`

Orchestrates the full export pipeline. Accepts JSON.

**Request Body:**
```typescript
{
  data: CvData;        // Full CV state object
  format:
    | 'pdf_only'
    | 'zip_single_language_json'
    | 'zip_all_languages'
    | 'zip_all_languages_json';
  apiKey?: string;     // DeepL API key (required for bilingual formats)
}
```

**Response:**
- `200 application/pdf` — Single PDF download
- `200 application/zip` — ZIP archive download
- `400 application/json` — Missing data or API key
- `500 application/json` — LaTeX compilation or translation failure (with log)

---

## Caveats & Limitations

- **LaTeX Compiler** — PDF generation depends on the public [YtoTech API](https://latex.ytotech.com). While stable, it is an external third-party service.
- **DeepL API** — Bilingual export requires a valid DeepL API key. The free tier provides 500,000 characters/month.
- **Dates are free-form** — Date fields (e.g. `"February 2026"`) are translated via DeepL along with other content. Ensure consistent formatting for best results.
- **No Authentication** — vCreate is fully stateless. No user data is ever persisted server-side.
- **No Mobile Editing** — The editor layout is optimized for desktop viewport widths (≥1200px).

---

## License

This project is private and unlicensed. All rights reserved.

---

<div align="center">

*Built with precision. Exported with elegance.*

**◈ vCreate**

</div>
