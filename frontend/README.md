# Hospital Management - React Frontend

This React frontend is scaffolded to integrate with the `hospitalmanagement` Spring Boot backend.
It includes pages and components for Login, Dashboard (role-aware), Patients, Appointments, Doctors,
Departments, Billing & Reports, and a responsive sidebar + header.

## Quick start

1. Set backend base URL in `src/config.js`
2. Install & start:

```bash
npm install
npm start
```

## Notes

- Uses Material UI for components.
- Axios instance at `src/services/api.js` handles base URL and auth header injection.
- Auth uses JWT stored in localStorage (`token`). Adjust to match backend auth mechanism.
- Endpoints used (expected) — adapt if your backend uses different URLs:
  - `POST /auth/login` -> {username, password} returns {token, role}
  - `GET /patients`, `POST /patients`, `PUT /patients/{id}`, `DELETE /patients/{id}`
  - `GET /appointments`, `POST /appointments`, etc.
  - `GET /doctors`, `GET /departments`, `GET /bills`

If you want, I can adapt the frontend further after you confirm actual backend endpoint names/responses.