# Vibecoding AI Tools Platform

## 📌 Overview

Full-stack application for managing AI tools with authentication, role-based access, admin moderation, 2FA security, and user feedback system.

Built with:

* Laravel (Backend API)
* Next.js (Frontend)
* MySQL & Redis
* Docker

---

## 🚀 Installation

### 1. Clone repository

```bash
git clone https://github.com/SerkanMustafa/vibecoding-ai-tools.git
cd vibecoding-ai-tools
```

### 2. Start Docker

```bash
docker compose up -d
```

### 3. Setup backend

```bash
docker compose exec php_fpm composer install
docker compose exec php_fpm php artisan migrate
docker compose exec php_fpm php artisan storage:link
```

### 4. Setup frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Application URLs

* Frontend: http://localhost:3000
* Backend API: http://localhost:8201

---

## 🔐 Authentication

* Uses Laravel Sanctum
* Token-based authentication
* Stored in frontend context
* Logout clears token

---

## 🔒 Security Features

* Role-based authorization (owner/user)
* Protected routes (middleware)
* Only owner or creator can edit/delete tools
* Two-Factor Authentication (Google Authenticator)

---

## 👤 Roles System

| Role  | Permissions                         |
| ----- | ----------------------------------- |
| owner | Full access (approve/reject/delete) |
| user  | Can create tools and comment        |

---

## 🛠 Features

* Create, edit, delete AI tools
* Categories, roles, tags system
* Admin panel for moderation
* Comments & rating system ⭐
* Pagination for performance
* 2FA security
* Responsive UI

---

## ➕ Adding Tools

Go to:

```
/tools/create
```

Steps:

1. Enter token
2. Load reference data
3. Fill form
4. Submit

---

## 🧠 Admin Panel

Route:

```
/admin/tools
```

Features:

* Approve tools
* Reject tools
* Filter by category/role/status

---

## 💬 Comments & Rating

Users can:

* Leave comments
* Give rating (1–5 stars)
* See average rating

---

## ⚙️ Environment Config

Frontend uses:

```env
NEXT_PUBLIC_API_URL=http://localhost:8201/api
```

---

## 📦 Docker Services

* nginx (backend)
* php_fpm (Laravel)
* mysql
* redis
* frontend (Node)

---

## 🧪 Testing

Manual testing includes:

* Auth flow
* Tool CRUD
* Admin moderation
* 2FA verification
* Comments & ratings

---

## 📌 GitHub Repository

https://github.com/SerkanMustafa/vibecoding-ai-tools

---

## 👨‍💻 Author

Serkan Mustafa
