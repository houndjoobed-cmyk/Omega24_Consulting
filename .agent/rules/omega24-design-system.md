---
trigger: always_on
---


# 📘 OMEGA 24 CONSULTING - Global Design System & Brand Guidelines

**Context:** This rule applies to ALL frontend development, UI components, marketing materials, and page generation for "OMEGA 24 CONSULTING".
**Constraint:** You must STRICTLY adhere to the defined official color palette, typography, and logo usage rules.

## 1. CSS Variables (Source of Truth)
Always define and use the following CSS variables in the global `:root` or base styling file. NEVER use hardcoded HEX values in components.

css
:root {
  /* Primary Brand Colors */
  --omega-dark-blue: #002F6C;  /* Stability, trust, professionalism - Use for main structure, footers, primary text */
  --omega-light-blue: #4DA6FF; /* Modernity, technology - Use for accents, highlights, secondary elements */
  --omega-white: #FFFFFF;      /* Purity, main backgrounds */

  /* Secondary / Neutral Colors */
  --omega-light-gray: #F4F4F4; /* Neutral backgrounds, card backgrounds, soft sections */
  --omega-black: #000000;      /* Sober text, high contrast needs */
}


## 2. Typography Rules

Apply these font stacks consistently across the project:

* **Headings & Brand Display (Titles):** `'Times New Roman', Times, serif` (Must convey elegance and seriousness, usually `font-weight: bold`).
* **Body Text & UI Elements (Paragraphs, buttons, links):** `'Open Sans', 'Lato', Arial, sans-serif` (Must ensure maximum readability on digital platforms).

## 3. Logo & Visual Asset Usage

When integrating or styling the Omega 24 Consulting logo or visual assets:

* **Integrity:** NEVER stretch, compress, or distort the logo proportions. Maintain aspect ratio at all times.
* **Coloration:** NEVER change the official colors or add unauthorized effects (no drop shadows, no unexpected gradients).
* **Placement:** Ensure the logo is placed on a white or light background (`--omega-white` or `--omega-light-gray`). Avoid busy or multicolored backgrounds that impair legibility.
* **Variants to use based on context:**
* *Primary Logo (Globe + Text):* Use for official headers, hero sections, and main branding.
* *Simplified Logo (Globe only or Text only):* Use for restricted spaces, favicons, or mobile navigation bars.
* *Monochrome (Dark Blue or Black):* Use ONLY for print stylesheets, administrative documents, or specific minimalist UI constraints.



## 4. UI/UX Enforcement

* **Buttons & CTAs:** Use `--omega-dark-blue` for primary actions and `--omega-light-blue` for secondary actions. Always ensure text contrast (e.g., `--omega-white` text on dark blue background).
* **Backgrounds:** Rely heavily on `--omega-white` and `--omega-light-gray` to maintain a clean, professional, and corporate look.


