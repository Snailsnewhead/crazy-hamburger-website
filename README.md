# Code Escape Room

Interactive coding challenge application for learning JavaScript fundamentals.

## Features

- 4 coding challenges (Addition, Sorting, Prime Numbers, String Reversal)
- Real-time code execution and validation
- Timer and progress tracking
- Save results to database
- Dark theme UI

## Setup

### Prerequisites
- Node.js 18+
- Docker (for PostgreSQL)

### Installation

```bash
# Clone repository
git clone https://github.com/Snailsnewhead/crazy-hamburger-website.git
cd crazy-hamburger-website

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Start Database

```bash
docker run --name escape-room-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=escaperoom -p 5432:5432 -d postgres:15
```

### Initialize Database

```bash
cd backend
npx prisma db push
cd ..
```

### Run Application

Open 3 terminals:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

Access app at `http://localhost:3000`

## Testing

```bash
cd backend
npm test
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/attempts` - Save results
- `GET /api/attempts` - Get results

## Project Structure

```
├── src/app/escape-room/page.tsx    (Frontend)
├── backend/
│   ├── server.js                   (API)
│   ├── prisma/schema.prisma        (Database)
│   └── __tests__/challenges.test.js (Tests)
└── README.md
```

## Author

Tan Dung Nguyen
