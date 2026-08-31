# Warehouse Management — Frontend

Single-page React application for a warehouse management system (WMS): master data,
goods receipt/issue documents, inventory and lot tracking, stocktaking, alerts and
management reports. The interface is in Vietnamese.

It is the client half of the system — it talks to a separate Spring Boot REST API
over `VITE_API_URL` and holds no business logic of its own beyond presentation,
formatting and export.

## Tech stack

| Concern        | Choice                                             |
| -------------- | -------------------------------------------------- |
| Framework      | React 19 + Vite 8                                  |
| Routing        | React Router 7 (`BrowserRouter`)                   |
| Styling        | Tailwind CSS 4 (via `@tailwindcss/vite`)           |
| State          | Zustand (auth only, persisted to `localStorage`)   |
| HTTP           | Axios with request/response interceptors           |
| Icons / toasts | lucide-react, react-hot-toast                      |
| Charts         | Hand-written SVG components (no charting library)  |
| Export         | In-house XLSX writer and print helper (no deps)    |

## Getting started

Requires Node.js 20+ and a running backend API.

```bash
npm install
```

Create a `.env` in the project root (it is git-ignored):

```bash
VITE_API_URL=http://localhost:8080/api
```

Then start the dev server:

```bash
npm run dev
```

### Scripts

| Script            | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Vite dev server with HMR                 |
| `npm run build`   | Production build into `dist/`            |
| `npm run preview` | Serve the production build locally       |
| `npm run lint`    | ESLint over the whole project            |

## Backend

The API lives in a **separate repository** (Spring Boot, package
`com.github.xnaut97.wms`). Start it before the frontend; without it every page
falls back to a "cannot reach the server" toast. Only `VITE_API_URL` connects the
two — there is no proxy configuration in `vite.config.js`.

## Project structure

```
src/
  api/          One module per backend resource, all sharing axiosClient
  components/   Feature-grouped UI (receipts, issues, inventory, reports, ...)
    common/     Reusable primitives: Button, Modal, Table toolbar, Pagination
    reports/    Report tables plus the hand-rolled SVG chart set
  hooks/        useReportData (fetch + filter state), useSort
  layouts/      AppLayout — sidebar + content shell
  pages/        Route-level screens, with reports/ for the report screens
  routes/       AppRouter, ProtectedRoute, GuestRoute
  store/        authStore (Zustand, persisted under "auth-storage")
  utils/        apiResponse unwrapping, excel export, print, roles, sidebar config
```

### API layer

Every module in `src/api/` imports the shared `axiosClient`, which:

- prefixes requests with `VITE_API_URL` and a 120s timeout;
- attaches `Authorization: Bearer <token>` from the auth store;
- toasts a single message when the server is unreachable;
- on a `401` for any request other than login, clears the session and redirects
  to `/login`.

Responses are unwrapped through `src/utils/apiResponse.js`, which tolerates both
bare payloads and the `{ success, data }` envelope, and pulls `content` /
`totalPages` out of paged results.

### Authentication

`POST /auth/login` returns a user and token, stored by `authStore` and persisted
to `localStorage`. `ProtectedRoute` gates every application route on the presence
of a token; `GuestRoute` keeps signed-in users off the login page. Role labels and
the assignable role list live in `src/utils/roles.js`.

## Features

- **Dashboard** — overview cards, inventory movement and value charts, low-stock
  and slow-moving lists, reorder suggestions, variance analysis, quick actions.
- **Master data** — users, customers, suppliers, materials, products, warehouses,
  and material BOMs (định mức nguyên vật liệu).
- **Operations** — combined receipts/issues screen for both materials and finished
  products, with document creation, line items, status badges and detail views.
- **Inventory** — stock by warehouse, lot-level detail, low-stock screen.
- **Stocktaking** — count sheets with editable cells, draft persistence, batch
  tables and export.
- **Alerts** — alert centre with severity badges and near-expiry lot tracking.
- **Reports** — inventory value, operations efficiency and BOM, stocktaking
  accuracy, receipt/issue/inventory/stocktaking records, and an audit log.

Report screens share `useReportData` for filters and fetching, `ReportFilters` for
the filter bar, and export to XLSX or print via `src/utils/excel.js` and
`src/utils/print.js` — both dependency-free, built in the browser.

## Deployment

`vercel.json` rewrites all paths to `/index.html` so client-side routing works on
Vercel. Set `VITE_API_URL` as an environment variable in the deployment target;
Vite inlines it at build time, so a change requires a rebuild.
