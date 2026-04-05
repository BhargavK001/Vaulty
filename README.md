# 🌩️ Vaulty - Your Digital Document Vault

**Vaulty** is a premium, secure, and beautiful document management application that integrates seamlessly with your Google Drive. Designed with a focus on aesthetics and user experience, Vaulty helps you organize your certificates, IDs, family records, and precious memories in a calm, focused environment.

![Vaulty Hero Section Screenshot](https://raw.githubusercontent.com/username/project/main/public/hero.png) *(Placeholder for your actual screenshot)*

## ✨ Key Features

- **🎨 Premium Design**: A stunning Purple & Black theme with modern glassmorphism and smooth animations.
- **☁️ Google Drive Integration**: Link your existing Google Drive folders to manage your files directly from Vaulty.
- **🔦 Smart Organization**: Categorize documents into Academic, Identity, Finance, Family, and more.
- **📅 Timeline View**: Browse your document history chronologically.
- **⭐ Favorites**: Keep your most important documents just one click away.
- **🌓 Dark Mode**: A deep black, "OLED" optimized theme for a premium night-time experience.

## 🚀 Tech Stack

- **Framework**: [Next.js 16.2](https://nextjs.org/) (Turbopack)
- **Library**: [React 19](https://reactjs.org/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Fetching**: [SWR](https://swr.vercel.app/)
- **API**: [Google Drive API v3](https://developers.google.com/drive)

## 🛠️ Getting Started

### Prerequisites
- Node.js 18.x or later
- A Google Cloud Project with Drive API enabled

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/vaulty.git
   cd vaulty
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy the `.env.local` template and fill in your Google OAuth credentials. See [README_SETUP.md](./README_SETUP.md) for a detailed guide.

4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components including the sidebar and layouts.
- `hooks/`: Custom React hooks for data management.
- `lib/`: Utility functions and third-party API configurations.
- `public/`: Static assets and images.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
Created with ❤️ by the Vaulty Team.
