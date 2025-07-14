<div align="center">
  <h1>🚗 Car Rental API</h1>
  <p>A robust backend API for a car rental service built with Node.js, Express, and Sequelize.</p>
  
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
  ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
  ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)

</div>

---

## ✨ Key Features

-   ✅ **Secure Authentication:** JWT-based authentication with role management (Admin & Customer).
-   ✅ **Complete Car Management:** Full CRUD operations for the car inventory.
-   ✅ **Advanced Filtering:** Smart search, sorting, and pagination for car listings.
-   ✅ **Full Booking Cycle:** End-to-end booking and transaction management.
-   ✅ **Automated Setup:** Database migrations and seeding for initial data (like the admin user).

---

## 🚀 Getting Started

Follow these steps to get the project running on your local machine.

### 1. Prerequisites

-   Node.js (v18 or higher)
-   MySQL Server

### 2. Installation

Clone the repository and install the dependencies.

```bash
git clone [https://github.com/](https://github.com/)[your-username]/car-rental-api.git
cd car-rental-api
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory and fill it with your credentials.

```env
# Server
PORT=3000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=car_rental_db

# Security
JWT_SECRET=your_super_secret_jwt_key

# Default Admin (for seeding)
ADMIN_EMAIL=admin@carrental.com
ADMIN_PASSWORD=your_secure_admin_password
```

### 4. Database Setup

Run the migrations to create the tables and the seeder to create the initial admin user.

```bash
# Create database tables
npx sequelize-cli db:migrate

# Create the default admin user
npx sequelize-cli db:seed:all
```

### 5. Run the Server

```bash
npm run dev
```
The API will be available at `http://localhost:3000`.

---

## 📖 API Endpoints

A brief overview of the available API endpoints.

| Method   | Endpoint                  | Description                     | Access           |
| :------- | :------------------------ | :------------------------------ | :--------------- |
| `POST`   | `/api/users/register`     | Register a new customer         | ✅ **Public** |
| `POST`   | `/api/users/login`        | Login to receive a JWT          | ✅ **Public** |
| `GET`    | `/api/cars`               | Get a list of available cars    | ✅ **Public** |
| `POST`   | `/api/cars`               | Add a new car                   | 👑 **Admin Only** |
| `POST`   | `/api/bookings`           | Create a new booking            | 🔒 **Authenticated** |
| `POST`   | `/api/transactions`       | Process payment for a booking   | 🔒 **Authenticated** |

> For a detailed list of all endpoints, please refer to the project's Postman collection or source code.

---

<div align="center">
  <p>Project Author: <b>Xusniddin</b></p>
</div>
