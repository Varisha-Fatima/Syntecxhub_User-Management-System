User Management System

A RESTful User Management System built using **Node.js, Express.js, MongoDB, and Mongoose**. This project provides complete CRUD functionality, Basic Authentication for API security, and a responsive frontend dashboard.

 Features

- **Create Users:** Add new users with name, email, password, and age.
- **Read Users:** View all users or retrieve a single user.
- **Update Users:** Edit existing user information.
- **Delete Users:** Remove users from the database.
- **Basic Authentication:** Secure API endpoints using username and password.
- **Password Hashing:** Protect user passwords using bcryptjs.
- **MongoDB Integration:** Store user information in MongoDB Atlas.
- **Responsive Dashboard:** Manage users through a simple web interface.

 Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB Atlas | Database |
| Mongoose | Database schema and operations |
| bcryptjs | Password hashing |
| HTML | Frontend structure |
| CSS | Frontend styling |
| JavaScript | Frontend functionality |
| Thunder Client | API testing |

Project Structure

```text
User-Management-System/
│
├── models/
│   └── User.js
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

## Installation and Setup

1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/Syntecxhub_User-Management-System.git
```

2. Navigate to Project Folder

```bash
cd Syntecxhub_User-Management-System
```

3. Install Dependencies

```bash
npm install
```

4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=your_mongodb_connection_string
API_USERNAME=your_api_username
API_PASSWORD=your_api_password
```

Replace the placeholder values with your own credentials.

5. Start the Server

```bash
node server.js
```

6. Open the Application

Visit:

```text
http://localhost:5000
```

 API Endpoints

All API endpoints require Basic Authentication.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users` | Create a user |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get a single user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

API Testing

API endpoints were tested using Thunder Client.

Tested operations:

- POST – Create User
- GET – Read Users
- PUT – Update User
- DELETE – Delete User
- Basic Authentication – Verify authorized and unauthorized access

 Security

- Passwords are hashed using bcryptjs.
- API endpoints are protected using Basic Authentication.
- Environment variables are stored in `.env`.
- Sensitive credentials and `node_modules` are excluded using `.gitignore`.

 Project Purpose

This project was developed as part of the **Syntecxhub Internship** to practice REST API development, database integration, authentication, and frontend-backend connectivity.

---

**Developed by:** Varisha Fatima  
**Project:** User Management System  
**Internship:** Syntecxhub
