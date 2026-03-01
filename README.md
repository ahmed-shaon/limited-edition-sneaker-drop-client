# 👟 Sneaker Drop — Frontend

React frontend for the Limited Edition Sneaker Drop system. Displays live inventory, handles reservations with a 60-second countdown, and updates all connected clients in real-time via Socket.io.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React (Vite) |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Real-time | Socket.io Client |
| Routing | React Router DOM |
| Notifications | react-hot-toast |

---

## Project Structure

```
client/
├── src/
│   ├── api/
│   │   └── axios.js               # Axios instance with JWT interceptor
│   ├── context/
│   │   ├── AuthContext.js         # Auth context + useAuth hook
│   │   ├── AuthProvider.jsx       # Auth provider component
│   │   ├── ReservationContext.js  # Reservation context + useReservation hook
│   │   └── ReservationProvider.jsx
│   ├── components/
│   │   ├── Navbar.jsx             # Top navigation bar
│   │   ├── DropCard.jsx           # Individual drop card with reserve button
│   │   ├── ProtectedRoute.jsx     # Auth guard for protected pages
│   │   └── ReservationBanner.jsx  # Persistent countdown banner
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx      # Main live drops feed
│   │   └── CheckoutPage.jsx       # Complete purchase page
│   ├── socket/
│   │   └── socket.js              # Socket.io client singleton
│   ├── App.jsx                    # Routes setup
│   └── main.jsx
├── .env.example
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm
- Backend server running at `http://localhost:8000`

---

### 1. Install Dependencies

```bash
cd client
npm install
```

---

### 2. Environment Variables

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:8000/api
VITE_SOCKET_URL=http://localhost:8000
```

---

### 3. Start the Frontend

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## Pages

### Dashboard `/dashboard` — Public
- Displays all active drops in a responsive grid
- Live stock count updates instantly via `stock:updated` socket event
- New drops appear automatically via `drop:activated` socket event
- Ended drops disappear automatically via `drop:ended` socket event
- Top 3 recent purchasers shown on each card, updates via `feed:updated`
- Unauthenticated users can view but must log in to reserve

### Login `/login` — Public
- Email + password login
- Redirects to dashboard on success

### Register `/register` — Public
- Username + email + password registration
- Returns JWT token immediately — no separate login needed

### Checkout `/checkout` — Protected
- Shows reserved drop details
- Live 60-second countdown timer
- Turns red and urgent under 15 seconds
- Complete Purchase button
- Cancel Reservation button
- Shows order confirmation on successful purchase
- Redirects to dashboard if no active reservation

---

## Toast Notifications

| Trigger | Toast |
|---|---|
| New drop goes live | 🔥 "New drop is live: {name}" |
| Drop ends | 🏁 "A drop has ended" |
| Reservation expires (timer) | ⏰ "Your reservation has expired" |
| Reservation cancelled (drop ended) | 🏁 "The drop has ended. Your reservation has been cancelled" |
| Reservation cancelled manually | 🗑️ "Reservation cancelled successfully" |
| Purchase completed | 👟 "Purchase completed! You got them!" |
| Item out of stock on reserve | 😢 "Sorry, this item just sold out!" |

---

## Socket Events (Client-side)

| Event | Handler Location | Action |
|---|---|---|
| `drop:activated` | `DashboardPage` | Prepend new drop to list |
| `drop:ended` | `DashboardPage` | Remove drop from list |
| `stock:updated` | `DashboardPage` | Update `availableStock` on matching card |
| `feed:updated` | `DashboardPage` | Update `recentPurchasers` on matching card |
| `reservation:expired` | `ReservationContext` | Clear reservation state + show toast |

---

## Route Protection

| Route | Access |
|---|---|
| `/dashboard` | Public — anyone can view drops |
| `/login` | Public |
| `/register` | Public |
| `/checkout` | Protected — requires login |
| Reserve button | Requires login — redirects to `/login` if not authenticated |