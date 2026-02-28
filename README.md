
# Limited Edition Sneaker Drop Client

A modern, real-time web application for reserving and purchasing limited edition sneakers. Built with React, Vite, Tailwind CSS, and Socket.IO, this project provides a seamless user experience for high-demand sneaker drops.

## Features

- **User Authentication**: Register and log in securely.
- **Live Sneaker Drops**: View available drops and real-time stock updates.
- **Reservation System**: Reserve sneakers for a limited time with live countdowns.
- **Checkout Flow**: Complete purchases or cancel reservations.
- **Real-Time Updates**: Socket.IO integration for instant stock and feed changes.
- **Responsive UI**: Styled with Tailwind CSS for a modern look.
- **Notifications**: Toast notifications for actions and errors.

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Socket.IO Client](https://socket.io/)
- [Axios](https://axios-http.com/)
- [React Router](https://reactrouter.com/)
- [react-hot-toast](https://react-hot-toast.com/)

## Folder Structure

```
├── public/
├── src/
│   ├── api/                # Axios instance
│   ├── components/         # UI components (Navbar, DropCard, etc.)
│   ├── context/            # Auth and Reservation providers/contexts
│   ├── pages/              # Page components (Dashboard, Login, etc.)
│   ├── socket/             # Socket.IO client setup
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Tailwind CSS import
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1. **Clone the repository:**
	```sh
	git clone <repo-url>
	cd limited-edition-sneaker-drop-client
	```
2. **Install dependencies:**
	```sh
	npm install
	# or
	yarn install
	```
3. **Set up environment variables:**
	- Create a `.env` file in the root with:
	  ```env
	  VITE_API_URL=http://localhost:8000/api
	  VITE_SOCKET_URL=http://localhost:8000
	  ```
	- Adjust URLs as needed for your backend.

4. **Run the development server:**
	```sh
	npm run dev
	# or
	yarn dev
	```

5. **Open the app:**
	Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Lint the codebase

## Environment Variables
- `VITE_API_URL` — Backend API base URL
- `VITE_SOCKET_URL` — Socket.IO server URL

## Notes
- This project uses **JavaScript** (not TypeScript).
- Make sure your backend supports the required endpoints and Socket.IO events.
- For UI customization, edit Tailwind config and component styles.

## License
MIT
