# FindIt AI - Static Site

This repository contains a static marketing/site for FindIt AI.

What's included:

- `index.html`, `about.html`, `features.html`, `contact.html`
- `styles.css` and `script.js`
- Images and assets in the project root

## Goal
Prepare the project for deployment to GitHub Pages and the web.

## Local preview
You can preview the site locally with a simple static server. If you have Python installed:

```bash
# Python 3
python3 -m http.server 8000
# Then open http://localhost:8000
```

Or with Node.js (http-server):

```bash
npm install -g http-server
http-server -c-1
```

## Deploying to GitHub Pages (automatic)
1. Create a repository on GitHub and push this code to the `main` branch.
2. The repository contains a GitHub Actions workflow (`.github/workflows/deploy.yml`) that will build and publish the `main` branch to GitHub Pages using the `gh-pages` branch.

If you prefer user/organization pages (repo named `<username>.github.io`) set the Pages source in repository settings to `gh-pages`.

## Manual deploy (optional)
You can also use `gh-pages` npm package or GitHub UI to publish.

### Recommended repository setup checklist

- Push this project to GitHub under a new repository (e.g., `findit-ai-site`).
- Ensure your default branch is `main` (or update the workflow if you use a different branch name).
- In your repository's Settings > Pages, confirm the site is served from the `gh-pages` branch after the first successful workflow run.
- (Optional) Add a `CNAME` file at the repo root containing your custom domain and configure DNS (CNAME to <username>.github.io).


## Notes
- I renamed screenshot files to URL-safe names and updated `index.html` accordingly.
- The contact form currently only shows an alert (no backend). Replace with a server or third-party form provider to receive messages.

## Next steps (optional)
- Add a `CNAME` file if using a custom domain.
- Add analytics or link previews for social sharing.
