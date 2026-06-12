# 🎨 DesignLens Browser

An AI-powered web browser specialized for design analysis and automatic website redesign. Built with Electron, React, and TypeScript.

![DesignLens Browser](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🤖 **AI Design Analysis** - Real-time evaluation of website design quality
- 🎨 **Automatic Redesign** - One-click website improvements with multiple style presets
- 🌈 **Smart Color Tools** - AI-generated harmonious color schemes
- 📐 **Layout Optimizer** - Intelligent spacing and grid improvements
- 🔤 **Typography Engine** - Font pairing and readability optimization
- ♿ **Accessibility First** - WCAG compliance checking and fixes
- 📤 **Export Features** - CSS export, design reports, shareable mockups

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- OpenAI API key (or Anthropic Claude API key)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/designlens-browser.git
cd designlens-browser
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

5. In a new terminal, start Electron:
```bash
npm run electron:dev
```

## 🛠️ Development

### Project Structure

```
designlens-browser/
├── src/
│   ├── main/              # Electron main process
│   │   ├── index.ts       # Main entry point
│   │   └── preload.ts     # Preload script
│   ├── renderer/          # React renderer process
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   ├── App.tsx        # Main App component
│   │   └── main.tsx       # Renderer entry point
│   └── shared/            # Shared types and constants
│       └── types.ts       # TypeScript definitions
├── public/                # Static assets
├── dist/                  # Build output
└── package.json
```

### Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run build:main` - Build Electron main process
- `npm run electron:dev` - Start Electron in development mode
- `npm run electron:build` - Build Electron app for distribution
- `npm start` - Start the built Electron app

## 🎯 Roadmap

### Phase 1: Foundation ✅
- [x] Project setup
- [x] Basic browser UI
- [x] Tab management
- [x] Address bar with navigation

### Phase 2: Design Analysis (In Progress)
- [ ] DOM inspection system
- [ ] CSS extraction pipeline
- [ ] AI integration for analysis
- [ ] Design scoring algorithm

### Phase 3: Color Intelligence
- [ ] Color palette extraction
- [ ] Harmony analyzer
- [ ] Contrast checker
- [ ] AI color scheme generator

### Phase 4: Layout Optimizer
- [ ] Layout detection
- [ ] Spacing analyzer
- [ ] Grid system optimizer
- [ ] Responsive design checker

### Phase 5: Typography Engine
- [ ] Font detection
- [ ] Readability analyzer
- [ ] Font pairing AI
- [ ] Text hierarchy optimizer

### Phase 6: Redesign System
- [ ] CSS injection system
- [ ] Before/after comparison
- [ ] Design style presets
- [ ] Undo/redo functionality

### Phase 7: Export & Polish
- [ ] CSS export
- [ ] Design report generator
- [ ] Screenshot capture
- [ ] Sharing system

### Phase 8: Documentation & Release
- [ ] Comprehensive documentation
- [ ] Video tutorials
- [ ] Example gallery
- [ ] Public release

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

- Built with [Electron](https://www.electronjs.org/)
- UI powered by [React](https://reactjs.org/)
- AI capabilities via [OpenAI](https://openai.com/)
- State management with [Zustand](https://github.com/pmndrs/zustand)

## 📧 Contact

Project Link: [https://github.com/yourusername/designlens-browser](https://github.com/yourusername/designlens-browser)

---

Made with ❤️ by the DesignLens Team