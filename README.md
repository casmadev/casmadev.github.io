# casmadev.github.io

Personal resumé / portfolio site served by GitHub Pages at the root address
**https://casmadev.github.io/**.

Plain HTML + CSS + vanilla JS — no build step, in the same spirit as the
[CasmaBoard](https://github.com/casmadev/board) and
[CasmaPlanner](https://github.com/casmadev/planner) landing pages it borrows
its look from.

## Editing content

- **Timeline & skills** live as plain data at the top of [`app.js`](app.js)
  (`TIMELINE` and `SKILLS`). Bars use `{ start, span }` 1-based column
  indices, just like CasmaPlanner unit indices.
- **Everything else** (hero copy, project cards, contact info) is directly in
  [`index.html`](index.html).

## Local preview

Any static server works:

```sh
npx serve .
```

## Deploying

GitHub Pages for a `<user>.github.io` repo serves the default branch root, so
pushing to `main` is the deploy. The `.nojekyll` file disables Jekyll
processing.
