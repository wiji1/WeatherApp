# Weather App

A full-stack weather application with user authentication, favorites management, and real-time weather data. Built with React, TypeScript, Node.js, Express, and MySQL.

## Features

- **Weather Search**: Search for weather by city name or coordinates
- **User Authentication**: Register, login, and secure session management
- **Favorites Management**: Save and manage favorite locations
- **Real-time Weather Data**: Current weather conditions powered by OpenWeatherMap API
- **Responsive Design**: Mobile-friendly interface built with React and Tailwind CSS
- **Type Safety**: Full TypeScript implementation across frontend and backend

## Technology Stack

### Frontend
- **React 19** with TypeScript
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Vite** for build tooling

### Backend
- **Node.js** with **Express**
- **TypeScript** for type safety
- **MySQL** for data persistence
- **JWT** for authentication
- **Zod** for input validation
- **bcrypt** for password hashing

## Prerequisites

- Node.js 18+ and npm
- MySQL 8.0+
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))
- Docker and Docker Compose (for containerized setup)

## Local Development Setup

### Option 1: Standard npm Setup

#### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd weather-app
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

#### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE weather_app;
```

The application will automatically create the required tables on first run.

#### 3. Environment Configuration

Create `backend/.env` file:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=weather_app

# API Keys
OPENWEATHER_API_KEY=your_openweather_api_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Server Configuration
NODE_ENV=development
PORT=3001
```

#### 4. Start Development Servers

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start individually:
npm run dev:backend  # Backend only (http://localhost:3001)
npm run dev:frontend # Frontend only (http://localhost:3000)
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Option 2: Docker Compose Setup

#### 1. Environment Configuration

Create `backend/.env` file with your configuration (see above).

#### 2. Start with Docker Compose

```bash
docker-compose up --build
```

This will:
- Build and start both frontend and backend containers
- Frontend will be available at http://localhost:3000
- Backend API will be available at http://localhost:3001
- Automatically handle container networking

#### 3. Stop Services

```bash
docker-compose down
```

## API Documentation

### Base URL
- Local: `http://localhost:3001`
- Production: `https://your-backend-url`

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Authentication Endpoints

**POST /auth/register**
- Register a new user account
- Body: `{ email: string, password: string, name: string }`
- Returns: `{ user: UserData, token: string }`

**POST /auth/login**
- Authenticate user
- Body: `{ email: string, password: string }`
- Returns: `{ user: UserData, token: string }`

**GET /auth/me**
- Get current user information
- Requires: Authentication
- Returns: `{ user: UserData }`

#### Weather Endpoints

**GET /weather?city={cityName}**
- Get weather by city name
- Query: `city` (required)
- Returns: Weather data with location info

**GET /weather/coordinates?lat={lat}&lon={lon}**
- Get weather by coordinates
- Query: `lat` and `lon` (required)
- Returns: Weather data with location info

**GET /weather/search?query={searchTerm}&limit={number}**
- Search for cities
- Query: `query` (required, min 2 chars), `limit` (optional, 1-10, default 5)
- Returns: Array of city objects with coordinates

#### Favorites Endpoints

**GET /favorites**
- Get user's favorite locations with current weather
- Requires: Authentication
- Returns: Array of favorites with weather data

**POST /favorites**
- Add location to favorites
- Requires: Authentication
- Body: `{ cityName: string, country: string, state?: string, latitude: number, longitude: number }`
- Returns: Created favorite with weather data

**DELETE /favorites/{favoriteId}**
- Remove location from favorites
- Requires: Authentication
- Returns: Success message

**GET /favorites/check?lat={lat}&lon={lon}**
- Check if location is in favorites
- Requires: Authentication
- Query: `lat` and `lon` (required)
- Returns: `{ isFavorite: boolean }`

### Response Format

All API responses follow this structure:

```typescript
{
  success?: boolean;
  data?: any;          // Response data
  error?: string;      // Error message if applicable
}
```

## Deployment

The project includes automated deployment to Google Cloud Run.

### Prerequisites

1. Google Cloud Project with billing enabled
2. Google Cloud CLI installed and authenticated
3. Required APIs enabled (Cloud Build, Cloud Run, Container Registry)

### Environment Setup

1. Create `backend/.env` with production values (copy from `backend/.env.example`):

```bash
# Database Configuration (Cloud SQL or external MySQL)
DB_HOST=your_production_db_host
DB_PORT=3306
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=weather_app

# API Keys
OPENWEATHER_API_KEY=your_openweather_api_key

# JWT Configuration
JWT_SECRET=your_production_jwt_secret

# Server Configuration
NODE_ENV=production

# Google Cloud Deployment Configuration
PROJECT_ID=your-google-cloud-project-id
REGION=us-central1
```

### Deploy to Google Cloud Run

1. Configure your deployment settings in `backend/.env`:
   - Set `PROJECT_ID` to your Google Cloud project ID
   - Set `REGION` to your preferred region (defaults to `us-central1`)

2. Run the deployment script:

```bash
chmod +x deploy.sh
./deploy.sh
```

Alternatively, you can override environment variables at runtime:

```bash
PROJECT_ID=my-project-id REGION=us-west1 ./deploy.sh
```

The deployment script will:
- Build and push Docker images to Google Container Registry
- Deploy backend service to Cloud Run
- Deploy frontend service to Cloud Run with backend URL
- Configure environment variables and scaling settings
- Return the deployed URLs

### Manual Deployment Configuration

You can also deploy manually using the provided Cloud Run configuration files:

- `cloudrun-backend.yaml` - Backend service configuration
- `cloudrun-frontend.yaml` - Frontend service configuration

Update the placeholders in these files and deploy using:

```bash
gcloud run services replace cloudrun-backend.yaml
gcloud run services replace cloudrun-frontend.yaml
```

## Project Structure

```
weather-app/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── api/            # API endpoints
│   │   │   ├── auth/       # Authentication endpoints
│   │   │   ├── favorites/  # Favorites management
│   │   │   ├── weather/    # Weather data endpoints
│   │   │   └── types.ts    # API type definitions
│   │   ├── controllers/    # Business logic controllers
│   │   ├── database/       # Database connection and setup
│   │   ├── models/         # Data models and interfaces
│   │   ├── services/       # Business logic services
│   │   └── index.ts        # Application entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store and slices
│   │   └── App.tsx         # Main app component
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # Local development setup
├── deploy.sh              # Deployment script
└── README.md              # This file
```

## Development Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run dev:backend` - Start backend only
- `npm run dev:frontend` - Start frontend only

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

### Backend Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DB_HOST` | Yes | MySQL database host | `localhost` |
| `DB_PORT` | Yes | MySQL database port | `3306` |
| `DB_USER` | Yes | MySQL username | `root` |
| `DB_PASSWORD` | Yes | MySQL password | `password` |
| `DB_NAME` | Yes | MySQL database name | `weather_app` |
| `OPENWEATHER_API_KEY` | Yes | OpenWeatherMap API key | `your_api_key` |
| `JWT_SECRET` | Yes | JWT signing secret | `your_secret_key` |
| `NODE_ENV` | No | Environment mode | `development` |
| `PORT` | No | Server port | `3001` |
| `PROJECT_ID` | No* | Google Cloud project ID | `my-project-123` |
| `REGION` | No | Google Cloud region | `us-central1` |

*Required for deployment

### Frontend Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | No | Backend API URL | `http://localhost:3001` |


## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please open an issue in the repository.