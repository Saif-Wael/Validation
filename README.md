# User Authentication System

A secure user authentication system built with Node.js and Express, featuring user registration, login, and data validation.

## Features

- User registration and login
- Input validation
- Secure password handling
- JWT-based authentication
- Frontend interface for user interaction
- Comprehensive test suite

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/SE_Task1.git
cd SE_Task1
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
JWT_SECRET=your_jwt_secret_here
```

4. Start the server:
```bash
npm start
```

5. Access the application at `http://localhost:3000`

## Testing

Run the test suite:
```bash
npm test
```

## Project Structure

- `server.js` - Main application entry point
- `routes/` - API route handlers
- `middlewares/` - Custom middleware functions
- `helpers/` - Utility functions
- `validators/` - Input validation logic
- `public/` - Frontend static files
- `__tests__/` - Test files

## Technologies Used

- Node.js
- Express.js
- JSON Web Tokens (JWT)
- Jest for testing 