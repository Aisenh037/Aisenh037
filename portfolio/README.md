# Portfolio Site

A fast, build-free portfolio for Karan Choudhary. Edit the content in `index.html` and `projects.json`.

## Local preview

- Using Python 3:
  ```sh
  cd /workspace/portfolio
  python3 -m http.server 8000
  # open http://localhost:8000
  ```
- Or with Node (if available):
  ```sh
  cd /workspace/portfolio
  npx serve -n .
  ```

## Customize content

- Update name, tagline, and contact in `index.html`.
- Add or edit projects in `projects.json`:
  ```json
  {"title":"My App","description":"What it does","tech":["React","Node"],"links":{"repo":"https://github.com/...","demo":"https://..."}}
  ```
- Replace assets in `assets/` (e.g., `avatar.svg`, `resume.pdf`, `og-image.png`).

## Deploy to GitHub Pages

1. Create a repo and push this folder as the root or `docs/` of your repo.
2. If root: enable Pages from the `main` branch `/ (root)`.
3. If `docs/`: enable Pages from the `main` branch `/docs`.
4. Your site will be available at `https://<username>.github.io/<repo>/`.

## Accessibility & performance

- Accessible color contrast and focus styles
- Responsive layout (mobile-friendly)
- No frameworks, minimal JS, works offline after first load (static assets)