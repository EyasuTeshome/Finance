# Personal Finance App

A self-hosted, privacy-first alternative to Monarch Money / YNAB. All data stays in your own Neon Postgres database. No bank credentials or open-banking integrations — accounts and balances are managed manually, and transactions come from CSV import or manual entry.

---

## Stack

| Layer    | Tech                                   |
|----------|-----------------------------------------|
| Backend  | Node.js 20 + Express, hosted on Render |
| Database | PostgreSQL (Neon)                      |
| Frontend | React 18 + Tailwind CSS + Recharts, hosted on Vercel |

---

## Quick start

### 1. Database (Neon)

Create a free project at https://neon.tech, copy the connection string (looks like `postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require`).

### 2. Backend (Render)

Deploy `backend/` as a Web Service on Render (uses `backend/render.yaml`). Set these env vars in the Render dashboard:

- `DATABASE_URL` — your Neon connection string
- `FRONTEND_URL` / `CORS_ORIGIN` — your Vercel app URL

There is no login — this app is intended for personal, single-user self-hosting. Anyone with the URL can access it, so don't expose it publicly without your own access controls (e.g. a VPN, or basic auth at a reverse-proxy level) if that matters to you.

### 3. Frontend (Vercel)

Deploy `frontend/` as a Vercel project. Set `VITE_API_URL` to `https://<your-render-app>.onrender.com/api` in the Vercel dashboard.

---

## Managing accounts & transactions

1. Go to **Settings** → add one or more accounts (name, currency, starting balance).
2. On the **Transactions** page, either:
   - **Import CSV** — upload a bank export (columns like `Date`/`Amount`/`Description`/`Merchant` are auto-detected), or
   - **Add transaction** — enter a single transaction by hand.
3. Update an account's balance any time from **Settings → Edit**.
4. Subscriptions are auto-detected from recurring transactions after each import/add.

---

## Features

| Feature              | Description |
|----------------------|-------------|
| Dashboard            | Balance, income/spending, budget rings, upcoming payments |
| Transactions         | Full history, search, filter, re-categorise, CSV import, manual entry |
| Budgets              | Monthly limits, optional rollover, progress rings, alerts at 80%/100% |
| Charts & Insights    | Monthly bar chart, category donut, 6-month trend |
| Subscriptions        | Auto-detected from transactions + manual, monthly total, upcoming alerts |
| Goals                | Target + deadline + progress bar |
| Net Worth            | Assets/liabilities, historical trend chart |
| Accounts             | Manual accounts with editable balances |
| CSV import           | Generic bank CSV format |
| Auto-categorisation  | Rule-based merchant name matching |

---

## Project structure

```
.
├── backend/
│   ├── src/
│   │   ├── server.js          # Express app
│   │   ├── db/                # Postgres connection + schema migrations
│   │   ├── routes/            # accounts, transactions, budgets, goals,
│   │   │                      # networth, subscriptions, insights
│   │   └── services/          # categorise, subscriptions
│   └── render.yaml
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Router
│   │   ├── components/        # Card, Modal, Sidebar, ProgressRing, EmptyState
│   │   ├── pages/             # Dashboard, Transactions, Budgets, Charts,
│   │   │                      # Subscriptions, Goals, NetWorth, Settings
│   │   └── services/api.js    # Axios client
│   └── vercel.json
├── .env.example
└── README.md
```
