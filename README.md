# VibeTalk 💬

A modern, real-time 1:1 chat web application built with React.js and Node.js. VibeTalk provides a seamless messaging experience with features like real-time messaging, typing indicators, online/offline status, message read receipts, and a beautiful Telegram-inspired UI.

![VibeTalk Screenshot](https://via.placeholder.com/800x400/2563eb/ffffff?text=VibeTalk+Chat+Interface)

## ✨ Features

### 🚀 Core Features
- **Real-time Messaging** - Instant message delivery using Socket.IO
- **User Authentication** - Secure JWT-based login and registration
- **Online/Offline Status** - Live user presence indicators
- **Typing Indicators** - See when someone is typing
- **Message Status** - Delivery and read receipts (✓ sent, ✓✓ read)
- **Responsive Design** - Seamless experience on desktop and mobile

### 🎨 UI/UX Features
- **Modern Design** - Telegram-inspired clean interface
- **Dark/Light Mode** - Theme toggle with persistence
- **Smooth Animations** - Polished transitions and effects
- **Custom Chat Bubbles** - Styled message containers
- **Emoji Support** - Rich text messaging
- **Search Users** - Quick user discovery

### 📱 Technical Features
- **PWA Ready** - Progressive Web App capabilities
- **Real-time Updates** - Live message synchronization
- **Offline Support** - Graceful degradation
- **Performance Optimized** - Lazy loading and code splitting

## 🛠 Tech Stack

### Frontend
- **React.js 18** - Modern React with hooks
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Socket.IO Client** - Real-time communication
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

### Backend (Coming Soon)
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

## 📁 Project Structure

```
VibeTalk/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── UserList.jsx
│   │   │   └── ChatScreen.jsx
│   │   ├── contexts/       # React contexts
│   │   │   ├── AuthContext.jsx
│   │   │   ├── SocketContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Home.jsx
│   │   ├── lib/
│   │   │   └── utils.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/                 # Node.js backend (Coming Soon)
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vibetalk.git
   cd vibetalk
   ```

2. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Environment Setup

Create a `.env` file in the client directory:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 📋 Available Scripts

In the client directory, you can run:

### `npm start`
Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`
Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm test`
Launches the test runner in the interactive watch mode.

## 🎮 Demo Accounts

For testing purposes, you can use these demo accounts:

| Email | Password | User |
|-------|----------|------|
| john@example.com | password123 | John Doe |
| jane@example.com | password123 | Jane Smith |
| alice@example.com | password123 | Alice Johnson |
| bob@example.com | password123 | Bob Wilson |

## 🚧 Current Status

### ✅ Completed Features (Frontend)
- [x] User authentication UI (Login/Register)
- [x] Responsive chat interface
- [x] User list with online indicators
- [x] Chat screen with message bubbles
- [x] Typing indicators UI
- [x] Message status indicators
- [x] Dark/light mode toggle
- [x] Modern UI with shadcn/ui components
- [x] Socket.IO client integration
- [x] Context-based state management

### 🔄 In Progress
- [ ] Backend API development
- [ ] Database schema implementation
- [ ] Socket.IO server setup
- [ ] Real message persistence

### 📅 Upcoming Features
- [ ] File/image sharing
- [ ] Voice messages
- [ ] Push notifications
- [ ] Group chat support
- [ ] Message search
- [ ] Chat backup/export

## 🎨 UI Components

The project uses shadcn/ui components for a consistent, modern design:

- **Avatar** - User profile pictures with fallbacks
- **Button** - Various button styles and sizes
- **Card** - Container components for content
- **Input** - Form input fields
- **ScrollArea** - Custom scrollable areas
- **Switch** - Toggle switches for settings
- **Badge** - Status and notification badges

## 🔧 Customization

### Styling
The app uses TailwindCSS for styling. You can customize the theme in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      // Add your custom colors
    }
  }
}
```

### Components
All UI components are located in `src/components/ui/` and can be customized or replaced as needed.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the icon library
- [Socket.IO](https://socket.io/) for real-time communication

## 📞 Support

If you have any questions or need help, please feel free to:
- Open an issue on GitHub
- Contact us at support@vibetalk.app

---

Made with ❤️ by the VibeTalk Team
