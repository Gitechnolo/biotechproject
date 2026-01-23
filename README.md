<div align="center">
  <img src="biotech-performance-audit-2026.webp" alt="BiotechProject Performance Audit - 100% Lighthouse Scores" width="100%" />
</div>

# BiotechProject 🧬 🇬🇧

🌐 **Read in other languages:**  
[Italiano 🇮🇹](README.it.md) | 
[English 🇬🇧](README.md) | 
[Español 🇪🇸](README.es.md) | 
[Français 🇫🇷](README.fr.md) | 
[Deutsch 🇩🇪](README.de.md) | 
[Dutch 🇳🇱](README.nl.md) |
[Português (BR) 🇧🇷](README.pt-br.md)

> 💡 **Executive Briefing (Jan 17, 2026):**
>
> This project has evolved from a performance-driven experiment into a **Strategic Blueprint for Resilient Health Architecture**.  
> We have formalized our "Stateless Edge" methodology in a new report that addresses global health inequities caused by latency and cognitive barriers.  
>
> 👉 **Read the Strategic Report:** [Architectural Equity & Global Resilience Report (PDF)](docs/Architectural_Equity_Resilience_Report.pdf)


> 🌍 *"We don't all speak the same languages, but we speak the same language: collaboration."*  
> English is not a barrier - it's a bridge.  
> 🔹 To contribute or review project guidelines, visit the main English files:  
> - [Contributing Guidelines](CONTRIBUTING.md)  
> - [Code of Conduct](CODE_OF_CONDUCT.md)  
> Using English supports international collaboration.

**An open source project that unites science, health, and web technology.**  
Where biotechnology meets code to build digital tools for research and innovation.

