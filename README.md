**Saving Backend**

The Saving Backend is a Node.js and Express-based RESTful API for managing users, accounts, and admin operations in a savings or finance management system.
It includes authentication, authorization, account management, and error handling using modular and scalable architecture.

🚀 Features

User Authentication – Signup, login, and JWT-based protection.

Account Management – manage user accounts and transactions.

Admin Operations – Administrative control over users and accounts.

Global Error Handling – Centralized error controller for consistent error responses.

Reusable Handlers – Factory functions for CRUD operations.

Environment Configurations – Using config.env for secrets and environment variables.

🧱 Project Structure
SAVING-BACKEND/
│
├── Controllers/
│   ├── accountController.js     # Handles account logic (transactions, balances)
│   ├── adminController.js       # Handles admin operations
│   ├── authController.js        # Authentication & authorization logic
│   ├── errorController.js       # Central error handling middleware
│   ├── handlerFactory.js        # Reusable CRUD handlers
│   └── userController.js        # User profile and account management
│
├── Models/
│   ├── accountModel.js          # Mongoose schema for account
│   └── userModel.js             # Mongoose schema for user
│
├── Routes/
│   ├── accountRoutes.js         # Account-related routes
│   ├── adminRoutes.js           # Admin-related routes
│   └── userRoutes.js            # User-related routes
│
├── Utils/                       # Helper functions (AppError, email, etc.)
│
├── app.js                       # Express app configuration
├── server.js                    # Entry point – starts the server
├── config.env                   # Environment configuration file
├── package.json                 # Project dependencies and scripts
└── README.md                    # Project documentation

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/<your-username>/saving-backend.git
cd saving-backend

2️⃣ Install dependencies
npm install

3️⃣ Configure environment variables

Create a .env or config.env file in the root directory and include the following:

NODE_ENV=production
PORT=5000
DATABASE=mongodb+srv://corneilletwagirimana:zJsNcxDn2Q4ZmHfB@cluster0.bdrjwwc.mongodb.net/Saving?retryWrites=true&w=majority
DATABASE_PASSWORD=zJsNcxDn2Q4ZmHfB


JWT_SECRET=my-ultra-secure-and-ultra-long-secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90




4️⃣ Run the server
npm start/nodemon server


or for development (with nodemon):

nodemon server


🧰 Built With

Node.js

Express.js

MongoDB

Mongoose

JWT

dotenv

Nodemon
 (for development)

🧪 Scripts
Command	Description
npm start	Start the app in production mode
npm run dev	Run the app with nodemon for development

🛡️ Error Handling

All operational and programming errors are processed by errorController.js, ensuring consistent responses and preventing server crashes.

👥 Author

Corneille Twagirimana
corneilletwagirimana@gmail.com

💼 Software Engineer 

