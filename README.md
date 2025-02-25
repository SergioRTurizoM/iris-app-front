# Iris Front

This project is the Angular frontend for the Iris ToDo App.

## Features
- **Login & Authentication:** Users can log in to access the app.
- **ToDo List:** Create, update, delete, and filter tasks.
- **JWT Interceptor:** Automatically attaches the JWT token to API requests.
- **Standalone Components:** Built using Angular standalone components.

## Setup
1. Clone the repository.
2. Run `npm install`.
3. Configure environments in `src/environments/environment*.ts`.  
   - Development: `apiUrl: 'http://localhost:3000/dev/api/v1'`
   - Production: `apiUrl: 'https://<your-api-id>.execute-api.us-east-1.amazonaws.com/dev/api/v1'`
4. Run the app in development mode:
   ```bash
   ng serve
