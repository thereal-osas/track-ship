# Track Ship Express - Real-Time Package Tracking System

A complete package tracking system with real-time updates, admin management, and WebSocket integration. Built with React, TypeScript, Node.js, Express, and SQLite.

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
- **SQLite** database
- **WebSocket** server for real-time updates
- **JWT** authentication
- **bcrypt** for password hashing
- **CORS** and security middleware

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**

```bash
npm install
```

2. **Set up environment variables**

```bash
cp .env.example .env
```

3. **Initialize the database with sample data**

```bash
npm run seed
```

4. **Start the development servers**

```bash
npm run dev
```

This will start the frontend development server at `http://localhost:5173`

## Backend Setup

The backend API is in a separate repository/folder. To run the complete system:

1. **Set up the backend** (in a separate terminal/folder):

```bash
cd ../track-ship-backend
npm install
npm run seed
npm run dev
```

2. **Start the frontend** (in this folder):

```bash
npm run dev
```

The backend API will run on `http://localhost:3001` and WebSocket on `ws://localhost:3001/ws`

## Usage

### For Users

1. Visit `http://localhost:8080`
2. Enter a tracking number (try: `DHL1234567890`)
3. View real-time tracking information
4. Watch for live location updates

### For Admins

1. Go to `http://localhost:5173/admin/login`
2. Login with:
   - Email: `admin@dhlexpress.com`
   - Password: `admin123`
3. Access the admin dashboard to:
   - Manage shipments
   - Add/edit countries and states
   - Update shipment statuses
   - View system statistics

## Project Structure

This is the **frontend** part of the Track Ship Express system. The backend API is separate.

```
src/
├── components/        # React components
│   ├── admin/        # Admin-specific components
│   ├── layout/       # Layout components (Header, Footer)
│   ├── tracking/     # Tracking-related components
│   └── ui/           # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/              # Utilities and API client
├── pages/            # Page components
└── assets/           # Static assets
```

## Environment Variables

Create a `.env` file in the root directory:

```bash
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001/ws
```

- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b3ccf2d3-4136-46b2-8e7d-3b2b8694d305) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
