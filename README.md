Car Rental APIThis project is a complete backend system for a car rental service, built with Express.js and Sequelize. The system provides full functionality, including user management, car inventory management, booking processing, and transaction handling.🚀 Key FeaturesUser Management: User registration and login functionality.Authorization & Role System: A secure, role-based system (admin and customer) using JSON Web Tokens (JWT).Car Management (CRUD): Full capabilities to add, view, update, and delete cars from the inventory.Smart Search & Filtering: Advanced search, sorting, and pagination for car listings based on price, year, model, and availability.Booking Management: Functionality to book cars for specific dates and cancel existing bookings.Transaction Handling: System to record payments for bookings.Database Migrations & Seeding: Automated table creation and seeding of the initial admin user using Sequelize-CLI.🛠️ Technology StackBackend: 💻 Node.js, 🚀 Express.jsDatabase: 🐬 MySQLORM: 🗃️ SequelizeAuthentication: 🔑 JSON Web Token (JWT)Validation: JoiSecurity: Helmet, CORS, Express Rate Limit⚙️ Installation and SetupFollow these steps to get the project running on your local machine.1. Clone the repository:git clone [your-repository-url]
cd car-rental-api
2. Install dependencies:npm install
3. Configure Environment Variables:Create a new file named .env by copying from .env.example and fill it with your credentials.Sample .env file:# Server
PORT=3000

# Database (MySQL)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=car_rental_db

# JWT Secret Key
JWT_SECRET=this_should_be_a_very_long_and_secret_key

# Admin Credentials for Seeder
ADMIN_EMAIL=admin@carrental.com
ADMIN_PASSWORD=supersecretadminpassword
4. Create the Database:Ensure you have created an empty database in your MySQL server with the name car_rental_db.5. Run Migrations (Create Tables):npx sequelize-cli db:migrate
6. Run Seeders (Create Admin User):npx sequelize-cli db:seed:all
▶️ Running the ApplicationTo start the server in development mode (with nodemon):npm run dev
The server will be running at http://localhost:3000.API EndpointsAccess Levels:✅ Public: Open for everyone.🔒 Authenticated: Requires a valid token (for logged-in users).👑 Admin Only: Restricted to users with the admin role.Users (/api/users)MethodEndpointDescriptionAccessPOST/api/users/registerRegister a new customer✅ PublicPOST/api/users/loginLog in to get a token✅ PublicGET/api/usersGet a list of all users👑 Admin OnlyGET/api/users/:idGet a single user's profile🔒 AuthenticatedDELETE/api/users/:idDelete a user👑 Admin OnlyCars (/api/cars)MethodEndpointDescriptionAccessGET/api/carsGet all cars (with filters)✅ PublicGET/api/cars/:idGet a single car's details✅ PublicPOST/api/carsAdd a new car👑 Admin OnlyPUT/api/cars/:idUpdate car information👑 Admin OnlyDELETE/api/cars/:idDelete a car👑 Admin OnlyBookings (/api/bookings)MethodEndpointDescriptionAccessPOST/api/bookingsCreate a new booking🔒 AuthenticatedGET/api/bookingsGet a list of own bookings🔒 AuthenticatedGET/api/bookings/:idGet a single booking's details🔒 AuthenticatedDELETE/api/bookings/:idCancel a booking🔒 AuthenticatedTransactions (/api/transactions)MethodEndpointDescriptionAccessPOST/api/transactionsCreate a new payment (transaction)🔒 AuthenticatedGET/api/transactionsGet a list of own transactions