# 🚀 Project Overview

This is a learning project where I practiced authentication development using the Next.js framework and Auth.js. The database is powered by Neon Postgres, and Prisma is used for schema management and ORM. TailwindCSS and shadcn/ui are used for the design.

- - - 

# 🛠️ Technologies Used

## ⚡ Next.js – A powerful React framework for building full-stack applications.
### [![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
- - -
## 🔑 Auth.js – Simplified authentication handling.
## [![Auth.js](https://img.shields.io/badge/🔑Auth.js-purple?style=for-the-badge)](https://authjs.dev/)
- - -
## 💾 Neon Postgres – A modern, serverless PostgreSQL database.
### [![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
- - -
## 🔄 Prisma – A next-generation ORM for database access and schema management.
### [![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
- - -
## 🎨 TailwindCSS & shadcn/ui - A modern CSS library with beautifully-designed component library.
### [![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-black?style=for-the-badge)](https://ui.shadcn.com/)
- - -

# ✨ Features

### Login and registration using credentials (email and password)
- Users can log in and register using their email address and password.

### Login and registration using different OAuth providers like Google and GitHub
- Users can log in and register using third-party OAuth providers such as Google and GitHub, simplifying the login process.

### Password reset via email
- If a user forgets their password, they can request a password reset link sent via email to set a new password.

### Two-factor authentication with a 6-digit code sent via email
- Two-factor authentication (2FA) support, which sends a 6-digit code to the user's email for every login. The user must enter the code correctly to access their account.

### Role-based access: USER or ADMIN
- The system allows role-based access, with a default role of "user," but users can also be assigned administrative privileges. Admins have full access to the system and can manage user accounts.

- - -

# 🚀 Getting Started

To run this project locally, follow these steps:

📥 Clone the repository:

```git clone git@github.com:szidzse/nextjs-authentication.git```

📦 Install dependencies:

```npm install```

⚙️ Set up your environment variables in a .env file. ".env.example" file is provided.

▶️ Run the development server:

```npm run dev```

This will get the project up and running on your local machine.