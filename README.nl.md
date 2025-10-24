<div align="center">
  <img src="BiotechProjectBanner.png" alt="BiotechProject Banner" width="100%" />
</div>

# BiotechProject 🧬 🇳🇱

🌐 **Lees in andere talen:**  
[Italiano 🇮🇹](README.it.md) | 
[English 🇬🇧](README.md) | 
[Español 🇪🇸](README.es.md) | 
[Français 🇫🇷](README.fr.md) | 
[Deutsch 🇩🇪](README.de.md) | 
[Dutch 🇳🇱](README.nl.md) | 
[Português (BR) 🇧🇷](README.pt-br.md)

> 🌍 *"Welkom allemaal. We spreken niet alle talen, maar we spreken dezelfde taal: samenwerking."*  
> Engels is geen obstakel, het is een brug.  
> 🔹 Voor bijdragen of projectrichtlijnen, bezoek de hoofdbestanden in het Engels:  
> - [Contributing Guidelines](CONTRIBUTING.md)  
> - [Code of Conduct](CODE_OF_CONDUCT.md)  
> Het gebruik van Engels bevordert internationale samenwerking.

**Een open-source project dat wetenschap, gezondheid en webtechnologie verenigt.**  
Waar biotechnologie en code samenkomen om digitale hulpmiddelen voor onderzoek en innovatie te bouwen.

