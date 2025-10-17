# Profile API with Cat Facts

A simple RESTful API that returns my profile information along with dynamic cat facts fetched from an external API. Built with Node.js, Express, and TypeScript.

## 🚀 Features

- **GET /me** endpoint that returns profile information
- Dynamic cat facts from [Cat Facts API](https://catfact.ninja/fact)
- Real-time UTC timestamps in ISO 8601 format
- Graceful error handling with fallback responses
- CORS enabled for cross-origin requests
- TypeScript for type safety

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Praiz001/hng_stage0
cd stage_0
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Cat Facts API Configuration
CAT_FACT_API_URL=https://catfact.ninja/fact
TIMEOUT=5000

# CORS Configuration (optional)
CORS_ORIGIN=http://localhost:3000
```

### 4. Build the Project (Optional)
```bash
npm run build
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```
This will start the server with hot reload using nodemon.

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:4000` (or the PORT specified in your .env file).

## 📡 API Endpoints

### GET /me
Returns profile information with a random cat fact.

**Request:**
```bash
curl http://localhost:4000/me
```

**Response:**
```json
{
  "status": "success",
  "user": {
    "email": "oshilimpraisek@gmail.com",
    "name": "Praise Oshilim",
    "stack": "Node.js/Express"
  },
  "timestamp": "2025-01-27T10:30:45.123Z",
  "fact": "Cats have a third eyelid called a haw to protect their eyes."
}
```

## 📦 Dependencies

### Production Dependencies
- **express** (^5.1.0) - Web framework for Node.js
- **axios** (^1.12.2) - HTTP client for API requests
- **cors** (^2.8.5) - Cross-Origin Resource Sharing middleware
- **dotenv** (^17.2.3) - Environment variable loader
- **knex** (^3.1.0) - SQL query builder
- **pg** (^8.16.3) - PostgreSQL client

### Development Dependencies
- **typescript** (^5.9.3) - TypeScript compiler
- **ts-node** (^10.9.2) - TypeScript execution for Node.js
- **nodemon** (^3.1.10) - Development server with auto-restart
- **@types/express** (^5.0.3) - TypeScript definitions for Express
- **@types/cors** (^2.8.19) - TypeScript definitions for CORS
- **@types/node** (^24.8.0) - TypeScript definitions for Node.js

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run migrate` - Run database migrations

## 🌐 CORS Configuration

CORS is configured to allow requests from:
- `*` (default)
- Custom origin via `CORS_ORIGIN` environment variable

## 🧪 Testing the API

You can test the API using:

**curl:**
```bash
curl -X GET http://localhost:4000/me
```

**Postman:**
- Method: GET
- URL: `http://localhost:4000/me`
- Headers: `Content-Type: application/json`

## 📝 Notes

- The timestamp updates dynamically with each request
- A new cat fact is fetched on every request (no caching)
- The API gracefully handles external API failures
- All responses follow a consistent JSON structure


---