<div align="center">
  <img src="BiotechProjectBanner.png" alt="BiotechProject Banner" width="100%" />
</div>

# BiotechProject 🧬 🇫🇷

🌐 **Lire dans d'autres langues :**  
[Italiano 🇮🇹](README.it.md) | 
[English 🇬🇧](README.md) | 
[Español 🇪🇸](README.es.md) | 
[Français 🇫🇷](README.fr.md) | 
[Deutsch 🇩🇪](README.de.md) | 
[Dutch 🇳🇱](README.nl.md) |
[Português (BR) 🇧🇷](README.pt-br.md)

> 🌍 *"Nous ne parlons pas tous la même langue, mais nous parlons la même langue : la collaboration."*  
> L'anglais n'est pas une barrière, c'est un pont.  
> 🔹 Pour contribuer ou consulter les directives du projet, rendez-vous sur les fichiers principaux en anglais :  
> - [Guide de contribution](CONTRIBUTING.md)  
> - [Code de conduite](CODE_OF_CONDUCT.md)  
> Utiliser l'anglais favorise la collaboration internationale.

**Un projet open source qui unit science, santé et technologie web.**  
Où la biotechnologie rencontre le code pour créer des outils numériques au service de la recherche et de l'innovation.

![License](https://img.shields.io/github/license/Gitechnolo/biotechproject)
![Statut du workflow](https://github.com/Gitechnolo/biotechproject/actions/workflows/performance.yml/badge.svg)
![Dernier commit](https://img.shields.io/github/last-commit/Gitechnolo/biotechproject?color=blue)

---

## 🌱 Qu'est-ce que BiotechProject ?

BiotechProject est un **laboratoire numérique ouvert** qui associe **biotechnologie, santé et développement web** en un système intégré conçu pour être :

- 🔍 **Scientifiquement fiable**
- 💻 **Techniquement robuste**
- 🌐 **Accessible à tous**, y compris les utilisateurs en situation de handicap
- 🤝 **Ouvert à la collaboration mondiale**

Il a été créé pour montrer comment la technologie peut servir la science et la santé tout en garantissant un accès équitable pour tous — indépendamment des capacités sensorielles, cognitives ou motrices.

C'est un espace collaboratif pour les développeurs, chercheurs et passionnés qui souhaitent explorer **comment le web peut devenir un outil d'inclusion et d'innovation scientifique**.

---

## 🚀 Fonctionnalités principales

✅ **Ouvert par conception**  
→ Ouvert aux contributions, idées et collaborations internationales

✅ **Intégration continue / Déploiement continu (CI/CD)**  
→ Tests, analyses et mises à jour automatiques à chaque modification

✅ **Tableau de bord des performances automatisé**  
→ Analyse continue de toutes les pages avec mise à jour de `performance-data.json`

✅ **Filtre dynamique par catégorie**  
→ Interface interactive pour explorer le niveau de maturité technologique

✅ **Conception responsive et accessible**  
→ Fonctionne sur tous les appareils, avec un fort accent sur l'ergonomie et la conformité WCAG

---

## 📊 Suivi de la Qualité Technique

Le projet inclut un système automatisé de surveillance de la qualité technique des pages, mis à jour quotidiennement via GitHub Actions.  
Depuis septembre 2025, un **système avancé de suivi de la maturité technologique** a été mis en place, combinant données réelles et prévisions pour visualiser l'évolution globale du projet.

### Fonctionnalités du tableau de bord
- ✅ **Score de performance** (0–100) par page
- ✅ **Temps de chargement** et statut d'optimisation
- ✅ **Niveau de maturité** : `optimized`, `compatible`, `needs-improvement`, `deprecated`
- 📈 **Courbe d'évolution** (données historiques + prévision jusqu'à 100 %)
- 💾 **Exportation des données** en JSON/CSV pour analyse externe
- 🕒 Mise à jour toutes les 24 heures (ou manuellement via « Actualiser »)

📊 Le système affiche à la fois **l'état actuel du projet** et une **projection réaliste vers l'achèvement du cycle de développement** (prévu pour février 2026), basée sur des améliorations concrètes (ex. : accessibilité, expérience utilisateur, performances).

👉 Accéder au tableau de bord en temps réel : [Tech_Maturity.html](https://gitechnolo.github.io/biotechproject/Tech_Maturity.html)   

---

## 🌐 Accessibilité

Le site est **conforme aux lignes directrices WCAG 2.1 niveau AA** pour toutes les pages principales.  
La conformité a été vérifiée à l’aide de :

- Audits automatisés (Lighthouse, axe, WAVE)
- Tests manuels avec lecteurs d’écran (NVDA, VoiceOver)
- Navigation complète au clavier (tabulation, maj+tabulation, entrée, espace, flèches)
- Validation du code HTML selon les standards W3C
- Vérification directe du code pour la structure sémantique et l’utilisation correcte de ARIA

Le projet est **partiellement conforme au niveau AAA**, notamment pour :
- Le contraste des couleurs (la majorité du texte dépasse le ratio 7:1)
- La structure hiérarchique des titres
- L’utilisation de textes alternatifs descriptifs

Cependant, certains critères AAA ne sont pas applicables ou requis dans le contexte actuel (ex. sous-titres pour vidéos, langage simple étendu). 

📄 **Déclaration d’accessibilité complète :**  
👉 [Lire la Déclaration d’accessibilité (EN)](https://gitechnolo.github.io/biotechproject/accessibility-en.html)  
👉 [Leggi la Dichiarazione di Accessibilità (IT)](https://gitechnolo.github.io/biotechproject/accessibility-it.html)   


## 🌍 Gestion multilingue (i18n)

BiotechProject prend en charge **plusieurs langues** grâce à un système de traduction **modulaire, léger et accessible**, conçu pour fonctionner sur des pages statiques hébergées sur GitHub Pages.

Le système permet de :
- ✅ Traduire les contenus en temps réel  
- ✅ Mémoriser la langue choisie entre les pages (comme Wikipedia ou Google)  
- ✅ Prendre en charge des versions simplifiées pour les utilisateurs dyslexiques  
- ✅ Être facilement étendu par les contributeurs  

### 🧩 Architecture du système

- **Fichiers JSON modulaires** : chaque page a son propre fichier de traduction dans `lang/`  
- **Common.json** : contient les textes partagés (menu, pied de page, bouton langue)  
- **Aucun backend** : tout fonctionne en JavaScript pur  
- **LocalStorage** : la langue sélectionnée est mémorisée  
- **`data-lang-key`** : attribut HTML pour identifier les éléments traduisibles  

### 📁 Structure du dossier `lang/`
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


## 💡 Vous souhaitez contribuer ?

Vous êtes le bienvenu !  
BiotechProject est un **projet ouvert à tous**, inspiré de l’esprit collaboratif de Wikipedia.

🔹 Pour commencer :
- Lisez les [**Instructions de contribution**](CONTRIBUTING.md)
- Respectez le [**Code de conduite**](CODE_OF_CONDUCT.md)

Vous pouvez aider :
- Sur le contenu scientifique
- Sur les améliorations techniques ou d’accessibilité
- Par des traductions
- En signalant des bogues ou en proposant des idées

Chaque contribution — petite ou grande — aide à rendre la science plus accessible.

---

## 🛠️ Technologies utilisées
- HTML5 sémantique
- CSS3 avec propriétés personnalisées
- JavaScript natif (aucun framework)
- ARIA 1.2 pour les interactions dynamiques
- GitHub Actions pour l’automatisation (CI/CD)
- Lighthouse pour le suivi des performances

---

## 📄 Licence

📄 Licence : [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)  
Vous êtes libre de partager, adapter et utiliser ce projet à des fins commerciales, à condition de **donner un crédit approprié**.

---

## 🙌 Auteur

Auteur : **Fabrizio** ([@Gitechnolo](https://github.com/Gitechnolo))  
Projet disponible à l’adresse : [https://github.com/Gitechnolo/biotechproject](https://github.com/Gitechnolo/biotechproject)

> « Tout le monde peut contribuer. Il suffit de respecter l’origine et de continuer à construire avec soin. »