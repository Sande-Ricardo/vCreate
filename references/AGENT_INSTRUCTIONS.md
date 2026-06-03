# Agent Instructions

This document outlines the strict rules and guidelines that all autonomous development agents must follow when contributing to this project.

## 1. Communication & Language Rules

- **User Communication:** All chat responses and direct communication with the user must be in **Spanish**.
- **Development Language:** All code, implementation plans, configurations, artifacts, internal documentation, comments, variable names, and UI text must be exclusively in **English**.

## 2. Design & UI Restrictions

- **No Emojis:** Never use emojis in the UI or in any user-facing content.
- **Icons:** Always use SVG logos and icons for visual representation.
- **Aesthetics:** Strictly adhere to the "Luminous Professional" design guidelines specified in `DESIGN.md`. Ensure geometric shapes (0 roundedness), high contrast, and dark mode features are implemented.

## 3. Tooling & Dependencies

- **Package Manager:** NEVER use `npm` directly for installing dependencies or running scripts due to security/performance considerations. Always use **`pnpm`** (via `npx pnpm` if not globally installed) or `npx` for executing temporary binaries.

## 4. Guide to Analyzing the References Directory

When a new agent begins work on this project, they MUST analyze the `/references` directory in the following order to build full context:

1. **`AGENT_INSTRUCTIONS.md`** (This file): To understand the absolute boundaries and language rules.
2. **`PROJECT_STATE.md`**: To understand the exact current status of the project, implemented APIs, files, and next actions.
3. **`SRS.md`**: To understand the architecture, technical constraints, execution flow, and specific agent directives.
4. **`DESIGN.md`**: To grasp the visual identity, typography, layout grid, and component styles.
5. **`structure.json`**: To reference the single source of truth for the data model. All TypeScript interfaces should be derived from this schema.
6. **`cv_example.txt`**: To understand the expected LaTeX output structure. This file serves as the basis for creating the `template.tex`.
7. **Images (`.png`)**: To visualize the expected final layout and UI components (e.g., `Dashboard de Gestión.png`, `Vista Previa y Exportación.png`).

## 5. Critical Technical Constraints & Integration Rules

All agents contributing code must respect these integration details to prevent breaking existing functionality:

- **LaTeX Compiler API**: The service is configured to use `https://latex.ytotech.com/builds/sync`. The payload must be a JSON object with `"compiler": "pdflatex"` and the source code embedded under the `"resources"` array. Do NOT use `latexonline.cc` as it is highly unstable.
- **DeepL Translation API**: DeepL translations are handled dynamically in a single batch request in `src/lib/translate.ts`. The endpoint automatically selects between Free (`api-free.deepl.com`) and Pro (`api.deepl.com`) hosts depending on whether the API key ends with `:fx`.
- **Handlebars LaTeX Braces Collision**: Because LaTeX relies heavily on single curly braces `{}` and Handlebars uses double/triple curly braces `{{}}`/`{{{}}}`, always add a blank space between the closing of a Handlebars block and a closing LaTeX command brace to avoid parser errors (e.g., use `\href{mailto:{{{email}}} }{ {{{email}}} }` instead of `\href{mailto:{{{email}}}}{{{{email}}}}`).
- **Stateless Processing**: Never save intermediate or generated `.pdf`, `.tex`, or `.json` files to disk on the server. All processing must happen in memory via Buffers and then streamed/zipped using `jszip`.
