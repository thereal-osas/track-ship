# Track Ship Express - Real-Time Package Tracking System

A complete package tracking system with real-time updates, admin management, and WebSocket integration. Built with React, TypeScript, Node.js, Express, and PostgreSQL.

## Features

### 🚀 Core Features

- **Real-time package tracking** with WebSocket updates
- **Admin dashboard** with comprehensive management tools
- **Secure authentication** with JWT tokens
- **Responsive design** with modern UI components
- **Live location updates** simulation
- **Complete CRUD operations** for shipments, countries, and states

### 📦 User Features

- Track packages with tracking numbers
- Real-time location updates
- Shipment history timeline
- Interactive tracking form
- Mobile-responsive interface

### 🔧 Admin Features

- Secure admin login
- Manage shipments (create, update, delete)
- Update shipment status and location
- Manage countries and states
- Real-time dashboard statistics
- Add new tracking locations

## Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **WebSocket** for real-time updates
- **React Query** for state management

### Backend

- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** database
- **WebSocket** server for real-time updates
- **JWT** authentication
- **bcrypt** for password hashing
- **CORS** and security middleware

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/track-ship-express.git
cd track-ship-express
```

2. **Set up environment variables**

```bash
# In the backend directory
cp .env.example .env
# Edit .env with your database credentials

# In the frontend directory
cp .env.example .env
```

3. **Install dependencies**

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

4. **Set up the database**

```bash
# Create PostgreSQL database
createdb trackship

# Run database schema and seed
cd backend
npm run schema
npm run seed
```

5. **Start the development servers**

```bash
# Start backend server
cd backend
npm run dev

# In a new terminal, start frontend server
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:3001/api`.

## Admin Access

Use the following credentials to access the admin dashboard:

- **Email**: admin@example.com
- **Password**: admin123

## Sample Tracking Numbers

Use these sample tracking numbers to test the tracking functionality:

- TSE1234567890
- TSE9876543210

## Project Structure

```
.
├── backend/                # Backend API
│   ├── src/
│   │   ├── database/       # Database connection and models
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   ├── websocket.ts    # WebSocket server
│   │   └── index.ts        # Main entry point
│   └── package.json
│
└── frontend/               # React frontend
    ├── src/
    │   ├── components/     # React components
    │   ├── lib/            # Utilities and API client
    │   ├── pages/          # Page components
    │   └── App.tsx         # Main App component
    └── package.json
```

## License

MIT
