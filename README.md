# 🏥 JanArogya Healthcare App

> **जनआरोग्य** - Digital Healthcare for Rural India

A comprehensive healthcare platform designed specifically for rural communities with voice-first navigation, offline capabilities, and multilingual support.

## ✨ Features

### 🎤 Voice-First Interface
- Multi-language voice navigation (Hindi, English, Punjabi, Bengali)
- Voice-driven symptom reporting
- Offline speech synthesis
- Voice-activated emergency SOS

### 📱 Progressive Web App (PWA)
- Install on any device
- Works completely offline
- Background sync when online
- Push notifications for emergencies
- App shortcuts for quick access

### 🌐 Multilingual Support
- **English** - Full interface
- **हिंदी (Hindi)** - Complete translation
- **ਪੰਜਾਬੀ (Punjabi)** - Complete translation  
- **বাংলা (Bengali)** - Complete translation

### 🏥 Healthcare Modules
- **Patient Portal** - Health records, appointments, telemedicine
- **Doctor Portal** - Patient management, consultations, prescriptions
- **Health Worker Portal** - Community health tracking, field reports
- **Pharmacy Portal** - Medicine inventory, prescription management
- **Admin Dashboard** - System analytics, user management

### 🚨 Emergency Features
- One-touch SOS with location sharing
- Offline emergency contact storage
- Voice-activated emergency calls
- Integration with local emergency services

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/janarogya-healthcare-app.git

# Navigate to project directory
cd janarogya-healthcare-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **UI Components**: Radix UI, shadcn/ui
- **PWA**: Workbox, Web App Manifest
- **Charts**: Recharts
- **Voice**: Web Speech API
- **Deployment**: Vercel

## 📱 PWA Installation

### Chrome Desktop
1. Visit the app URL
2. Click the install icon in address bar
3. Click "Install"

### Mobile Browsers
1. Open in Chrome/Safari
2. Add to Home Screen
3. App installs like native app

## 🗣️ Voice Commands

### Navigation
- "होम जाएं" / "Go home"
- "मरीज़ पोर्टल" / "Patient portal"
- "डॉक्टर से मिलें" / "Doctor portal"
- "आपातकाल" / "Emergency"

### Actions  
- "नई अपॉइंटमेंट" / "New appointment"
- "दवाई रिमाइंडर" / "Medicine reminder"
- "स्वास्थ्य रिपोर्ट" / "Health report"

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Header.tsx      # App header
│   ├── Footer.tsx      # App footer
│   └── ...
├── utils/              # Utility functions
│   └── offline/        # Offline functionality
├── App.tsx             # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Environment Variables

```bash
# Optional - for enhanced features
VITE_GOOGLE_MAPS_API_KEY=your_api_key
VITE_FIREBASE_CONFIG=your_firebase_config
```

## 🌍 Localization

The app supports 4 languages with complete translations:

- All UI text translated
- Voice commands in local languages
- Right-to-left text support
- Cultural adaptations for healthcare terminology

## 🔒 Privacy & Security

- All health data stored locally
- No tracking or analytics by default
- HIPAA-compliant data handling
- Encrypted offline storage
- User consent for all data collection

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Ensure mobile-first responsive design
- Test voice features across browsers
- Maintain offline functionality
- Add translations for new text

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Radix UI](https://www.radix-ui.com/) - Headless UI primitives  
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Recharts](https://recharts.org/) - React chart library
- Rural healthcare workers who provided insights

## 📞 Support

For support and questions:
- 📧 Email: support@janarogya.health
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/janarogya-healthcare-app/issues)
- 📖 Docs: [Documentation](https://docs.janarogya.health)

## 🎯 Roadmap

- [ ] AI-powered symptom analysis
- [ ] Integration with government health systems  
- [ ] Telemedicine video calls
- [ ] Medicine delivery integration
- [ ] Health insurance integration
- [ ] Community health analytics
- [ ] Advanced offline sync

---

**Made with ❤️ for rural healthcare accessibility**

*जनआरोग्य - सबके लिए स्वास्थ्य सेवा*
