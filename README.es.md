<div align="center">
  <img src="BiotechProjectBanner.png" alt="BiotechProject Banner" width="100%" />
</div>

# BiotechProject 🧬 🇪🇸

🌐 **Leer en otros idiomas:**  
[Italiano 🇮🇹](README.it.md) | 
[English 🇬🇧](README.md) | 
[Español 🇪🇸](README.es.md) | 
[Français 🇫🇷](README.fr.md) | 
[Deutsch 🇩🇪](README.de.md) | 
[Dutch 🇳🇱](README.nl.md) |
[Português (BR) 🇧🇷](README.pt-br.md)

> 🌍 *"No todos hablamos el mismo idioma, pero sí hablamos el mismo lenguaje: la colaboración."*  
> El inglés no es una barrera, es un puente.  
> 🔹 Para contribuir o revisar las normas del proyecto, visite los archivos principales en inglés:  
> - [Guía de contribución](CONTRIBUTING.md)  
> - [Código de conducta](CODE_OF_CONDUCT.md)  
> Usar inglés favorece la colaboración internacional.

**Un proyecto de código abierto que une ciencia, salud y tecnología web.**  
Donde la biotecnología se encuentra con la programación para crear herramientas digitales para la investigación y la innovación.

[![License](https://img.shields.io/github/license/Gitechnolo/biotechproject)](https://github.com/Gitechnolo/biotechproject/blob/main/LICENSE-MIT.md)
[![Workflow Status](https://github.com/Gitechnolo/biotechproject/actions/workflows/performance.yml/badge.svg)](https://github.com/Gitechnolo/biotechproject/actions/workflows/performance.yml)
[![Last Commit](https://img.shields.io/github/last-commit/Gitechnolo/biotechproject?color=blue)](https://github.com/Gitechnolo/biotechproject/commits)

---

## 🌱 Qué es BiotechProject?

BiotechProject es un **laboratorio digital abierto** que combina **biotecnología, salud y desarrollo web** en un sistema integrado diseñado para ser:

- 🔍 **Científicamente fiable**
- 💻 **Técnicamente robusto**
- 🌐 **Accesible para todos**, incluyendo usuarios con discapacidad
- 🤝 **Abierto a la colaboración global**

Fue creado para mostrar cómo la tecnología puede servir a la ciencia y la salud, garantizando al mismo tiempo un acceso equitativo para todos — independientemente de sus capacidades sensoriales, cognitivas o motoras.

Es un espacio colaborativo para desarrolladores, investigadores y entusiastas que desean explorar **cómo la web puede convertirse en una herramienta de inclusión e innovación científica**.

---

## 🚀 Características principales

✅ **Abierto por diseño**  
→ Abierto a contribuciones, ideas y colaboración internacional

✅ **Flujo de trabajo CI/CD integrado**  
→ Pruebas, análisis y actualizaciones automáticas en cada cambio

✅ **Panel de rendimiento automatizado**  
→ Análisis continuo de todas las páginas con actualizaciones en `performance-data.json`

✅ **Filtro dinámico por categoría**  
→ Interfaz interactiva para explorar el estado de madurez tecnológica

✅ **Diseño responsivo y accesible**  
→ Funciona en todos los dispositivos, con fuerte enfoque en usabilidad y cumplimiento de WCAG

---

## 📊 Monitorización de la Calidad Técnica

El proyecto incluye un sistema automatizado para monitorear la calidad técnica de sus páginas, con actualizaciones diarias mediante GitHub Actions.  
Desde septiembre de 2025, se ha implementado un **sistema avanzado de seguimiento de la madurez tecnológica**, que combina datos reales y proyecciones para visualizar la evolución general del proyecto.

### Funcionalidades del panel
- ✅ **Puntuación de rendimiento** (0–100) por página
- ✅ **Tiempo de carga** y estado de optimización
- ✅ **Nivel de madurez**: `optimized`, `compatible`, `needs-improvement`, `deprecated`
- 📈 **Gráfico de evolución** (datos históricos + proyección hasta el 100%)
- 💾 **Exportación de datos** en JSON/CSV para análisis externos
- 🕒 Datos actualizados cada 24 horas (o manualmente con "Actualizar ahora")

📊 El sistema muestra tanto el **estado actual del proyecto** como una **proyección realista hacia la finalización del ciclo de desarrollo** (prevista para febrero de 2026), basada en mejoras reales (por ejemplo: accesibilidad, UX, rendimiento).

👉 Accede al panel en tiempo real: [Tech_Maturity.html](https://gitechnolo.github.io/biotechproject/Tech_Maturity.html)   

---

## 🌐 Accesibilidad

El sitio es **conforme con las Directrices WCAG 2.1 Nivel AA** para todas las páginas principales.  
La conformidad ha sido verificada mediante:

- Auditorías automatizadas (Lighthouse, axe, WAVE)
- Pruebas manuales con lectores de pantalla (NVDA, VoiceOver)
- Navegación completa con teclado (tabulador, mayús+tab, intro, espacio, flechas)
- Validación del código HTML según W3C
- Inspección directa del código para estructura semántica y uso correcto de ARIA

El proyecto es **parcialmente conforme con el Nivel AAA**, especialmente en:
- Contraste de color (la mayoría del texto supera la relación 7:1)
- Estructura jerárquica de encabezados
- Uso de textos alternativos descriptivos

Sin embargo, algunos criterios AAA no son aplicables o no son necesarios en el contexto actual (p. ej. subtítulos para vídeos, lenguaje sencillo extendido). 

📄 **Declaración completa de accesibilidad:**  
👉 [Leer Declaración de Accesibilidad (EN)](https://gitechnolo.github.io/biotechproject/accessibility-en.html)  
👉 [Leggi la Dichiarazione di Accessibilità (IT)](https://gitechnolo.github.io/biotechproject/accessibility-it.html)   


## Accesibilidad y Estudio de Caso

Estamos comprometidos a construir una plataforma inclusiva. Descubre cómo implementamos la conformidad con WCAG 2.1 AA y el soporte multilingüe:

[![Estudio de caso - Construir una plataforma biotecnológica accesible](https://img.shields.io/badge/Case%20Study-BiotechProject%20Accesibilidad-brightgreen?logo=github&labelColor=222)](biotechproject-case-study.md)   



## 🌍 Gestión multilingüe (i18n)

BiotechProject soporta **múltiples idiomas** mediante un sistema de traducción **modular, ligero y accesible**, diseñado para funcionar en páginas estáticas alojadas en GitHub Pages.

El sistema permite:
- ✅ Traducir contenidos en tiempo real  
- ✅ Recordar el idioma seleccionado entre páginas (como Wikipedia o Google)  
- ✅ Soportar versiones simplificadas para usuarios con dislexia  
- ✅ Ser fácilmente ampliado por colaboradores  

### 🧩 Arquitectura del sistema

- **Archivos JSON modulares**: cada página tiene su propio archivo de traducción en `lang/`  
- **Common.json**: contiene textos compartidos (menú, pie de página, botón de idioma)  
- **Sin backend**: todo funciona con JavaScript puro  
- **LocalStorage**: el idioma seleccionado se guarda automáticamente  
- **`data-lang-key`**: atributo HTML para identificar elementos traducibles  

### 📁 Estructura de la carpeta `lang/`

| Página (.html) | Archivo de traducción (.json) | Nota |
|---|---:|---|
| index.html | lang/home.json | Inicio |
| Progetti.html | lang/progetti.json | Proyectos |
| Staff.html | lang/staff.json | Equipo |
| Marketing.html | lang/marketing.json | Marketing |
| Tech_Maturity.html | lang/tech_maturity.json | Panel de rendimiento |
| Dermatologia.html / -semplice | lang/dermatologia.json | Versión principal + simplificada |
| Cuore.html / -semplice | lang/cuore.json | Principal + simplificada |
| Cellula.html / -semplice | lang/cellula.json | Principal + simplificada |
| Apparato_digerente.html / -semplice | lang/apparato_digerente.json | Principal + simplificada |
| Apparato_respiratorio.html / -semplice | lang/apparato_respiratorio.json | Principal + simplificada |
| Apparato_tegumentario.html / -semplice | lang/apparato_tegumentario.json | Principal + simplificada |
| Sistema_linfatico.html / -semplice | lang/sistema_linfatico.json | Principal + simplificada |
| Capelli.html / -semplice | lang/capelli.json | Nuevas páginas incluidas en el monitoreo |
| Cadenas compartidas | lang/common.json | Menú, pie, textos comunes |


## 📅 Fecha de la última verificación
**8 de noviembre de 2025**

## 🔮 Actualizaciones recientes (resumen)

Puntos clave:

- Panel de rendimiento: datos Lighthouse integrados y visualizados en Tech_Maturity.html.
- Exportación: descarga de datos en JSON/CSV desde la dashboard.
- Gráficos accesibles: Chart.js con tablas alternativas para usuarios no visuales.
- Optimización: lazy-loading, carga diferida de scripts pesados, Canvas optimizado y limpieza.
- UX y preferencias: tema dinámico, preferencias persistentes, navegación por teclado y ARIA mejorados.
- CI/CD y transparencia: ejecuciones automáticas de Lighthouse, datos públicos para auditorías.

Hemos introducido varias mejoras técnicas y de accesibilidad al proyecto. Las principales novedades incluyen:

- Dashboard de rendimiento ampliado:
  - Integración completa de los datos de Lighthouse en `data/performance-latest.json`.
  - Visualización agregada de métricas en Tech_Maturity.html (gráfico, lista de páginas, puntuaciones).
  - Posibilidad de actualizar manualmente el dashboard y exportar los datos en JSON/CSV desde el botón "Exportar datos".

- Mejoras gráficas y de experiencia de usuario:
  - Gráficos dinámicos con Chart.js para el seguimiento del rendimiento.
  - Indicador de carga (spinner) y optimizaciones para móviles y dispositivos con recursos limitados.
  
- Rendimiento y ahorro de recursos:
  - Partículas optimizadas: reducción de la tasa de fotogramas para CPU/GPU menos potentes y limpieza mediante destroy().
  - Lazy-loading avanzado para imágenes con IntersectionObserver.
  - Reducción de la carga inicial de JavaScript y carga diferida de scripts pesados.

- Accesibilidad mejorada:
  - Navegación completa por teclado, gestión del foco y mejoras ARIA en los menús.
  - Sistema modular de traducción no bloqueante.
  - Funcionalidad de pronunciación (texto a voz) para términos técnicos.
  - Tablas alternativas/descriptivas para gráficos (para usuarios no visuales).
  - Soporte para preferencias del usuario persistentes (tema, navegación por teclado, QRedshift) mediante localStorage.

- Herramientas CI/CD y monitoreo:
  - La canalización genera automáticamente los datos de rendimiento mediante Lighthouse y guarda los resultados en `data/performance-latest.json`.
  - Disponible un script (generate-performance.js) para rellenar `performance-data.json` / `performance-latest.json`.   


## 💡 Quiere contribuir?

¡Es bienvenido!  
BiotechProject es un **proyecto abierto para todos**, inspirado en el espíritu colaborativo de Wikipedia.

🔹 Para comenzar:
- Lea las [**Guías de contribución**](CONTRIBUTING.md)
- Siga el [**Código de conducta**](CODE_OF_CONDUCT.md)

Puede ayudar en:
- Contenido científico
- Mejoras técnicas o de accesibilidad
- Traducciones
- Informes de errores y sugerencias

Cada contribución — grande o pequeña — ayuda a hacer que la ciencia sea más accesible.

---

## 🛠️ Tecnologías utilizadas
- HTML5 semántico
- CSS3 con propiedades personalizadas
- JavaScript puro (sin frameworks)
- ARIA 1.2 para interacciones dinámicas
- GitHub Actions para CI/CD
- Lighthouse para monitoreo de rendimiento

---

## 📄 Licencia

📄 Licencia: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)  
Puede compartir, adaptar y usar el proyecto con fines comerciales, siempre que **se dé el crédito adecuado**.

---

## 🙌 Autor

Autor: **Fabrizio** ([@Gitechnolo](https://github.com/Gitechnolo))  
Proyecto disponible en: [https://github.com/Gitechnolo/biotechproject](https://github.com/Gitechnolo/biotechproject)

> "Cualquiera puede contribuir. Solo respete el origen y siga construyendo con cuidado."