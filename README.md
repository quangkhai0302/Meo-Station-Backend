<div align="center">
  <h1 align="center">MeoStation — Backend</h1>
  <h3>Hotel Management & Booking API</h3>

<img src="https://img.freepik.com/premium-vector/backend-icon_933463-6277.jpg" alt="MeoStation Backend" style="width:80px;height:80px"></a>

</div>

![Node.js](https://img.shields.io/badge/Node-18.x-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

## Overview

This repository contains the backend API for the MeoStation Hotel Management & Booking platform. It exposes RESTful endpoints for hotels, rooms, bookings, users, notifications, vouchers and blog content. The backend handles authentication, validation, payment integrations, file uploads, real-time notifications, and background services.

## Main responsibilities

- **REST API endpoints:** organized under `src/routes/v1/` for hotels, bookings, users, comments, blogs, contacts, notifications, vouchers and payment callbacks.
- **Authentication & authorization:** JWT access/refresh tokens, role-based access checks in `src/middlewares/authMiddleware.js` and providers in `src/providers/JwtProvider.js`.
- **Booking & payment flows:** booking lifecycle, validation and payment integrations (Momo, ZaloPay) implemented in `src/controllers` and `src/services`.
- **File/media uploads:** Cloudinary integration via `src/providers/CloudinaryProvider.js` and `multer` middleware for multipart uploads.
- **Email & transactional notifications:** Brevo provider integration in `src/providers/BrevoProvider.js` for transactional emails.
- **Real-time notifications:** Socket-based notifications implemented under `src/sockets/` and `notificationController/service`.
- **Data models & validation:** Mongoose models in `src/models/` and request validations in `src/validations/`.
- **Error handling & utilities:** centralized API error class and middleware in `src/utils/ApiError.js` and `src/middlewares/errorHandlingMiddleware.js`.

## Tech stack

- `Node.js` (LTS) — Runtime environment.
- `Express` — Web framework for building APIs.
- `MongoDB` + `Mongoose` — Document database and ODM.
- `Socket.IO` — Real-time event delivery for notifications.
- `Cloudinary` — Media storage and image transformations.
- `Brevo` — Email provider for transactional emails.

## Install & development

1. Clone the repository

```powershell
git clone https://github.com/Panda0712/Meo-Station-Backend.git
```

2. Install dependencies

```powershell
npm install
```

3. Create a `.env` file at the project root. You can use the included `.env.example` as a reference. Example keys you should configure:

```
MONGODB_URI='your_connection_string'
DATABASE_NAME='your_database_name'
APP_HOST='localhost'
APP_PORT=5000
AUTHOR='author_name'
WEBSITE_DOMAIN_DEVELOPMENT='http://localhost:5173'
WEBSITE_DOMAIN_PRODUCTION='your_production_domain'
BREVO_API_KEY='your-brevo-key'
ADMIN_EMAIL_ADDRESS='admin@example.com'
ADMIN_EMAIL_NAME='admin_email_name'
ACCESS_TOKEN_SECRET_SIGNATURE='long_secret'
ACCESS_TOKEN_LIFE='15m'
REFRESH_TOKEN_SECRET_SIGNATURE='long_refresh_secret'
REFRESH_TOKEN_LIFE='7d'
CLOUDINARY_CLOUD_NAME='your_cloud_name'
CLOUDINARY_API_KEY='key'
CLOUDINARY_API_SECRET='secret'
```

4. Run in development (uses `nodemon` / `babel-node` per project scripts)

```powershell
npm run dev
```

5. Production start

```powershell
npm run start
```

## Project structure (important folders)

- `src/controllers/` - request handlers for each domain (hotel, booking, user, payment providers).
- `src/services/` - business logic and data orchestration used by controllers.
- `src/models/` - Mongoose schema definitions.
- `src/routes/v1/` - route definitions organized by resource.
- `src/middlewares/` - authentication, file upload and error handling middlewares.
- `src/providers/` - third-party integrations (Brevo, Cloudinary, Jwt helpers).
- `src/validations/` - request input validators for endpoints.
- `src/sockets/` - socket.io logic for real-time notification delivery.

## Notes & best practices

- Keep secret keys out of source control; use the `.env` file and secret managers for production.
- Use the `src/validations` helpers to validate incoming requests and return consistent API error responses.
- Thêm nhánh 1
- Nhánh 2
