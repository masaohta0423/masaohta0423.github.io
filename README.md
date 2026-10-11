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

The Body Sublimation page is authored in `body-sublimation/index.md`. After editing it, regenerate the published HTML with:

```sh
npm run build
```

`body-sublimation/index.html` is generated output and should not be edited directly.
