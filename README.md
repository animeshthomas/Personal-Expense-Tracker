```markdown
# Personal Expense Tracker

## API Documentation

For detailed API documentation, please visit the following link: 
https://docs.google.com/spreadsheets/d/e/2PACX-1vQnKBS7MjmQl31k6K2Smw4xm85WNhVzy0wkSxmOE7V8czKtlU034A-DHgBKZ_WWBPexdTXXuw-DFNmH/pubhtml
## Overview

This is a Personal Expense Tracker application designed to help users manage their expenses. The project is divided into two main parts: the backend server and the frontend client.

## Project Structure

- **Backend (Server)**: Located in the `server` directory.
- **Frontend (Client)**: Located in the `client-expense-app` directory.

## Important
   ### If you are running locally
- **Frontend (Client)**: Located in the `client-expense-app/src/Config/config.js` directory.
- **Frontend (Client)**: uncomment the local link and comment hosted server link

## Backend Installation

1. **Clone the Repository**

   ```bash
   https://github.com/animeshthomas/Personal-Expense-Tracker.git
   cd Personal-Expense-Tracker/server
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the `Personal-Expense-Tracker` directory with the following content:

   ```env
   MONGO_URI='mongodb+srv://doccure:doccurepwd@cluster0.cmdwr.mongodb.net/?retryWrites=true&w=majority'
   PORT=8000
   JWT_SECRET='8814051fbb43d5677140a882aad6f96ebfc6e9a8c8335ea5bfce0ded26cafd136f15f57c8196374088f33c9386a2e1b0237b4b0ef9fddb422c163e84a8c9b0fb'
   ```

4. **Start the Server**

   ```bash
   node server.js
   ```

## Frontend Installation

1. **Navigate to the Client Directory**

   ```bash
   cd Personal-Expense-Tracker/client-expense-app
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start the Frontend**

   ```bash
   npm start
   ```
```

Feel free to adjust any details as needed!
