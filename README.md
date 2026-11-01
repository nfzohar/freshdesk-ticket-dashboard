# Freshdesk Ticket Dashboard

A simple customizable ticket statistics dashboard for Freshdesk V2 API.
Designed to work with the "Growth" freshdesk plan.

## ⚠️ Security warning

This app is a pure client-side SPA: it calls the Freshdesk API directly from the
browser and has no backend of its own. That has two consequences you should be
aware of before deploying it anywhere other your own machine:

- **The Freshdesk API key is exposed to anyone who can load the page.** If you set
  `VITE_FRESHDESK_API_KEY` in `.env`, Vite bakes it into the public JS bundle at
  build time. Anyone viewing the deployed site's source or network tab gets full
  API access to your Freshdesk account. Only set this env var on deployments you
  fully trust (e.g. an internal TV/kiosk display, or `localhost`), and prefer
  having each viewer log in with their own API key via the in-app wizard instead.
- **`VITE_ACCESS_CONTROL_USERNAME`/`PASSWORD` are not real authentication.** They
  are also bundled into the client-visible JS, so they're trivially bypassed by
  reading the bundle or by calling the auth store from devtools. Treat this as a
  casual speed bump, not access control, and don't rely on it to gate sensitive
  data.

If you need real protection for the API key or for who can view the dashboard,
put a thin backend/proxy in front of the Freshdesk API instead of calling it
directly from the browser.

## What it includes

- [Vue 3](https://vuejs.org/guide/introduction.html)
- [Typescript](https://www.typescriptlang.org/docs/)
- [Vite](https://vitejs.dev/guide/)
- [Pinia](https://pinia.vuejs.org/introduction.html)
- [Axios](https://axios-http.com/docs/intro)
- [Lodash](https://lodash.com/docs/4.17.15)
- [Date-fns](https://date-fns.org/docs/Getting-Started)
- [Chart.js](https://www.chartjs.org/)
- [Vue Chartjs](https://vue-chartjs.org/)
- [Tailwindcss](https://tailwindcss.com/docs/installation)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Postcss](https://postcss.org/)
- [Postcss-cli](https://www.npmjs.com/package/postcss-cli?activeTab=versions)
- [Postcss-env-function](https://www.npmjs.com/package/postcss-env-function)
- [Vue Toastification](https://vue-toastification.maronato.dev/)
- [Write Excel File](https://www.npmjs.com/package/write-excel-file)

## Project Setup

```sh
yarn / npm install
```

### Compile and Hot-Reload for Development

```sh
yarn dev / npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
yarn build / npm run build
```
