<div align="center"><h1>🚗 Car Rental API</h1><p>A robust backend API for a car rental service built with Node.js, Express, and Sequelize.</p></div>✨ Key Features✅ Secure Authentication: JWT-based authentication with role management (Admin & Customer).✅ Complete Car Management: Full CRUD operations for the car inventory.✅ Advanced Filtering: Smart search, sorting, and pagination for car listings.✅ Full Booking Cycle: End-to-end booking and transaction management.✅ Automated Setup: Database migrations and seeding for initial data (like the admin user).🚀 Getting StartedFollow these steps to get the project running on your local machine.1. PrerequisitesNode.js (v18 or higher)MySQL Server2. InstallationClone the repository and install the dependencies.git clone [https://github.com/](https://github.com/)[your-username]/car-rental-api.git
cd car-rental-api
npm install
3. Environment SetupCreate a .env file in the root directory and fill it with your credentials.# Server
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
4. Database SetupRun the migrations to create the tables and the seeder to create the initial admin user.# Create database tables
npx sequelize-cli db:migrate

# Create the default admin user
npx sequelize-cli db:seed:all
5. Run the Servernpm run dev
The API will be available at http://localhost:3000.📖 API EndpointsA brief overview of the available API endpoints.MethodEndpointDescriptionAccessPOST/api/users/registerRegister a new customer✅ PublicPOST/api/users/loginLogin to receive a JWT✅ PublicGET/api/carsGet a list of available cars✅ PublicPOST/api/carsAdd a new car👑 Admin OnlyPOST/api/bookingsCreate a new