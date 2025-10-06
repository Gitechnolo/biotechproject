---
title: "Building an Accessible Open-Source Biotech Platform: The BiotechProject Case Study"
description: "How BiotechProject prioritizes accessibility and multilingual support in its open-source web platform."
date: 2025-10-05
author: Fabrizio
hero: https://gitechnolo.github.io/biotechproject/images/hero-accessibility.jpg
tags: [a11y, open source, multilingual, semantic html, wcag]
---

## Introduction

BiotechProject is an open-source initiative aimed at making biotechnology knowledge accessible to everyone. From the start, **accessibility and inclusivity** were core principles — not afterthoughts. In this case study, I’ll walk through how we built an accessible, responsive, and fully bilingual (Italian/English) platform using semantic HTML, progressive enhancement, and automated testing.

## Why Accessibility Matters in Biotech

Scientific information should be available to all — including people with disabilities. Many users rely on screen readers, keyboard navigation, or high-contrast modes. We ensured BiotechProject works seamlessly across assistive technologies, following [WCAG 2.1 AA](https://www.w3.org/TR/WCAG21/) guidelines.

## Designing for Everyone

### Semantic HTML & Keyboard Navigation
We used proper heading structure, `<nav>`, `<main>`, and ARIA landmarks to ensure screen reader compatibility. All interactive elements are keyboard-focusable and have visible focus indicators.

### Color Contrast & Readability
Text meets minimum contrast ratios (4.5:1). We tested with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) and WAVE, achieving zero contrast errors.

### Responsive & Zoom-Friendly Layout
The layout adapts to all screen sizes. Users can zoom up to 400% without loss of content or functionality.

## Multilingual Accessibility

BiotechProject automatically serves content in **English or Italian** based on user locale. A language toggle in the mobile menu allows manual switching.

We ensured:
- `lang` attributes are correctly set (`lang="en"` / `lang="it"`).
- Screen readers announce text in the correct language.
- Translations are consistent and clear.


## Progressive Enhancement Strategy

We use `<noscript>` to inform users if JavaScript is disabled:

```html
<noscript>
  <p>To experience BiotechProject fully, enable JavaScript in your browser.</p>
</noscript>   
```

Since the core content is static and accessible without JS, this message is informative, not obstructive.

## Testing & Validation

We tested with:
- **WAVE** – No errors detected.
- **NVDA + Firefox** – Full navigation and announcement.
- **Keyboard-only** – All functionality reachable.
- **ZoomText & High Contrast Mode** – No visual breakage.

We also validate HTML and CSS automatically in our CI pipeline.

## Open Source & Community

BiotechProject is hosted on GitHub:  
[github.com/Gitechnolo/biotechproject](https://github.com/Gitechnolo/biotechproject)

We welcome contributions — especially in accessibility testing and translation.

## Conclusion

Accessibility isn’t a feature — it’s a responsibility. By building BiotechProject the right way from day one, we ensure that **everyone**, regardless of ability or language, can access vital biotech knowledge.

We hope this project inspires others to prioritize accessibility in scientific communication.

> Published with ❤️ for the web and all who use it.   