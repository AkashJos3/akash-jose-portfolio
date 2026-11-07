# Akash Jose — Personal Portfolio

A responsive portfolio showcasing my software projects, education, technical skills and engineering interests.

**GitHub Pages URL (after deployment):** https://akashjos3.github.io/akash-jose-portfolio/

**Existing hosted website:** https://akash-jose-portfolio.leafyanole8.chatgpt.site

## About

I’m a Computer Science undergraduate at St. Joseph’s College of Engineering and Technology, Palai, working toward a career in software engineering. My interests include backend development, REST APIs, databases and AI-powered applications.

## Projects

- **[Expense Tracker API](https://github.com/AkashJos3/expense-tracker-api)** — Java / Spring Boot API with authenticated, user-scoped expense management, filtering and PostgreSQL persistence.
- **[AI Study Assistant](https://github.com/AkashJos3/ai-study-assistant)** — PDF-based learning application using FastAPI, ChromaDB, Gemini and retrieval-augmented generation.
- **[AfterBell](https://github.com/AkashJos3/job_finder)** — Student job platform with React, Flask, Supabase and separate student, employer and administrator workflows.

## Features

- Responsive profile, background, education, skills and project sections
- Individual engineering breakdown pages with category filtering
- Light and dark themes with saved preferences
- Resume download and professional contact links
- Keyboard-accessible navigation and reduced-motion support
- Contact form that prepares an email draft; nothing is sent automatically

## Stack

Plain HTML, CSS and JavaScript. A small Python generator produces the five HTML pages. No npm dependencies, backend, API keys or environment variables are required.

## Run locally

With Python 3 installed, run from the repository root:

```sh
python -m http.server 5180 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:5180/ in your browser.

## Customize and verify

Edit personal content and page templates in `generate.py`, then regenerate:

```sh
python generate.py
python verify.py
```

Edit `dist/style.css` for styles, `dist/app.js` for interactions and `dist/theme.js` for initial theme selection. The generator preserves these files.

Optional JavaScript syntax checks, when Node.js is available:

```sh
node --check dist/app.js
node --check dist/theme.js
```

## Structure

```text
dist/
  index.html
  style.css
  app.js
  theme.js
  assets/             # Portrait, resume, favicon and licensed font
  notes/              # Breakdown index and three project pages
generate.py           # Content and HTML templates
verify.py             # Local link, asset and HTML checks
```

## Hosting

GitHub Pages publishes `dist/` using `.github/workflows/deploy-pages.yml`. Enable **Settings → Pages → Source → GitHub Actions**, then run **Deploy portfolio to GitHub Pages** from the Actions tab. Subsequent pushes to `main` generate, check and deploy the site automatically.

The workflow runs `python3 generate.py`, `python3 verify.py` and JavaScript syntax checks before uploading `dist/`. It needs no repository secrets, npm install or custom domain. GitHub supplies the short-lived deployment token.

Edit content in `generate.py`; edit presentation and interactions in `dist/style.css`, `dist/app.js` and `dist/theme.js`. Avoid editing generated HTML alone because the next workflow run regenerates it.

The existing Sites deployment is separate and is not updated by this workflow. If moving to a custom domain later, update the absolute social-preview image URL in `generate.py`.

## Contact

- Email: [akash.jose.it@gmail.com](mailto:akash.jose.it@gmail.com)
- GitHub: [AkashJos3](https://github.com/AkashJos3)
- LinkedIn: [Akash Jose](https://linkedin.com/in/akash-jose-231954295)

The contact buttons navigate to the contact section. Visitors can create a draft, open it in their email application and send it themselves. No external form service or analytics is configured.

## Credits and assets

The layout was inspired by [Akash Balasubramaniyam’s portfolio](https://akashblsbrmnm.in/) and implemented independently for Akash Jose. The source does not include that site's personal content or assets.

Inter Display Bold is distributed under the SIL Open Font License; see `dist/assets/Inter-LICENSE.txt`. The portrait and resume are personal assets. The supplied resume is preserved unchanged; its email and AfterBell framework wording differ from the preferred website email and repository-verified project description.
