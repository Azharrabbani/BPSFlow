# 📌 BPSFlow - Task Management System

![Laravel](https://img.shields.io/badge/Laravel-12.x-red?style=flat&logo=laravel)
![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)
![Inertia.js](https://img.shields.io/badge/Inertia.js-bridge-purple?style=flat&logo=inertia)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-blue?style=flat&logo=tailwindcss)

---

### 🧭 Description

**BPSFlow** is a web-based task management application designed to assist employees of the Badan Pusat Statistik (BPS) in efficiently managing projects and team workflows.

This application was built using:

- **Laravel** for backend
- **React + Inertia.js** for frontend SPA
- **Tailwind CSS** for styling
- **MySQL / PostgreSQL** for database
And several **external libraries** such as `wx-react-gantt`, `react-datepicker`, etc.

---

## 🧪 Main feature

✅ Task Management & Assignment  
✅ Gantt Chart  
✅ Workspace & Role-Based Access    

---

## 🧰 Teknologi

| Technology    | Description                           |
|---------------|---------------------------------------|
| Laravel       | Backend REST / SSR with Inertia       |
| React         | SPA Frontend                          |
| Inertia.js    | Bridge Laravel & React                |
| Tailwind CSS  | Styling utility-first                 |
| MySQL/Postgres| Database Relasional                   |
| Vite          | Build Tool for React                  |
| NPM Libraries | Additional UI such as Gantt charts    |

---

## 🚀 How to run it

### 1. Clone Repository
```bash
git clone https://github.com/username/bpsflow.git
cd bpsflow
```

### 2. Laravel installation (Backend)
```bash
composer install
```

### 3. React & Frontend installation
```bash
npm install
```

### 4. Copy File .env
```bash
cp .env.example .env
```

### 5. Generate Key & Migrate DB
```bash
php artisan key:generate
php artisan migrate
```

### 6. Run Server
```bash
# Laravel
php artisan serve
```

# React / Frontend
```bash
npm run dev
```

