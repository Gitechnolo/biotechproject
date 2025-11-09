<div align="center">
  <img src="BiotechProjectBanner.png" alt="BiotechProject Banner" width="100%" />
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

> 🌍 *"We don't all speak the same languages, but we speak the same language: collaboration."*  
> English is not a barrier — it's a bridge.  
> 🔹 To contribute or review project guidelines, visit the main English files:  
> - [Contributing Guidelines](CONTRIBUTING.md)  
> - [Code of Conduct](CODE_OF_CONDUCT.md)  
> Using English supports international collaboration.

**An open source project that unites science, health, and web technology.**  
Where biotechnology meets code to build digital tools for research and innovation.

![License](https://img.shields.io/github/license/Gitechnolo/biotechproject)
![Workflow Status](https://github.com/Gitechnolo/biotechproject/actions/workflows/performance.yml/badge.svg)
![Last Commit](https://img.shields.io/github/last-commit/Gitechnolo/biotechproject?color=blue)

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

---

## 📊 Technical Quality Monitoring

The project includes an automated system to monitor the technical quality of its pages, with daily updates via GitHub Actions.  
Starting from September 2025, an **advanced technological maturity tracking system** has been introduced, combining real data and forecasts to visualize the project’s overall evolution.

### Dashboard Features
- ✅ **Performance score** (0–100) per page
- ✅ **Page load time** and optimization status
- ✅ **Maturity level**: `optimized`, `compatible`, `needs-improvement`, `deprecated`
- 📈 **Maturity trend graph** (historical data + forecast up to 100%)
- 💾 **Data export** in JSON/CSV for external analysis
- 🕒 Data updated every 24 hours (or manually via "Refresh now")

📊 The system displays both the **current project status** and a **realistic projection to full development completion** (estimated February 2026), based on actual improvements (e.g., accessibility, UX, performance).

👉 View the live dashboard: [Tech_Maturity.html](https://gitechnolo.github.io/biotechproject/Tech_Maturity.html)    

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

---

## Accessibility & Case Study

We're committed to building an inclusive platform. Explore how we implemented WCAG 2.1 AA compliance and multilingual support:

[![Case Study - Building an Accessible Biotech Platform](https://img.shields.io/badge/Case%20Study-BiotechProject%20Accessibility-brightgreen?logo=github&labelColor=222)](biotechproject-case-study.md)


## 🌍 Multilingual Management (i18n)

BiotechProject supports **multiple languages** through a **modular, lightweight, and accessible** translation system, designed to work seamlessly on static pages hosted on GitHub Pages.

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
   
lang/
├── common.json               → menu, footer, language button
├── home.json                 → index.html
├── progetti.json             → Progetti.html
├── staff.json                → Staff.html
├── marketing.json            → Marketing.html
├── tech_maturity.json        → Tech_Maturity.html
├── dermatologia.json         → Dermatologia.html and Dermatologia-semplice.html
├── cuore.json                → Cuore.html and Cuore-semplice.html
├── cellula.json              → Cellula.html and Cellula-semplice.html
├── apparato_digerente.json   → Apparato_digerente.html and -semplice.html
├── apparato_respiratorio.json → Apparato_respiratorio.html and -semplice.html
├── apparato_tegumentario.json → Apparato_tegumentario.html and -semplice.html 
├── sistema_linfatico.json     → Sistema_linfatico.html and -semplice.html



## 📅 Last Verification Date
**November 8, 2025**

## 🔮 Recent Updates

We have introduced several technical and accessibility improvements to the project. The main new features include:

- Extended performance dashboard:
  - Full integration of Lighthouse data into `data/performance-latest.json`.
  - Aggregated metrics visualization on Tech_Maturity.html (chart, page list, scores).
  - Option to manually update the dashboard and export data in JSON/CSV via the "Export data" button.

- Graphic and UX improvements:
  - Dynamic charts with Chart.js for performance trends.
  - Loading spinner and optimizations for mobile and low-resource devices.
  - Dynamic backgrounds and weather icons in the Weather section (responsive).

- Performance & resource savings:
  - Optimized particles: reduced frame rate for less powerful CPU/GPU and cleanup via destroy().
  - Advanced lazy-loading for images using IntersectionObserver.
  - Reduced initial JS load and deferred loading of heavy scripts.

- Enhanced accessibility:
  - Full keyboard navigation, focus management, and ARIA improvements in menus.
  - Non-blocking modular translation system.
  - Text-to-Speech functionality for technical terms.
  - Alternative/descriptive tables for charts (for non-visual users).
  - Support for persistent user preferences (theme, keyboard navigation, QRedshift) via localStorage.

- CI/CD tools and monitoring:
  - The pipeline automatically generates performance data via Lighthouse and saves results in `data/performance-latest.json`.
  - A script (generate-performance.js) is available to populate `performance-data.json` / `performance-latest.json`.   



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
