# DevVerse

A modern platform where developers connect, showcase their technical profiles, and share relevant content in a simple yet functional environment.

## 🚀 Project Overview

DevVerse is a specialized social platform designed exclusively for developers to:
- Create comprehensive technical profiles highlighting skills and experience
- Connect with other developers based on technological interests
- Share and discover technical content in a focused environment
- Build a professional network of like-minded developers

## ✨ Key Features

### 👤 Technical Profile
- Profile focused 100% on technical aspects
- Showcase your tech stack with selectable tags
- Link to GitHub, LinkedIn, and portfolio
- Highlight featured repositories (via GitHub integration)
- Display professional experience (roles, companies, descriptions)

### 🔗 Connections System
- Follow developers with interesting technical backgrounds
- Track who follows you and who you're following
- See a customized feed of content from followed users

### 📱 User Experience
- Clean, modern, and responsive design (desktop and mobile)
- Intuitive navigation (home, feed, profile, search)
- Tailwind CSS styling for consistent interface

### 📝 Technical Posts
- Share technical content with the community
- Organize posts with tags (e.g., #backend, #api)
- Chronological feed of community posts

### 🧭 Developer Discovery
- Explore developers filtered by tech stack
- Search users by name or keyword
- Quick preview of technical profiles

## 🛠️ Technology Stack

### Frontend
- Next.js (React framework)
- NextAuth.js for authentication (GitHub OAuth, email)
- Tailwind CSS for styling

### Backend
- ASP.NET Core Web API (REST)
- Entity Framework + PostgreSQL
- JWT for authentication

### Infrastructure
- PostgreSQL database
- Docker containerization for development
- Vercel (frontend) and Azure/Railway (backend) for deployment

## 🚦 Project Status

DevVerse is currently in MVP (Minimum Viable Product) development phase, with the following core features being implemented:
- User authentication
- Profile management
- Basic post system
- User connections
- Developer exploration

Future enhancements planned:
- Comments and reactions on posts
- User-to-user messaging
- AI-powered developer recommendations
- GitHub activity integration
- Dark mode

## 🛫 Getting Started

### Prerequisites
- Node.js 18+
- .NET 8.0+
- Docker and Docker Compose
- PostgreSQL (local or Docker)

### Development Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/devverse.git
cd devverse
```
2. Start the database and services using Docker
```bash
docker-compose up -d
```
3. Run the backend (in a new terminal)

```bash
cd backend/DevVerse.API
dotnet run
```
4. Run the frontend (in a new terminal)
```bash
cd devverse-front
npm install
npm run dev
```
5. Access the application at http://localhost:3000

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📃 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌐 Links

* [Project Roadmap](link-to-roadmap)
* [API Documentation](link-to-api-docs)
* [Deployment Guide](link-to-deployment-guide)

---

DevVerse - Connect through code.