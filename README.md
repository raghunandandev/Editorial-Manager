# Editorial Management — Research Paper Management System

Full-stack application for managing manuscripts, editorial workflows, reviews, and payments.

## Project structure

- `backend/` — Node.js + Express API, MongoDB models, controllers, middleware, and server.
- `frontend/` — Vite + React + TypeScript web client.

## Quickstart (development)

Prerequisites: Node.js (v18+ recommended), npm or yarn, MongoDB (or a connection string).

1. Backend

   - Install dependencies:

     cd backend
     npm install

   - Create your environment variables (see `backend/config/env.js` and `backend/config/cloudinary.js` for required keys). Typical variables include `MONGO_URI`, `JWT_SECRET`, `PORT`, Cloudinary credentials, and ORCID keys.

   - Run in development mode:

     npm run dev

   - Run tests:

     npm test

   Available backend scripts (from `backend/package.json`):

   - `start` — `node server.js`
   - `dev` — `nodemon server.js`
   - `test` — `jest --verbose --coverage`

2. Frontend

   - Install dependencies:

     cd frontend
     npm install

   - Run development server:

     npm run dev

   - Build for production:

     npm run build

   Available frontend scripts (from `frontend/package.json`):

   - `dev` — `vite`
   - `build` — `vite build`
   - `preview` — `vite preview`

## Database & seeding

- The backend uses MongoDB via Mongoose. Set `MONGO_URI` in your environment.
- Seed/sample scripts live in `backend/scripts/` (for creating default editorial users, etc.).

## Environment configuration

- See `backend/config/env.js` for which environment variables are read by the server. Add a `.env` file or set variables in your deployment environment.

## Tests

- Backend tests are Jest-based and live under `backend/tests/`.
- Run `cd backend && npm test` to execute the test suite and view coverage.

## Contributing

- Fork the repo, create a branch per feature or bugfix, and open a pull request describing changes.
- Keep changes focused and update or add tests where appropriate.

## Useful files

- `backend/server.js` — Express app entrypoint.
- `frontend/src` — React app source.

## License & Contact

Specify your license here and contact information for maintainers.

---

If you'd like, I can add a sample `.env.example`, expand the CONTRIBUTING section, or add CI instructions. What would you like next?
