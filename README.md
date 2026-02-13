# Monday.com Google Drive Embedded App

A full-stack Monday.com embedded app template with proper session token validation. This project demonstrates how to build a Monday.com app with React frontend and Node.js/Express backend, including secure authentication using Monday.com session tokens.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Session Token Validation](#session-token-validation)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Frontend (React + TypeScript)
- ✅ **Monday.com SDK Integration** - Fetches session token from Monday.com context
- ✅ **TypeScript** - Type-safe React application
- ✅ **Vite** - Fast build tool and dev server
- ✅ **React Router** - Client-side routing
- ✅ **Automatic Token Injection** - Session token automatically added to all API requests

### Backend (Node.js + Express)
- ✅ **Session Token Validation** - JWT verification using Monday.com client secret
- ✅ **Automatic API Protection** - All API routes (except health check) require valid session token
- ✅ **Request Logging** - Comprehensive logging system with file-based logs
- ✅ **CORS Configuration** - Properly configured for cross-origin requests
- ✅ **Error Handling** - Graceful error handling with appropriate HTTP status codes
- ✅ **Health Check Endpoint** - Unprotected endpoint for monitoring

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v7 or higher) or **yarn**
- **Monday.com App** - You need to create an app in Monday.com and get:
  - App ID
  - Client Secret (for token verification)

## 📁 Project Structure

```
Monday.com-Google-Drive-Embedded/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── apiController/  # API client functions
│   │   ├── components/     # React components
│   │   ├── mondayServices/ # Monday.com SDK integration
│   │   └── App.tsx         # Main app component
│   ├── index.html          # HTML entry point
│   └── package.json
│
├── server/                 # Backend Express application
│   ├── apiContoller/       # API route controllers
│   ├── Authentication/     # Session validation middleware
│   ├── Logger/            # Logging utilities
│   ├── services/          # Business logic services
│   ├── index.js           # Express server entry point
│   └── package.json
│
└── README.md
```

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Monday.com-Google-Drive-Embedded
```

### Step 2: Install node Dependencies in Project

```bash
npm run install:all
```

**Note:** You may need to install `jsonwebtoken` package if it's not already installed:

```bash
npm install jsonwebtoken
```

## ⚙️ Configuration

### Step 1: Create Environment Files

#### Backend Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
BASE_PATH=/api

# Monday.com App Configuration
MONDAY_CLIENT_SECRET=your_monday_client_secret_here
# OR use MONDAY_SIGNING_SECRET (fallback)
# MONDAY_SIGNING_SECRET=your_monday_signing_secret_here
```

**Important:** 
- Get your `MONDAY_CLIENT_SECRET` from your Monday.com app settings
- This secret is used to verify JWT session tokens
- Never commit this file to version control

#### Frontend Environment Variables (Optional)

Create a `.env` file in the `client/` directory if you need to override defaults:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_BASE_PATH=/api
VITE_CLIENT_PORT=5173
```

### Step 2: Configure Monday.com App

1. Go to [Monday.com Developers](https://developer.monday.com/)
2. Create a new app or use an existing one
3. Get your **Client Secret** from the app settings
4. Add the Client Secret to your `server/.env` file
5. Configure your app's iframe URL to point to your frontend (e.g., `http://localhost:5173/googledrive`)

## 🏃 Running the Project

### Step 1: Start the Backend Server

Open a terminal and navigate to the server directory:

```bash
cd server
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

You should see:
```
Server started successfully on port 3000
```

### Step 2: Start the Frontend Development Server

Open a **new terminal** and navigate to the client directory:

```bash
cd client
npm run dev
```

The frontend will start on `http://localhost:5173` (or the port specified in your config).

You should see:
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/googledrive
```

### Step 3: Access the Application

1. **For Development/Testing:**
   - Open `http://localhost:5173/googledrive` in your browser
   - Note: Session token will only be available when running within Monday.com's iframe

2. **For Production:**
   - Deploy your frontend to a hosting service (Vercel, Netlify, etc.)
   - Deploy your backend to a hosting service (Heroku, AWS, etc.)
   - Update your Monday.com app settings with the production URLs
   - Access the app through Monday.com

## 🔌 API Endpoints

### Health Check (No Authentication Required)

```
GET /api/health
```

**Response:**
```json
{
  "status": "Healthy",
  "message": "Server is healthy",
  "timestamp": "2026-02-13T18:00:00.000Z",
  "uptime": 12345,
  "environment": "development",
  "port": 3000
}
```

### Hello World (Authentication Required)

```
GET /api/hello-world
```

**Headers Required:**
```
X-Monday-Session-Token: <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Hello World!"
}
```

**Error Responses:**