[![License](https://img.shields.io/github/license/Gitechnolo/biotechproject)](https://github.com/Gitechnolo/biotechproject/blob/main/LICENSE-MIT.md)
[![Workflow Status](https://github.com/Gitechnolo/biotechproject/actions/workflows/performance.yml/badge.svg)](https://github.com/Gitechnolo/biotechproject/actions/workflows/performance.yml)
[![Last Commit](https://img.shields.io/github/last-commit/Gitechnolo/biotechproject?color=blue)](https://github.com/Gitechnolo/biotechproject/commits)

---

## 🌱 What is BiotechProject?

BiotechProject is an **open digital lab** that combines **biotechnology, health, and web development** into an integrated system designed to be:

- 🔍 **Scientifically reliable**
- 💻 **Technically robust**
- 🌐 **Accessible to everyone**, including users with disabilities
- 🤝 **Open to global collaboration**

It was created to show how technology can serve science and healthcare, while ensuring equitable access for all — regardless of sensory, cognitive, or motor abilities.

It's a collaborative space for developers, researchers, and enthusiasts who want to explore **how the web can become a tool for inclusion and scientific innovation**.

---

## 🚀 Key Features

✅ **Open by design**  
→ Open to contributions, ideas, and international collaboration

✅ **Integrated CI/CD workflow**  
→ Automated testing, analysis, and updates on every change

✅ **Automated performance dashboard**  
→ Continuous analysis of all pages with updates to `performance-data.json`

✅ **Dynamic filter by category**  
→ Interactive interface to explore technological maturity status

✅ **Responsive and accessible design**  
→ Works across all devices, with strong focus on usability and WCAG compliance

✅ **Privacy-by-Architecture**
→ 100% client-side data processing ensures bio-sensitive data never leaves the user's browser, aligning with GDPR/HIPAA standards by design.

---
## 🏗 Architectural Decision Records (ADR)

This project follows a rigorous decision-making process to ensure enterprise-grade resilience and performance. Below are the core architectural pillars:

### [ADR-001] Zero-Framework Mandate
* **Decision**: Bypass modern frameworks (React/Angular/Vue) in favor of pure Vanilla JS (ES6+).
* **Rationale**: Eliminates the "framework tax" on the Main Thread. In health-critical contexts, sub-second interactivity is a clinical requirement, not just a metric. 
* **Outcome**: Initial bundle size **< 20KB** and TTI (Time to Interactive) of **0.3s**.

### [ADR-002] Stateless Edge & Client-Side Intelligence
* **Decision**: Migrate complex metabolic and biological synchronization logic entirely to the client side.
* **Rationale**: Guarantees **100% service availability** during network surges or backend outages. This ensures users have access to bio-data even in offline or degraded connectivity (3G/Edge) scenarios.
* **Outcome**: 85% reduction in backend infrastructure costs and native GDPR/HIPAA data sovereignty.

### [ADR-003] AI-Assisted SRE Auditing
* **Decision**: Implementation of a cross-validation orchestration between Gemini 1.5 Pro and GitHub Copilot for code review and security audits.
* **Rationale**: Overcomes individual LLM hallucinations by enforcing a multi-model "consensus" on type safety and architectural integrity.
* **Outcome**: 87% technical maturity score and automated 24h reliability checks.

---

## 📊 Technical Quality Monitoring & Architecture

The project implements an **advanced technological maturity tracking system** via GitHub Actions. As of **January 23, 2026**, the ecosystem maintains a **95% aggregate performance score** even under extreme network stress tests (150ms RTT / 4x CPU slowdown). 

While environmental noise during simulated throttling can cause minor performance fluctuations in individual pages, this SRE-grade audit ensures that core clinical modules remain accessible and performant during peak-hour network instability.

📂 **Latest Audit Records:**
* 📄 **[SRE Performance Stress-Test Report - Jan 23, 2026 (PDF)](docs/biotech-performance-report.pdf)** ⬅️ *New*
* 📄 **[Executive Summary: Metabolic Digital Twin Architecture (PDF)](docs/Metabolic-Digital-Twin-Executive-Summary.pdf)**

### Dashboard Features
- ✅ **Real-time Performance Monitoring**: Score (0–100) and load times updated every 24h.
- ✅ **Resilience Intelligence**: Automated tracking of `optimized`, `compatible`, and `deprecated` states under stress.
- 💾 **Open Data**: Export analytics in JSON/CSV/PDF for third-party audits directly from the UI.

👉 **View the live dashboard:** [Tech_Maturity.html](https://gitechnolo.github.io/biotechproject/Tech_Maturity.html)

---

## 🌐 Accessibility

The site is **conformant with WCAG 2.1 Level AA** for all main pages.  
Conformance has been verified through:

- Automated audits (Lighthouse, axe, WAVE)
- Manual testing with screen readers (NVDA, VoiceOver)
- Full keyboard navigation (tab, shift+tab, enter, space, arrows)
- W3C code validation
- Direct code inspection for semantic structure and correct ARIA usage

The project is **partially conformant with Level AAA**, particularly in:
- Color contrast (most text exceeds 7:1 ratio)
- Hierarchical heading structure
- Use of descriptive alternative text

However, some AAA criteria are not applicable or required in the current context (e.g. video captions, extended plain language).   

📄 **Full accessibility statement:**  
👉 [Read Accessibility Statement (EN)](https://gitechnolo.github.io/biotechproject/accessibility-en.html)  
👉 [Leggi la Dichiarazione di Accessibilità (IT)](https://gitechnolo.github.io/biotechproject/accessibility-it.html)


### 🔍 Advanced Accessibility Features

- **DNA Scanner & Audit**: Interactive module with structured PDF Report generation, bilingual `aria-label`, and secure focus management  
- **HUD & Dynamic Tooltips**: Instant scientific explanations with text descriptions and percentage intensity values for all data points  
- **Circadian Synchrony**: Content adapts to time and season (axial tilt), reducing cognitive load via biological context-aware advice

---

## Accessibility & Case Study

We're committed to building an inclusive platform. Explore how we implemented WCAG 2.1 AA compliance and multilingual support:

[![Case Study - Building an Accessible Biotech Platform](https://img.shields.io/badge/Case%20Study-BiotechProject%20Accessibility-brightgreen?logo=github&labelColor=222)](biotechproject-case-study.md)


## 🌍 Multilingual Management (i18n)

BiotechProject supports **multiple languages** through a **modular, lightweight, and accessible** translation system, designed to work seamlessly on static pages hosted on GitHub Pages.
"While text content is fully localized, scientific diagrams currently prioritize Italian/English versions to maintain technical accuracy during the project's rapid evolution."

The system enables:
- ✅ Real-time content translation  
- ✅ Persistent language selection across pages (like Wikipedia or Google)  
- ✅ Support for simplified versions for dyslexic users  
- ✅ Easy extension by contributors  

### 🧩 System Architecture

- **Modular JSON files**: each page has its own translation file in the `lang/` directory  
- **Common.json**: contains shared texts (menu, footer, language button)  
- **No backend required**: everything runs in pure JavaScript  
- **LocalStorage**: remembers the user's selected language  
- **`data-lang-key`**: HTML attribute to identify translatable elements  

### 📁 Structure of the `lang/` folder

For clarity, the table below maps HTML pages to their translation JSON files. `common.json` contains shared strings (menu, footer, etc.), page files contain per-page text.

| Page (.html) | Translation file (.json) | Notes |
|---|---:|---|
| index.html | lang/home.json | Home |
| Progetti.html | lang/progetti.json | Projects |
| Staff.html | lang/staff.json | Staff |
| Marketing.html | lang/marketing.json | Marketing |
| Tech_Maturity.html | lang/tech_maturity.json | Performance dashboard |
| Dermatologia.html / -semplice | lang/dermatologia.json | Main + simplified |
| Cuore.html / -semplice | lang/cuore.json | Main + simplified |
| Cellula.html / -semplice | lang/cellula.json | Main + simplified |
| Apparato_digerente.html / -semplice | lang/apparato_digerente.json | Main + simplified |
| Apparato_respiratorio.html / -semplice | lang/apparato_respiratorio.json | Main + simplified |
| Apparato_tegumentario.html / -semplice | lang/apparato_tegumentario.json | Main + simplified |
| Sistema_linfatico.html / -semplice | lang/sistema_linfatico.json | Main + simplified |
| Capelli.html / -semplice | lang/capelli.json | New pages added to monitoring |
| Shared strings | lang/common.json | Menu, footer, shared UI text |


## 📅 Last Verification Date
**January 15, 2026**

## 🔮 Recent updates (summary)

Key recent improvements (concise):

- Performance dashboard: Lighthouse data integrated into data/performance-latest.json and visualized on Tech_Maturity.html (chart + page list + export).
- Data export: JSON/CSV export from dashboard ("Export data").
- Charts + accessibility: Chart.js charts accompanied by hidden tables/descriptions for assistive tech.
- Performance optimizations: advanced lazy-loading, deferred heavy scripts, optimized particle canvas and cleanup.
- UX & preferences: dynamic theme, persisted preferences (localStorage), improved keyboard navigation and ARIA/focus handling.
- CI/CD & transparency: automated Lighthouse runs (generate-performance.js) and public JSON for audits.



## 💡 Want to contribute?

You're welcome!  
BiotechProject is an **open project for everyone**, inspired by the collaborative spirit of Wikipedia.

🔹 To get started:
- Read the [**Contributing Guidelines**](CONTRIBUTING.md)
- Follow the [**Code of Conduct**](CODE_OF_CONDUCT.md)

You can help with:
- Scientific content
- Technical or accessibility improvements
- Translations
- Bug reports and suggestions

Every contribution — big or small — helps make science more accessible.

---

## 🛠️ Technologies Used
- Semantic HTML5
- CSS3 with Custom Properties
- Vanilla JavaScript (no frameworks)
- ARIA 1.2 for dynamic interactions
- GitHub Actions for CI/CD
- Lighthouse for performance monitoring

---

## 📄 License

📄 License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)  
You are free to share, adapt, and use the project commercially, as long as you give appropriate credit.

- **Content (text, graphics, educational material)**: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- **Source code**: [MIT License](https://opensource.org/licenses/MIT)

"Anyone can contribute. Just respect the origin, and keep building with care."   

---

## 🙌 Author

Author: **Fabrizio** ([@Gitechnolo](https://github.com/Gitechnolo))  
Project available at: [https://github.com/Gitechnolo/biotechproject](https://github.com/Gitechnolo/biotechproject)

> “Anyone can contribute. Just respect the origin, and keep building with care.”
