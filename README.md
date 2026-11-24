# masaohta0423.github.io

Masahiro Ohta's personal research portfolio.

## Structure

- `index.html` — homepage markup
- `style.css` — site-wide styles
- `papers/papers.js` — projects, publications, awards, and conference data
- `body-sublimation/` and `roombot/` — project pages
- `images/` — profile image, favicon, and project thumbnails

The site is plain HTML, CSS, and JavaScript and is served directly by GitHub Pages.

## Build

The homepage lists are authored in `papers/papers.js`, and the Body Sublimation page is authored in `body-sublimation/index.md`. After editing either, regenerate the published HTML with:

```sh
npm run build
```

`body-sublimation/index.html` and the homepage list sections between build markers are generated output and should not be edited directly. Commit the generated HTML alongside the source changes for GitHub Pages.

## Search indexing

Submit `https://masaohta0423.github.io/sitemap.xml` in Google Search Console, then request indexing for the homepage and `/body-sublimation/`.
