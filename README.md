# 🍕 FoodRush — Online Food Ordering & Delivery System

Full-stack food ordering application built with **FastAPI** (backend) + **React** (frontend).

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+

---

## Backend Setup

```bash
cd backend

# 1. Create virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Copy environment file
cp .env.example .env
# (Edit .env to add Stripe keys if needed)

# 4. Start server
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000
API Docs (Swagger): http://localhost:8000/docs

### Demo Credentials (auto-seeded)
| Role  | Email                | Password  |
|-------|----------------------|-----------|
| Admin | admin@foodapp.com    | admin123  |
| User  | user@foodapp.com     | user123   |

---

## Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env
# VITE_API_URL=http://localhost:8000

# 3. Start dev server
npm run dev
```

Frontend runs at: http://localhost:5173

---

## Features

- ✅ JWT Authentication (Register / Login / Protected routes)
- ✅ Restaurant listing with search & cuisine filter
- ✅ Menu browsing per restaurant with categories
- ✅ Cart system (add, update qty, remove, clear)
- ✅ Order placement with promo codes (SAVE10, WELCOME20, FLAT50)
- ✅ Order tracking with visual step timeline
- ✅ Auto-polling for order status updates
- ✅ Payment integration (Stripe test mode + demo confirm)
- ✅ Reviews & ratings system
- ✅ Admin dashboard (manage restaurants, menus, orders)
- ✅ Responsive design

---

## API Endpoints

| Method | Endpoint                        | Auth     | Description               |
|--------|---------------------------------|----------|---------------------------|
| POST   | /auth/register                  | Public   | Register user             |
| POST   | /auth/login                     | Public   | Login user                |
| GET    | /auth/me                        | User     | Get current user          |
| GET    | /restaurants                    | Public   | List restaurants          |
| POST   | /restaurants                    | Admin    | Create restaurant         |
| GET    | /restaurants/{id}               | Public   | Get restaurant            |
| GET    | /restaurants/{id}/menu          | Public   | Get menu                  |
| POST   | /menu-items                     | Admin    | Create menu item          |
| GET    | /cart                           | User     | Get cart                  |
| POST   | /cart/add                       | User     | Add to cart               |
| DELETE | /cart/remove/{id}               | User     | Remove from cart          |
| POST   | /orders                         | User     | Place order               |
| GET    | /orders                         | User     | My orders                 |
| GET    | /orders/{id}                    | User     | Order detail              |
| PATCH  | /orders/{id}/status             | Admin    | Update order status       |
| POST   | /payments/create-session/{id}   | User     | Create Stripe session     |
| POST   | /payments/confirm/{id}          | User     | Confirm payment (demo)    |
| POST   | /reviews                        | User     | Post review               |
| GET    | /reviews/restaurant/{id}        | Public   | List reviews              |

---

## Stripe Test Mode

1. Get keys from https://dashboard.stripe.com/test/apikeys
2. Add to `backend/.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
3. Use test card: `4242 4242 4242 4242` | Any future date | Any CVC

> Without Stripe keys, clicking "Pay Now" uses demo mode — payment is auto-confirmed.

---

## Promo Codes

| Code      | Discount         |
|-----------|------------------|
| SAVE10    | 10% off          |
| WELCOME20 | 20% off          |
| FLAT50    | ₹50 flat off     |

---

## Project Structure

```
food-ordering/
├── backend/
│   ├── main.py                  # FastAPI app + seed data
│   ├── requirements.txt
│   └── app/
│       ├── core/                # config, database, security
│       ├── models/              # SQLAlchemy models
│       ├── routers/             # API route handlers
│       └── schemas/             # Pydantic schemas
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx              # Routes
│       ├── context/             # Auth + Cart context
│       ├── services/api.js      # Axios API calls
│       └── pages/               # All pages
└── README.md
```
