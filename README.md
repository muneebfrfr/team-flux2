# 🧪 Next.js + Prisma + MongoDB (Atlas) Starter

This project is a boilerplate setup for using **Next.js** with **Prisma ORM** and **MongoDB Atlas** as the database.

---

## 🚀 Tech Stack

- **Next.js** – React-based frontend framework
- **Prisma** – Type-safe ORM for database operations
- **MongoDB Atlas** – Cloud-based database hosting

---

## 🛠️ Setup Instructions

### 1. 📦 Install Dependencies

```bash
npm install
```

### 2. 🧾 Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority&appName=Cluster0"
```

> Replace `<username>`, `<password>`, `<cluster>`, and `<dbname>` with your actual MongoDB Atlas details.

### 3. 🔌 Prisma Setup

Generate the Prisma client:

```bash
npx prisma generate
```

Push your schema to MongoDB:

```bash
npx prisma db push
```

### 4. 🏁 Run the App

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
/prisma          → Prisma schema and migrations
/pages           → Next.js pages
/lib             → Utility functions (e.g., Prisma client setup)
.env             → Environment variables (excluded from Git)
```

---

## ✅ Notes

- MongoDB Atlas must have a replica set enabled.
- Your MongoDB URI **must include** the database name.
- Use `npx prisma studio` to visually explore and edit your database.

---

## 🧑‍💻 Author

Made with ❤️ by [Your Name]

---

## 📜 License

This project is licensed under the MIT License.