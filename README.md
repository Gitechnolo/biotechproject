<div align="center">
  <img src="Biotech-file/images/biotech-performance-audit-2026.webp" alt="BiotechProject Performance Audit - 100% Lighthouse Scores" width="100%" />
</div>

# BiotechProject 🧬 🇬🇧
[![SRE Resilience Audit](https://img.shields.io/badge/SRE_Resilience-Clinical_Grade-blueviolet?style=flat-square&logo=shield-heart)](https://github.com/Gitechnolo/biotechproject/actions)

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
[![Security](https://img.shields.io/badge/security-dependabot-brightgreen)](https://github.com/Gitechnolo/biotechproject/security)
[![Vulnerabilities](https://img.shields.io/badge/vulnerabilities-none-brightgreen)](https://github.com/Gitechnolo/biotechproject/security)

---

## 🌱 What is BiotechProject?

BiotechProject is an **open digital lab** that combines **biotechnology, health, and web development** into an integrated system designed to be:

- 🔍 **Scientifically reliable**
- 💻 **Technically robust**
- 🌐 **Accessible to everyone**, including users with disabilities
- 🤝 **Open to global collaboration**

It was created to show how technology can serve science and healthcare, while ensuring equitable access for all -- regardless of sensory, cognitive, or motor abilities.

It's a collaborative space for developers, researchers, and enthusiasts who want to explore **how the web can become a tool for inclusion and scientific innovation**.

<div align="center">
  <h3>🗺️ Our Strategic Vision for Scalability</h3>
  <img src="Biotech-file/images/Strategic_Roadmap_for_Global_Scalability.webp" alt="BiotechProject Strategic Roadmap diagram showing three phases (I: Days 1-30, II: Days 31-60, III: Days 61-90) leading to Strategic Outcomes like Scalability Blueprint and Health Equity Certification. It highlights key technical milestones like Stateless Edge Deployment, Resource Optimization, and Privacy by Architecture." width="100%" />
</div>

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

## 🎯 Target Audience & Strategic Vision

The BiotechProject is engineered for stakeholders who prioritize resilience as a clinical requirement:

* **Health Systems & Health Initiatives**: Designed to scale metabolic digital twins with zero server-side compute costs, leveraging high-performance Vanilla JS for complex client-side logic.
* **Global Health Equity**: Engineered specifically for users in low-connectivity regions, ensuring sub-second (0.3s) load times even on legacy devices through SRE-grade optimization.
* **Neurodivergent Patients**: Native WCAG AAA compliance and 'Comfort Mode' provide a cognitively safe environment for healthcare interaction, reducing sensory overload.
* **SRE & Systems Engineers**: A blueprint for "SRE-for-Humans," where performance metrics (95% aggregate score) are treated as a commitment to user inclusion and reliability.

---

## 🏗 Architectural Decision Records (ADR)

This project follow a rigorous decision-making process to ensure enterprise-grade resilience. Each decision is cross-validated for architectural integrity.

| ID | Decision | Core Outcome | Validation |
| :--- | :--- | :--- | :--- |
| **001** | **Zero-Framework Mandate** | < 20KB Bundle / 0.3s TTI | [Issue #12](https://github.com/Gitechnolo/biotechproject/issues/12) |
| **002** | **Stateless Edge Intelligence** | 100% Service Availability | [Issue #13](https://github.com/Gitechnolo/biotechproject/issues/13) |
| **003** | **AI-Assisted SRE Auditing** | 87% Tech Maturity Score | [Issue #14](https://github.com/Gitechnolo/biotechproject/issues/14) |
| **004** | **Circadian State Machine** | 98% CPU Cycle Reduction | [Issue #15](https://github.com/Gitechnolo/biotechproject/issues/15) |
| **005** | **SRE-Driven Data Portability** | Zero-Latency Data Export | [Issue #17](https://github.com/Gitechnolo/biotechproject/issues/17) |

<details>
<summary><b>Click to expand: Full ADR Rationale</b></summary>

### [ADR-001] Zero-Framework Mandate
* **Decision**: Bypass modern frameworks (React/Angular/Vue) in favor of pure **Vanilla JS (ES6+)**.
* **Rationale**: Eliminates the "framework tax". In health-critical contexts, sub-second interactivity is a clinical requirement.
* **Outcome**: Initial bundle size **< 20KB** and TTI of **0.3s**.
* **Validation**: [View Engineering Log (#12)](https://github.com/Gitechnolo/biotechproject/issues/12)

### [ADR-002] Stateless Edge & Client-Side Intelligence
* **Decision**: Migrate complex metabolic and biological sync logic entirely to the client side.
* **Rationale**: Guarantees **100% service availability** during network surges or backend outages.
* **Outcome**: 85% reduction in infrastructure costs.
* **Validation**: [View Resilience Report (#13)](https://github.com/Gitechnolo/biotechproject/issues/13)

### [ADR-003] AI-Assisted SRE Auditing
* **Decision**: Multi-model orchestration (Gemini + Copilot) for code review.
* **Rationale**: Overcomes individual LLM hallucinations via "consensus" on type safety.
* **Outcome**: 87% technical maturity score.
* **Validation**: [View Audit Protocol (#14)](https://github.com/Gitechnolo/biotechproject/issues/14)

### [ADR-004] Circadian State Machine
* **Decision**: Implementation of a resource-efficient **Early Return pattern**.
* **Rationale**: Reduces cognitive load without triggering expensive re-renders or heavy polling.
* **Outcome**: 98% reduction in background CPU cycles.
* **Validation**: [View Performance Pattern (#15)](https://github.com/Gitechnolo/biotechproject/issues/15)

### [ADR-005] SRE-Driven Data Portability
* **Decision**: Deployment of a zero-latency export layer using native Blob APIs.
* **Rationale**: Ensures data sovereignty for health records with "Lean Logic" (no libraries).
* **Outcome**: Instant CSV/JSON generation.
* **Validation**: [View Export Strategy (#17)](https://github.com/Gitechnolo/biotechproject/issues/17)
</details>

---

## 📊 Technical Quality Monitoring & Architecture

The project implements an **advanced technological maturity tracking system** via GitHub Actions. As of **March 14, 2026**, the ecosystem maintains a **95% aggregate performance score**.

> [!IMPORTANT]
> **Performance Stress-Test:** Metrics are validated under **extreme synthetic throttling** (150ms RTT / 4x CPU slowdown). This SRE-grade audit ensures that core clinical modules remain accessible and performant even during peak-hour network instability or on legacy hardware.

**Update March 14, 2026:** Successfully integrated the **Data Portability Audit layer (ADR-005)**. The system now supports real-time performance telemetry exports without impacting Main Thread execution.

📂 **Latest Audit Records:**
* 📄 **[SRE Performance Stress-Test Report - March 06, 2026 (PDF)](docs/biotech-performance-report.pdf)**
* 📄 **[Executive Summary: Metabolic Digital Twin Architecture (PDF)](docs/Metabolic-Digital-Twin-Executive-Summary.pdf)**

### Dashboard Features
* ✅ **Real-time Performance Monitoring**: Metrics (0–100) updated every 24h via GitHub Actions.
* ✅ **Resilience Intelligence**: Automated tracking of `optimized` and `compatible` states under stress.
* 💾 **Open Data & Transparency**: Access the **[Raw Performance Dataset (JSON)](https://github.com/Gitechnolo/biotechproject/blob/main/data/performance-latest.json)** for third-party verification or download analytics directly from the UI.

👉 **View the live dashboard:** [Tech_Maturity.html](https://gitechnolo.github.io/biotechproject/Tech_Maturity.html)

---

## 📂 Navigation Hub (Optimized Assets)

> [!TIP]
> This section provides a streamlined interface to access the minified production assets. For development files, please refer to the `src/` directory.

### 🛡️ Verified Production Assets

[![SRE Audit Status](https://img.shields.io/badge/SRE_Audit-Verified-brightgreen?style=flat-square&logo=githubactions&logoColor=white)](https://github.com/Gitechnolo/biotechproject/actions)
> [!IMPORTANT]  
> **Methodology Note:** The dates listed in the "Last Audit" column represent the most recent **Global System Validation**. This includes automated security scans, performance stress-tests (Lighthouse), and link integrity checks. Even if a specific asset's content remains unchanged, its reliability is recertified during each audit cycle.

<details>
<summary><b>🧬 Anatomy & Biological Systems (Standard & Easy-Read)</b></summary>

| System | ⚡ Scientific standard | 📝 Dyslexia-friendly | 📅 Last Audit |
| :--- | :--- | :--- | :--- |
| **Digestive System** | [View](https://gitechnolo.github.io/biotechproject/Apparato_digerente.html) | [Easy-Read](https://gitechnolo.github.io/biotechproject/Apparato_digerente-semplice.html) | 2026-03-26 |
| **Respiratory System** | [View](https://gitechnolo.github.io/biotechproject/Apparato_respiratorio.html) | [Easy-Read](https://gitechnolo.github.io/biotechproject/Apparato_respiratorio-semplice.html) | 2026-03-26 |
| **Integumentary System** | [View](https://gitechnolo.github.io/biotechproject/Apparato_tegumentario.html) | [Easy-Read](https://gitechnolo.github.io/biotechproject/Apparato_tegumentario-semplice.html) | 2026-03-26 |
| **Lymphatic System** | [View](https://gitechnolo.github.io/biotechproject/Sistema_linfatico.html) | [Easy-Read](https://gitechnolo.github.io/biotechproject/Sistema_linfatico-semplice.html) | 2026-03-26 |
| **Heart / Cardiac** | [View](https://gitechnolo.github.io/biotechproject/Cuore.html) | [Easy-Read](https://gitechnolo.github.io/biotechproject/Cuore-semplice.html) | 2026-03-26 |
| **Cell Biology** | [View](https://gitechnolo.github.io/biotechproject/Cellula.html) | [Easy-Read](https://gitechnolo.github.io/biotechproject/Cellula-semplice.html) | 2026-03-26 |
| **Dermatology** | [View](https://gitechnolo.github.io/biotechproject/Dermatologia.html) | [Easy-Read](https://gitechnolo.github.io/biotechproject/Dermatologia-semplice.html) | 2026-03-26 |
| **Hair / Capelli** | [View](https://gitechnolo.github.io/biotechproject/Capelli.html) | [Easy-Read](https://gitechnolo.github.io/biotechproject/Capelli-semplice.html) | 2026-03-26 |

</details>

<details>
<summary><b>🛠️ Project Management & Utilities</b></summary>

| Resource | Access Link | 📅 Last Audit |
| :--- | :--- | :--- |
| 🚀 **Tech Maturity Score** | [Interactive Dashboard](https://gitechnolo.github.io/biotechproject/Tech_Maturity.html) | 2026-03-26 |
| 📈 **Marketing Strategy** | [Strategic Analysis](https://gitechnolo.github.io/biotechproject/Marketing.html) | 2026-03-26 |
| 🏗️ **Project Portfolio** | [Project Overview](https://gitechnolo.github.io/biotechproject/Progetti.html) | 2026-03-26 |
| 👥 **Staff & Team** | [Governance & Members](https://gitechnolo.github.io/biotechproject/Staff.html) | 2026-03-26 |
| 💬 **Tablet Forum** | [Community Discussion](https://gitechnolo.github.io/biotechproject/Tablet_forum.html) | 2026-03-26 |

</details>

<details>
<summary><b>♿ Accessibility & Inclusion</b></summary>

- 🇮🇹 **Dichiarazione di Accessibilità**: [Leggi (IT)](https://gitechnolo.github.io/biotechproject/accessibility-it.html) — *Updated: 2026-03-26*
- 🇬🇧 **Accessibility Statement**: [Read (EN)](https://gitechnolo.github.io/biotechproject/accessibility-en.html) — *Updated: 2026-03-26*
- ✨ **Special Modules**: [Specials](https://gitechnolo.github.io/biotechproject/Specials.html) — *Updated: 2026-03-26*

</details>

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

[![Case Study - Building an Accessible Biotech Platform](https://img.shields.io/badge/Case%20Study-BiotechProject%20Accessibility-brightgreen?logo=github&labelColor=222)](https://github.com/Gitechnolo/biotechproject/discussions/4)


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

`common.json` contains shared strings (menu, footer, etc.), page files contain per-page text.

```text
lang/
├── common.json                  # Shared strings (menu, footer, UI)
│
├── home.json                    # index.html
├── progetti.json                # Progetti.html
├── staff.json                   # Staff.html
├── marketing.json               # Marketing.html
├── tech_maturity.json           # Tech_Maturity.html
│
├── dermatologia.json            # Dermatologia.html + Dermatologia-semplice.html
├── cuore.json                   # Cuore.html + Cuore-semplice.html
├── cellula.json                 # Cellula.html + Cellula-semplice.html
├── apparato_digerente.json      # Apparato_digerente.html + -semplice.html
├── apparato_respiratorio.json   # Apparato_respiratorio.html + -semplice.html
├── apparato_tegumentario.json   # Apparato_tegumentario.html + -semplice.html
├── sistema_linfatico.json       # Sistema_linfatico.html + -semplice.html
└── capelli.json                 # Capelli.html + Capelli-semplice.html
```


## 📅 Last Verification Date
**March 22, 2026**

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

This project implements a **Dual-Licensing Strategy** to ensure the integrity of both architectural logic and scientific educational content:

* **Source Code**: [MIT License](LICENSE-MIT.md) - © 2025-2026 Fabrizio ([@Gitechnolo](https://github.com/Gitechnolo))
* **Scientific Content (Text, Graphics, Educational Material)**: [Creative Commons Attribution 4.0 International](LICENSE-CC-BY-4.0.md)

> “Anyone can contribute. Just respect the origin, and keep building with care.”   

---

## 🙌 Author

Author: **Fabrizio** ([@Gitechnolo](https://github.com/Gitechnolo))  
Project available at: [https://github.com/Gitechnolo/biotechproject](https://github.com/Gitechnolo/biotechproject)

> “Anyone can contribute. Just respect the origin, and keep building with care.”
