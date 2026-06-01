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
2. **`SRS.md`**: To understand the architecture, technical constraints, execution flow, and specific agent directives.
3. **`DESIGN.md`**: To grasp the visual identity, typography, layout grid, and component styles.
4. **`structure.json`**: To reference the single source of truth for the data model. All TypeScript interfaces should be derived from this schema.
5. **`cv_example.txt`**: To understand the expected LaTeX output structure. This file serves as the basis for creating the `template.tex`.
6. **Images (`.png`)**: To visualize the expected final layout and UI components (e.g., `Dashboard de Gestión.png`, `Vista Previa y Exportación.png`).
