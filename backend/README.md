# Orange Brew Backend

Backend API for Orange Brew application using Node.js, Express, TypeScript, Prisma, and MySQL.

## Structure
- `src/controllers`: Request handlers
- `src/routes`: API endpoints
- `src/middleware`: Authentication and authorization
- `src/config`: Database configuration
- `prisma/schema.prisma`: Database schema

## Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Configure Environment:
   - File `.env` is already created with default settings.
   - Adjust `DATABASE_URL` if needed (default: `mysql://root@127.0.0.1:3306/orangebrew`).

3. Setup Database:
   ```bash
   npx prisma db push
   ```

4. Run Development Server:
   ```bash
   npm run dev
   ```

   Server runs on http://localhost:3000.

## API Endpoints

### Auth
- `POST /api/auth/register` (Register)
- `POST /api/auth/login` (Login)
- `GET /api/auth/me` (Current user)

### Products
- `GET /api/products` (List all products)

### Orders
- `POST /api/orders` (Create order - User only)
- `GET /api/orders` (List orders - User sees own, Admin/Cashier sees all)
- `PATCH /api/orders/:id/status` (Update status - Admin/Cashier only)
