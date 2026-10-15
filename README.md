# Tharindu Dhanushka — Portfolio

A responsive React + Vite portfolio prepared for GitHub Pages. Profile details, skills, project cards, social links, and creative gallery entries are maintained in one data file.

## Requirements

- Node.js 20 or later
- npm

## Run locally

```sh
npm install
npm run dev
```

Vite prints the local development URL. To check the production build locally:

```sh
npm run build
npm run preview
```

## Update portfolio content

Edit [`src/data/portfolio.js`](./src/data/portfolio.js) to change:

- Your name, introduction, email, and social links
- Skill categories
- Software project descriptions, technologies, status, screenshot paths, repository URLs, and demo URLs
- Creative portfolio titles, categories, and asset paths

Blank URLs are intentionally omitted or shown as setup reminders. Add only verified links and project details.

### Add project screenshots and creative work

Put optimized image files and video thumbnails in `public/assets/`. Reference these from `src/data/portfolio.js` using paths that start with `/assets/`, for example:

```js
image: `${import.meta.env.BASE_URL}assets/habit-forge.webp`
```

For creative work, set `asset` to the corresponding base-aware asset path. Keep images sized appropriately for the displayed area and prefer WebP or AVIF. Use a thumbnail for video cards and provide a playable video file as the `asset` when adding video.

## GitHub Pages deployment

The Vite base path is configured for the repository name `Portfolio-1`. The workflow at `.github/workflows/deploy.yml` builds and deploys on pushes to `main` or `master`, and can also be started manually.

1. Push the project to the `Portfolio-1` GitHub repository.
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. Check the **Actions** tab for a successful deployment. The site will be published at `https://tharindu-dhanushka.github.io/Portfolio-1/`.

No deploy token or external hosting service is required. If the repository is renamed, update `base` in `vite.config.js` and the home link in `public/404.html`.

## Information to personalize

Add your verified email address and social profile URLs in `src/data/portfolio.js`. Replace placeholder screenshots and gallery entries with your own work, and complete project repository/demo links and status details when ready.
