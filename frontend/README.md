# edata4you Frontend (Next.js + Tailwind)

This is a starter frontend scaffold for your Hospital Management System.
It expects a Spring Boot backend running at the URL configured in `.env.local` as `NEXT_PUBLIC_API_URL`.

## Quick start

1. Unzip the project and `cd` into it.
2. Run `npm install`
3. Create `.env.local` with:
   NEXT_PUBLIC_API_URL=http://localhost:8080
4. Run `npm run dev`

## Feature highlights included:
- JWT-based login (stores token in localStorage)
- Protected routes (simple client-side guard)
- Dashboard layout with sidebar and topbar
- Patients listing CRUD scaffold
- Doctors & Appointments pages scaffolds
- API service wrapper using axios
- Tailwind CSS styling and Recharts placeholder for analytics

Drop this into your workflow and I'll continue generating modules on demand.