- `401 Unauthorized` - Missing session token
- `403 Forbidden` - Invalid or expired session token
- `500 Internal Server Error` - Server error

## 🔐 Session Token Validation

### How It Works

1. **Frontend:**
   - The app uses Monday.com SDK to fetch the session token
   - Token is automatically added to all API requests in the `X-Monday-Session-Token` header
   - Located in: `client/src/mondayServices/getMondaySessionToken.ts`

2. **Backend:**
   - All API routes (except `/api/health`) are protected by `validateMondaySession` middleware
   - Middleware validates the JWT token using Monday.com's client secret
   - If valid, user information is attached to `req.mondayUser`
   - If invalid, request is rejected with appropriate error

### Validation Flow

```
Client Request
    ↓
[validateMondaySession Middleware]
    ↓
Check for X-Monday-Session-Token header
    ↓
Verify JWT using MONDAY_CLIENT_SECRET
    ↓
Valid? → Attach user info to req.mondayUser → Continue to route handler
Invalid? → Return 401/403 error → Block request
```

### Accessing User Information

In your route controllers, you can access the validated user information:

```javascript
const getHelloWorldController = async (req, res) => {
  // User information is available after validation
  const userId = req.mondayUser.user_id;
  const accountId = req.mondayUser.account_id;
  const isAdmin = req.mondayUser.is_admin;
  
  // Your controller logic here
};
```

## 🐛 Troubleshooting

### Issue: "Monday.com context is not available"

**Cause:** The app is not running within Monday.com's iframe.

**Solution:**
- Make sure you're accessing the app through Monday.com
- For local testing, you may need to use a tunnel service (ngrok) and configure it in Monday.com app settings

### Issue: "Invalid Monday session token: invalid signature"

**Cause:** The `MONDAY_CLIENT_SECRET` doesn't match the secret used to sign the token.

**Solutions:**
1. Verify you're using the correct **Client Secret** (not Signing Secret)
2. Check that the secret in your `.env` file matches the one in Monday.com app settings
3. Ensure there are no extra spaces or characters in the `.env` file

### Issue: "Missing monday session token"

**Cause:** The token is not being sent from the frontend.

**Solutions:**
1. Check browser console for errors
2. Verify Monday.com SDK is loaded (check `index.html`)
3. Ensure the app is running within Monday.com's iframe context

### Issue: Port Already in Use

**Cause:** Another process is using the port.

**Solutions:**
1. Change the port in your `.env` file
2. Kill the process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:3000 | xargs kill
   ```

### Issue: Module Not Found Errors

**Cause:** Dependencies are not installed.

**Solution:**
```bash
# In server directory
npm install

# In client directory
npm install
```

## 📝 Adding New API Endpoints

To add a new protected API endpoint:

1. **Create Controller** in `server/apiContoller/controller.js`:
```javascript
const { Logger } = require("../Logger/logger");

const myNewController = async (req, res) => {
  try {
    // Access validated user info
    const userId = req.mondayUser.user_id;
    
    // Your logic here
    Logger.info(req, "New endpoint called");
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    Logger.error(req, `Error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = { myNewController };
```

2. **Add Route** in `server/index.js`:
```javascript
const { myNewController } = require("./apiContoller/controller");

// Add after the hello-world route
app.get(`${basePath}/my-new-endpoint`, myNewController);
```

3. **Create Frontend Function** in `client/src/apiController/controller.tsx`:
```typescript
export const getMyNewData = async (): Promise<any> => {
  const url = `${API_BASE_URL}${BASE_PATH}/my-new-endpoint`;
  const headers = await getHeadersWithToken();
  
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};
```

## 📚 Key Files Explained

- **`client/src/mondayServices/getMondaySessionToken.ts`** - Fetches session token from Monday.com
- **`client/src/apiController/controller.tsx`** - Frontend API client with automatic token injection
- **`server/Authentication/mondaySessionValidation.js`** - JWT validation middleware
- **`server/index.js`** - Express server with route protection
- **`server/Logger/logger.js`** - Logging utility (logs saved in `server/logs/`)

## 🔒 Security Notes

- ✅ Session tokens are validated on every API request
- ✅ JWT verification ensures tokens are not tampered with
- ✅ Client secret is stored in environment variables (never in code)
- ✅ Health check endpoint is excluded from validation (for monitoring)
- ⚠️ **Never commit `.env` files to version control**
- ⚠️ **Never log session tokens in production**

## 📄 License

ISC

## 🤝 Contributing

This is a template project. Feel free to fork and modify for your needs.

---

**Need Help?** Check the [Monday.com Developer Documentation](https://developer.monday.com/apps/docs/introduction-to-the-sdk)