![License](https://img.shields.io/github/license/Gitechnolo/biotechproject)
![Workflow Status](https://github.com/Gitechnolo/biotechproject/actions/workflows/performance.yml/badge.svg)
![Last Commit](https://img.shields.io/github/last-commit/Gitechnolo/biotechproject?color=blue)

---

## 🌱 Wat is BiotechProject?

BiotechProject is een **open digitaal laboratorium** dat **biotechnologie, gezondheid en webontwikkeling** combineert in een geïntegreerd systeem dat ontworpen is om:

- 🔍 **Wetenschappelijk betrouwbaar** te zijn
- 💻 **Technisch robuust**
- 🌐 **Voor iedereen toegankelijk**, inclusief gebruikers met een beperking
- 🤝 **Open voor wereldwijde samenwerking**

Het project is ontstaan om te laten zien hoe technologie de wetenschap en gezondheid kan ondersteunen, terwijl tegelijkertijd iedereen gelijke toegang heeft, ongeacht zintuiglijke, cognitieve of motorische vermogens.

Het is een samenwerkingsruimte voor ontwikkelaars, onderzoekers en enthousiastelingen die willen verkennen **hoe het web een instrument kan worden voor inclusie en wetenschappelijke innovatie**.

---

## 🚀 Belangrijkste functies

✅ **Open by design**  
→ Open voor bijdragen, ideeën en internationale samenwerking

✅ **Geïntegreerde CI/CD workflow**  
→ Automatische tests, analyses en updates bij elke wijziging

✅ **Automatische prestatiedashboard**  
→ Continue analyse van alle pagina's met update van `performance-data.json`

✅ **Dynamisch filter op categorie**  
→ Interactieve interface om de technologische rijpheid te verkennen

✅ **Responsief en toegankelijk ontwerp**  
→ Werkt op alle apparaten, met aandacht voor gebruiksvriendelijkheid en WCAG-eisen

---

## 📊 Technische Kwaliteitsmonitoring

Het project bevat een automatisch systeem om de technische kwaliteit van de pagina's te monitoren, met dagelijkse updates via GitHub Actions.  
Vanaf september 2025 is een **geavanceerd systeem voor het monitoren van de technologische rijpheid van het project** geïntroduceerd, dat echte gegevens en voorspellingen combineert om de algehele evolutie van de site te volgen.

### Functies van het dashboard
- ✅ **Prestatiescore** (0–100) per pagina
- ✅ **Laadtijd** en optimalisatiestatus
- ✅ **Rijpheidscategorie**: `optimized`, `compatible`, `needs-improvement`, `deprecated`
- 📈 **Rijpheidgrafiek** (historische gegevens + voorspelling tot 100%)
- 💾 **Gegevensexport** in JSON/CSV voor externe analyse
- 🕒 Gegevens dagelijks bijgewerkt (of handmatig via "Nu bijwerken")

📊 Het systeem toont zowel het **huidige niveau** als een **realistische projectie tot voltooiing van de ontwikkelcyclus** (verwacht februari 2026), gebaseerd op daadwerkelijke verbeteringen (bijv. toegankelijkheid, UX, optimalisatie).

👉 Bekijk het dashboard in real time: [Tech_Maturity.html](https://gitechnolo.github.io/biotechproject/Tech_Maturity.html)   

---

## 🌐 Toegankelijkheid

De site is **in overeenstemming met de WCAG 2.1 Richtlijnen Niveau AA** voor alle hoofdpagina's.  
De conformiteit is geverifieerd via:

- Geautomatiseerde audits (Lighthouse, axe, WAVE)
- Handmatige tests met schermlezers (NVDA, VoiceOver)
- Volledige toetsenbordnavigatie (tab, shift+tab, enter, spatie, pijltjes)
- W3C-validatie van HTML-code
- Directe code-inspectie voor semantische structuur en correct gebruik van ARIA

Het project is **gedeeltelijk conform aan Niveau AAA**, met name voor:
- Kleurcontrast (het grootste deel van de tekst overschrijdt de verhouding 7:1)
- Hiërarchische titelstructuur
- Gebruik van beschrijvende alternatieve tekst

Echter, sommige AAA-criteria zijn niet van toepassing of niet vereist in de huidige context (bijv. ondertitels voor video's, uitgebreide eenvoudige taal).

📄 **Volledige verklaring:**  
👉 [Lees de Toegankelijkheidsverklaring (IT)](https://gitechnolo.github.io/biotechproject/accessibility-it.html)
👉 [Read Accessibility Statement (EN)](https://gitechnolo.github.io/biotechproject/accessibility-en.html)

---

## 🌍 Meertalig Beheer (i18n)

BiotechProject ondersteunt **meerdere talen** via een **modulair, lichtgewicht en toegankelijk** vertalingssysteem, ontworpen voor statische pagina's op GitHub Pages.

Het systeem zorgt voor:
- ✅ Realtime vertaling van inhoud
- ✅ Onthoudt de gekozen taal tussen pagina's (zoals Wikipedia of Google)
- ✅ Ondersteunt vereenvoudigde versies voor gebruikers met dyslexie
- ✅ Makkelijk uitbreidbaar door medewerkers

### 🧩 Systeemarchitectuur

- **Modulaire JSON-bestanden**: elke pagina heeft een eigen vertaalbestand in `lang/`
- **Common.json**: gedeelde teksten (menu, footer, taalknop)
- **Geen backend**: alles werkt met puur JavaScript
- **LocalStorage**: de gekozen taal wordt onthouden
- **data-lang-key**: HTML-attribuut om vertaalbare elementen te markeren

### 📁 Structuur van de `lang/` map
   lang/
├── common.json               → menu, footer, taalknop
├── home.json                 → index.html
├── progetti.json             → Progetti.html
├── staff.json                → Staff.html
├── marketing.json            → Marketing.html
├── tech_maturity.json        → Tech_Maturity.html
├── dermatologia.json         → Dermatologia.html en Dermatologia-semplice.html
├── cuore.json                → Cuore.html en Cuore-semplice.html
├── cellula.json              → Cellula.html en Cellula-semplice.html
├── apparato_digerente.json   → Apparato_digerente.html en -semplice.html
├── apparato_respiratorio.json → Apparato_respiratorio.html en -semplice.html
├── apparato_tegumentario.json → Apparato_tegumentario.html en -semplice.html
├── sistema_linfatico.json     → Sistema_linfatico.html en -semplice.html

---

## 💡 Wil je bijdragen?

Welkom!  
BiotechProject is een **open project voor iedereen**, in de geest van Wikipedia.

🔹 Om te beginnen:
- Lees de [**Contributing Guidelines**](CONTRIBUTING.md)
- Volg de [**Gedragscode**](CODE_OF_CONDUCT.md)

Je kunt helpen met:
- Nieuwe wetenschappelijke inhoud
- Technische of toegankelijkheidsverbeteringen
- Vertalingen
- Bugrapporten en suggesties

---

## 🛠️ Gebruikte technologieën
- Semantische HTML5
- CSS3 met Custom Properties
- Zuiver JavaScript (geen frameworks)
- ARIA 1.2 voor dynamische interacties
- GitHub Actions voor CI/CD
- Lighthouse voor prestatiebewaking

---

## 📄 Licentie

📄 Licentie: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)  
Je mag het project delen, wijzigen en gebruiken voor commerciële doeleinden, mits je de oorspronkelijke auteur vermeldt.

- **Inhoud (tekst, afbeeldingen, educatief materiaal)**: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- **Broncode**: [MIT-licentie](https://opensource.org/licenses/MIT)

"**Iedereen mag meehelpen. Respecteer gewoon de oorsprong en blijf zorgvuldig bouwen.**"

---

## 🙌 Auteur

Auteur: **Fabrizio** ([@Gitechnolo](https://github.com/Gitechnolo))  
Project beschikbaar op: [https://github.com/Gitechnolo/biotechproject](https://github.com/Gitechnolo/biotechproject)

---

## ✅ Geïmplementeerde toegankelijkheidsfuncties

Het project hanteert een **"toegankelijkheid vanaf het begin"**-aanpak (*accessibility by design*). Belangrijkste functies:

- **Volledige toetsenbordnavigatie**: alle functies zijn toegankelijk via toetsenbord, met een speciale knop voor geavanceerde focusmarkering.
- **Geavanceerde menusteun**: uitklapmenu's navigeerbaar met pijltjes, <kbd>Home</kbd>, <kbd>End</kbd> en <kbd>Esc</kbd>, met correcte focusbeheersing.
- **Schermlezercompatibiliteit**: semantische HTML-structuur, correct gebruik van `ARIA`, en dynamisch statusbeheer.
- **Voldoende contrast**: alle teksten voldoen aan minimaal 4.5:1 (normale tekst) en 3:1 voor UI-elementen (WCAG 1.4.3, 1.4.11).
- **Tekst herschaalbaar tot 200%**: zonder overlappingen (WCAG 1.4.4, 1.4.10).
- **Animatiebeheer**: automatisch uitgeschakeld bij `prefers-reduced-motion: reduce`, plus handmatige optie via “Comfort”-knop.
- **Ondersteuning hoge contrast**: past automatisch een donkerblauw thema toe bij `prefers-contrast: high` (WCAG 1.4.12, AAA-niveau).
- **Dynamisch visueel thema**: vijf kleurvarianten (Groen, Cyaan, Paars, Oranje, Donkerblauw) voor diverse visuele behoeften, inclusief soorten kleurenblindheid.
- **Vasthouden voorkeuren**: thema en toetsenbordstatus worden opgeslagen in `localStorage` en hersteld bij volgende bezoek.
- **Toegankelijke pop-ups**: modale vensters met correcte focusbeheersing, ondersteuning voor <kbd>Esc</kbd> en `role="dialog"` voor betere toegankelijkheid.
- **Veilige lazy loading**: afbeeldingen geladen met `IntersectionObserver`, fallback voor oude browsers, altijd aanwezige alternatieve tekst.
- **Toegankelijke klokken en tellers**: dynamisch bijgewerkt met `aria-live="polite"` voor schermlezers.
- **Robuust ontwerp**: geen externe frameworks. Zuiver JavaScript, modern maar achterwaarts compatibele CSS, semantische HTML.
- **Vereenvoudigde pagina's**: versies met duidelijke taal, korte zinnen en visuele ondersteuning voor gebruikers met dyslexie of cognitieve beperkingen (WCAG 3.1.5).
- **Toegankelijkheid visuele gegevens**: grafieken vergezeld van verborgen tabellen (`visually-hidden`) en gestructureerde alternatieve teksten.
- **Gegevensexport**: mogelijkheid om prestatie- en toegankelijkheidsgegevens te exporteren naar JSON of CSV voor transparante audits.
- **Automatische visuele comfortmodus (QRedshift)**: warmer kleurfilter 's avonds op basis van lokale tijd, handmatig uitschakelbaar.
- **Uitspraak- en begrijpsteun**: gebruik van `<ruby>`-tag voor definitie en uitspraak van complexe wetenschappelijke termen (WCAG 3.1.3, 3.1.5).
- **Toegankelijke video's**: geen automatisch afspelen, aangepaste besturing met `aria-label`, tekstuele beschrijvingen en toetsenbordnavigatie.

## 🚀 Naleving in uitvoering naar WCAG 2.1 Niveau AAA

We implementeren extra verbeteringen om dichter bij niveau **AAA** te komen:

- **Uitspraak van technische termen**: Uitbreiding van `<ruby>` met lettergrepen en IPA (bijv. "CRISPR", "epigenetica").
- **Uitleg van afkortingen**: Trapsgewijze implementatie van `<abbr title="...">` voor afkortingen zoals "PCR", "ATP", "DNA".
- **Koppelingen met beschrijvende tekst**: Voortdurende controle of elke koppeling ook buiten context begrijpelijk is (WCAG 2.4.9).
- **Migratie van pop-ups naar toegankelijke modals**: Vervanging van `window.open()` door interne modals met `role="dialog"`, focus-trapping en volledige toetsenbordondersteuning.

## ⚠️ Gedeeltelijke niet-naleving of uitzonderingen

Ondanks de inspanningen voldoen sommige onderdelen nog niet volledig aan alle WCAG-criteria:

- **Gebruik van `role="menu"` in dropdowns**: Momenteel gebruikt voor geavanceerd toetsenbordgedrag, maar technisch gereserveerd voor applicatiemenu’s. Overgang naar een semantisch eenvoudiger en compatibelere aanpak wordt beoordeeld.
- **Pop-ups gebaseerd op `window.open()`**: Sommige koppelingen openen externe vensters voor achterwaartse compatibiliteit met verouderde systemen. Migratie loopt naar toegankelijke interne modals.

## 💬 Feedback en meldingen

Jouw feedback is essentieel om de toegankelijkheid van het project te verbeteren.  
Als je belemmeringen ervaart of suggesties hebt, [neem dan contact met ons op](https://gitechnolo.github.io/biotechproject/accessibility-it.html#feedback) (sectie "Feedback en meldingen" van de verklaring).

## 📅 Datum van laatste controle
**8 september 2025**

## 🔮 Toekomstige updates

De verklaring wordt regelmatig bijgewerkt. De komende verbeteringen omvatten:

- Volledige migratie naar interne modals.
- Beoordeling van eenvoudigere ARIA-patronen voor menu’s, voor betere schermlezercompatibiliteit.
- Optimalisatie van contrast in nachtmodus (QRedshift) om een minimumverhouding van 4.5:1 te garanderen, zelfs met actief filter.
- Integratie van volledige transcripties en ondertitels voor alle toekomstige video’s.

## 🌱 Projectfilosofie

> *“BiotechProject is niet alleen wetenschap: het is inclusie. Elke coderegel is ontworpen om toegankelijk, veerkrachtig en menselijk te zijn.”*

Dit project is een praktisch voorbeeld van **verantwoord ontwikkelen**, waar technologie, ethiek en gebruiksvriendelijkheid samenkomen. Het is bedoeld om een inclusievere webcultuur te inspireren, waar toegankelijkheid geen toevoeging is, maar de basis.

---

📌 **Project**  
🔧 Technologieën: HTML5, CSS3, zuiver JavaScript, ARIA, W3C-standaarden  
🌍 Hosting: GitHub Pages  
📄 Licentie: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — Je mag het project delen, wijzigen en gebruiken voor commerciële doeleinden, mits je de oorspronkelijke auteur vermeldt.