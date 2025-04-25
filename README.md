# To-Do List App with User Authentication

## 🚀 Requirements

### 1. Functionality

-   Users can **register** with name, email, password, and phone.
-   Users can **log in** and **log out** securely.
-   Users can **view** and **edit** their personal details.
-   Users can **add**, **edit**, and **delete** to-do items.
-   Each to-do item includes:
    -   Title
    -   Description
    -   Status (Completed/Pending)
    -   Due Date
    -   Priority
    -   List
-   Ability to **mark tasks** as completed or pending.
-   Display a list of to-do items for the authenticated user with **filter options**:
    -   Show completed
    -   Show pending
-   Implement a **search feature** to find tasks by title.

### 2. Authentication

-   **User authentication** with email and password.
-   Passwords are securely **hashed using bcrypt**.
-   Implemented **JWT (JSON Web Tokens)** for secure user authentication.

### 3. Back-End

-   Built with **Node.js (v20.17.0)** and **Express**.
-   User data and to-do items are stored in **MongoDB**, managed via **Mongoose**.
-   Developed **RESTful APIs** for:
    -   User authentication
    -   To-do item management
    -   CRUD operations
-   **Validations**, **middlewares**, and **error handlers** are implemented for data integrity and better error management.
-   **Redis caching** is integrated for frequently accessed user data and to-do lists, reducing database load and improving response times.
-   **Rate limiting** to prevent abuse and reduce the likelihood of brute-force attacks.

### 4. Front-End

-   Developed using **React.js (TypeScript)**.
-   UI is **user-friendly**, **simple**, and **responsive**.
-   **State management** using React Context API for global state (e.g., authentication status).
-   Integrated **axios** for API requests with error handling and loading indicators.
-   Includes **form validation** on the client side using **Zod** to ensure proper data submission.
-   Dynamic rendering of to-do items based on user authentication and task filtering.
-   **Responsive design** for optimal usage on both desktop and mobile devices.

### 5. Project Structure

-   Follows **MERN stack best practices**.
-   Code is **modular**, **clean**, and **maintainable**.
-   **Backend** follows the MVC pattern, separating concerns across models, controllers, and routes.
-   **Frontend** follows component-based architecture, keeping UI modular and reusable.

---

## ⚙️ Setup Instructions

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/MinaSaber/todo-list
    cd To-Do
    ```

    Install Dependencies:

    For the Back-End:

    ```bash
    cd backend
    npm install
    ```

    For the Front-End:

    ```bash
    cd frontend
    npm install
    ```

    Environment Configuration:

    Create a `.env` file in the root directory of the backend:

    ```env
    MONGO_URI=mongodb+srv://mongodb:mongodb@todo-list.m2hvf.mongodb.net/?retryWrites=true&w=majority&appName=todo-list
    JWT_SECRET=e8a10eb15dbcf4288b286124bafd2e3c8ae7d3a1b8e33dcca2eb9d5319038484
    NODE_ENV=dev
    REDIS_HOST=memcached-11399.c135.eu-central-1-1.ec2.redns.redis-cloud.com
    ```

    Run the Application:

    For the Back-End:

    ```bash
    npm run dev
    ```

    For the Front-End:

    ```bash
    npm run dev
    ```

    📦 Dependencies

    Back-End:

    -   Node.js
    -   Express
    -   Mongoose
    -   Bcrypt
    -   JSON Web Token (JWT)
    -   Redis
    -   Rate-limiter-flexible (for rate limiting)

    Front-End:

    -   React.js (TypeScript)
    -   Axios
    -   Zod (for client-side validation)

    🚨 Notes

    -   Backend includes validations, custom middlewares, and robust error handling.
    -   MongoDB connection is configured via an online server using the provided `.env` settings.
    -   Redis is used for caching user data and to-do lists to improve performance.
    -   Rate limiting features enhance security and user experience.
    -   Logging and error tracking help in debugging and monitoring system health.

    💬 Contact

    For any questions or issues, feel free to contact me via Email or open an issue on the repository.
