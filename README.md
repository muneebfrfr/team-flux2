# TeamFlux – Session Collaboration Platform

TeamFlux is a full-stack collaboration platform built with **Next.js 14**, **MongoDB Atlas**, **Prisma**, and **NextAuth**. It enables users to manage sessions, take notes, assign action items, give feedback, and receive notifications – all within a secure and role-based system.

---

## 📦 Tech Stack

- **Frontend**: Next.js (App Router)
- **Backend**: API Routes (Next.js)
- **Database**: MongoDB Atlas (via Prisma)
- **Authentication**: NextAuth.js (Credentials Provider)
- **ORM**: Prisma with MongoDB Preview Features
- **Styling**: (Add your styling system here e.g., Tailwind, MUI)

---

## 🔐 Authentication

Authentication is implemented using **NextAuth.js** with a custom `CredentialsProvider`.

- Users sign in using their **email and password**.
- Passwords are **hashed using bcryptjs** before saving.
- JWT is used as the session strategy.
- The user’s `id` and `roles` are embedded into the JWT token and accessible in the session object.

#### `/lib/auth.ts` Highlights

```ts
token.id = user.id;
token.roles = user.roles;
session.user.id = token.id;
session.user.roles = token.roles;
```

---

## 🧠 Database Schema (Prisma)

Prisma is used with the MongoDB provider. Models are stored in `prisma/schema.prisma`, and the generated client is output to `src/generated/prisma`.

### 🔑 Models Overview

#### `Users`
- Stores user info with hashed password.
- Each user can:
  - Present sessions
  - Be assigned action items
  - Receive notifications

#### `Session`
- Represents a collaboration session.
- Contains:
  - Notes
  - Action Items
  - Feedback
  - Presenter
  - Session members

#### `Note`
- Belongs to a `Session`
- Stores note content

#### `ActionItem`
- Assigned to a `User`
- Belongs to a `Session`
- Has a `completed` status and `dueDate`

#### `Feedback`
- Contains rating and optional comment
- Tied to a `Session`

#### `Notification`
- Linked to a `User` and optionally a `Session`
- Marks if the notification is `read`

---

## 📁 Folder Structure (Important Parts)

```
.
├── prisma/
│   └── schema.prisma         # Prisma schema file
├── src/
│   ├── app/                  # Next.js App Router
│   ├── lib/
│   │   └── auth.ts           # NextAuth config
│   └── generated/
│       └── prisma/           # Prisma client output
├── .env                      # Environment variables
└── README.md
```

---

## 🧪 Environment Variables

Ensure you have the following in your `.env` file:

```env
DATABASE_URL="mongodb+srv://teamflux_user:teamflux_pass@cluster0.knonexc.mongodb.net/teamflux_db?retryWrites=true&w=majority&appName=Cluster0"
NEXTAUTH_SECRET="run this command in terminal -> openssl rand -hex 32"
```

---

## 🛠 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

---

## 🧪 Prisma CLI Commands

- **Generate Prisma Client**
  ```bash
  npx prisma generate
  ```

- **Format Prisma Schema**
  ```bash
  npx prisma format
  ```

> Note: MongoDB support in Prisma is **experimental**, so some features may differ from relational DBs.

---

## ✅ Feature Roadmap

- [x] Auth with email/password
- [x] Role-based JWT session
- [x] Session creation & assignment
- [x] Notes & feedback system
- [x] Notifications per session
- [ ] Google Calendar integration (via `calendarId`)
- [ ] Email notifications

---

## 🤝 Contributing

Feel free to fork, clone, and submit PRs. All contributions are welcome!

---

## 📄 License

MIT © 2025 TeamFlux