# Tarunraj Kalyanasundaram — Space Portfolio

**Live site:** [tarunnn65.github.io/portfolio-website](https://tarunnn65.github.io/portfolio-website)

A cinematic, scroll-driven personal portfolio rendered entirely on an HTML5 Canvas — no build tools, no frameworks, just Vanilla JS, CSS, and a black hole.

---

## ✦ Features

| Feature | Details |
|---|---|
| **Galaxy Renderer** | Spiral galaxy with 4 arms, painterly nebula glow, accretion disc, and live shooting-star showers — all on `<canvas>` |
| **Flying Node System** | Section nodes animate from galaxy spiral positions to a right-side nav list driven by `IntersectionObserver` + `requestAnimationFrame` |
| **Black Hole** | Clickable black hole with an animated accretion ring; scrolling past it triggers the About Me node fly-out with a ballistic arc |
| **Scroll-Driven Sections** | Each section fades in and activates its node as it enters the viewport |
| **Interactive Terminal Demo** | In-browser terminal that simulates the C Multi-Process Pipeline Engine — faithfully re-implements all 7 plugins (`upper`, `lower`, `reverse`, `number`, `sort`, `filter`, `count`) in JavaScript |
| **Working Contact Form** | EmailJS integration sends messages directly to Gmail — no backend required |
| **GitHub Actions Deployment** | Pushes to `main` automatically deploy to GitHub Pages via the bundled workflow |

---

## ✦ Tech Stack

| Layer | Technology |
|---|---|
| Structure | Semantic HTML5 |
| Rendering | HTML5 Canvas API (`2d` context) |
| Logic | Vanilla ES Modules (no bundler) |
| Styling | Vanilla CSS with CSS custom properties |
| Fonts | Playfair Display (Google Fonts) × system monospace |
| Email | [EmailJS](https://www.emailjs.com/) (client-side, no server) |
| Deployment | GitHub Actions → GitHub Pages |

---

## ✦ Project Structure

```
space-portfolio/
├── index.html             # Single-page entry point + terminal modal HTML
├── css/
│   └── style.css          # All styles (layout, nodes, sections, terminal, contact)
├── js/
│   ├── data.js            # Content data — projects, experience, skills, education
│   ├── app.js             # Galaxy renderer, node animation, section builder
│   └── terminal.js        # Pipeline engine terminal simulator
└── .github/
    └── workflows/
        └── static.yml     # GitHub Pages deploy workflow
```

---

## ✦ Content Sections

| # | Section | Description |
|---|---|---|
| 00 | About Me | Bio pulled from `data.js` |
| 01 | Projects | 5 technical projects (Interactive Portfolio, Pipeline Engine, Order Matching Engine, Columns Assembly, Quantum Bomb Tester, Predictive Analytics Chatbot) |
| 02 | Experience | EV Team Embedded Engineer & Race Driver · Astrophysics Researcher (Drake Equation) |
| 03 | Skills | Languages, Systems, Scientific ML, Embedded & Hardware, Concepts |
| 04 | Education | UofT CSC + Astrophysics + Math Minor · Awards |
| 05 | Contact | EmailJS form + direct contact details |

---

## ✦ Running Locally

No build step required — just serve the files:

```bash
# Python 3
python3 -m http.server 8080

# Node.js
npx serve .
```

Then open `http://localhost:8080`.

---

## ✦ Pipeline Engine Terminal

The Projects section has an interactive terminal demo for the [Multi-Process Pipeline Engine](https://github.com/tarunnn65/pipeline-engine-project). The simulator re-implements all 7 C plugins in JavaScript and supports:

```bash
# Pipe through multiple plugins
./pipeline planets.txt upper sort

# Pipe from stdin
echo "Hello World" | ./pipeline - lower reverse

# Text transformations
./pipeline quotes.txt filter:star count
```

---

## ✦ Contact Form Setup

The contact form uses [EmailJS](https://www.emailjs.com/). Credentials live in `js/app.js`. To update them, replace the three constants at the top of the form handler:

```js
const EMAILJS_PUBLIC_KEY  = 'your_public_key';
const EMAILJS_SERVICE_ID  = 'your_service_id';
const EMAILJS_TEMPLATE_ID = 'your_template_id';
```

Your EmailJS template should use these variables: `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}`.

---

## ✦ Deployment

Every push to `main` triggers the GitHub Actions workflow (`.github/workflows/static.yml`), which deploys the repository root to GitHub Pages automatically.

---

*Built by [Tarunraj Kalyanasundaram](https://linkedin.com/in/tarunkalyan) · CS & Astrophysics Specialist @ University of Toronto*
