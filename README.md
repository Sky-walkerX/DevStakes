# StoryForge- By Team Genesis

Welcome to the StoryForge repository!original repo -https://github.com/Abhishek-Dige/DevStakes.git

## 📂 Project Structure

This project is divided into four main directories:

- **`/client`**: The frontend application. Contains the UI components, state management, and user-facing features.
- **`/server`**: The backend server. Contains the API routes, business logic, middleware, and our main entry point (`server.js`).
- **`/database`**: Database scripts, connection utilities, schemas, and migrations.
- **`/docs`**: Project documentation, design specifications, architecture diagrams, and reference materials.

## 👥 Team Structure

Our team consists of 5 members, divided into focused roles to ensure smooth and efficient development:

- **Frontend Team (2 Members)**: Responsible for building the `/client` directory, focusing on UI/UX, interface components, and API integration.
- **Backend Team (2 Members)**: Responsible for the `/server` and `/database` directories, focusing on system architecture, database schema, API logic, and secure routing.
- **Project Coordinator (1 Member)**: Abhishek is the Project Coordinator. He will be coordinating tasks between the frontend and backend teams.

## 🌿 Git Discipline & Workflow

To maintain a clean, stable codebase and avoid stepping on each other's toes, all collaborators **must** adhere to the following Git workflow:

1. **Never commit directly to `main`.** 
   The `main` branch should always represent the stable, working state of our application.

2. **Always pull the latest changes before starting work.**
   ```bash
   git checkout main
   git pull origin main
   ```

3. **Create a new branch for every task.** 
   Use descriptive branch names (e.g., `feature/login-page`, `bugfix/api-crash`, `setup/database-schema`).
   ```bash
   git checkout -b feature/<your-feature-name>
   ```

4. **Commit your work with clear messages.**
   Make small, atomic commits rather than one massive commit. 
   ```bash
   git add .
   git commit -m "feat: setup basic user schema"
   ```

5. **Push your branch to the shared repository:**
   Since everyone is a collaborator, you can push your branch directly to the main repository.
   ```bash
   git push -u origin feature/<your-feature-name>
   ```

6. **Merge / Pull Request:** 
   Submit a Pull Request from your branch to the `main` branch. 

7. **Code Review & Merge:** 
   The Project Coordinator (Abhishek) will review the code, ensure it works correctly without breaking existing features, and then merge it into `main`. Once merged, delete your feature branch and start the cycle again!
