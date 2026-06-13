# 🛡️ Humanity Browser

The world's first **humanity-first web browser** with rule-based design analysis tools. Protects human creativity while empowering designers with standards-based assistance. Built with Electron, React, and TypeScript.

![Humanity Browser](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![No AI](https://img.shields.io/badge/AI-0%25-success)

## 🎯 Philosophy

**Tools that empower humans, not replace them.**

- ✅ Rule-based analysis (WCAG, W3C standards)
- ✅ Human-controlled improvements
- ✅ Transparent, explainable suggestions
- ✅ Privacy-first (all analysis local)
- ❌ No AI making creative decisions
- ❌ No automatic redesigns
- ❌ No data sent to AI services

## ✨ Features

### 🛡️ Anti-AI Protection
- **AI Content Detection** - Identifies AI-generated content
- **AI Service Blocking** - Blocks 25+ AI services (ChatGPT, Claude, Midjourney, etc.)
- **Tracker Blocking** - Prevents AI scrapers and trackers
- **Transparency Dashboard** - Real-time protection statistics

### 🎨 Human-Assisted Design Tools (Rule-Based)
- **Accessibility Checker** - WCAG 2.1 AA/AAA compliance (no AI)
- **Color Analysis** - Contrast ratios, harmony checker (mathematical)
- **Typography Inspector** - Readability metrics, hierarchy analysis (formulas)
- **Layout Analyzer** - Grid detection, spacing consistency (algorithms)
- **Design Inspector** - Computed styles, structure visualization

### 🔒 Privacy & Control
- **100% Local Analysis** - No cloud APIs, no data collection
- **Transparent Algorithms** - Open source, explainable results
- **Human Control** - You make all decisions
- **No Tracking** - Your browsing stays private

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- **No API keys required!** (Everything runs locally)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/humanity-browser.git
cd humanity-browser
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. In a new terminal, start Electron:
```bash
npm run electron:dev
```

## 🛠️ Development

### Project Structure

```
humanity-browser/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── index.ts             # Main entry point
│   │   └── preload.ts           # Preload script
│   ├── renderer/                # React renderer process
│   │   ├── components/          # React components
│   │   │   ├── HumanityPanel.tsx    # Protection panel
│   │   │   ├── AddressBar.tsx       # URL input
│   │   │   ├── TabBar.tsx           # Tab management
│   │   │   └── BrowserView.tsx      # Web content
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useBrowser.ts        # Browser state
│   │   │   └── useHumanityProtection.ts  # Protection state
│   │   ├── utils/               # Utility functions
│   │   │   ├── aiDetector.ts        # AI detection engine
│   │   │   └── contentBlocker.ts    # Blocking system
│   │   ├── App.tsx              # Main App component
│   │   └── main.tsx             # Renderer entry point
│   └── shared/                  # Shared types and constants
│       ├── types.ts             # TypeScript definitions
│       └── humanityTypes.ts     # Protection types
├── HUMANITY-DESIGN-BROWSER-PLAN.md  # Development roadmap
├── HUMANITY-BROWSER-README.md       # Detailed documentation
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

### Phase 1: Foundation ✅ (COMPLETE)
- [x] Project setup
- [x] Basic browser UI
- [x] Tab management
- [x] Address bar with navigation

### Phase 2: Anti-AI Protection ✅ (COMPLETE)
- [x] AI content detection engine
- [x] AI service blocking system
- [x] Tracker and scraper blocking
- [x] Protection dashboard
- [x] Real-time statistics

### Phase 3: Rule-Based Design Analysis (NEXT)
- [ ] WCAG accessibility checker
- [ ] Color contrast calculator
- [ ] Typography metrics analyzer
- [ ] Layout pattern detector
- [ ] Analysis UI panel

### Phase 4: Human-Assisted Tools
- [ ] Design inspector panel
- [ ] Accessibility dashboard
- [ ] Color tools suite
- [ ] Typography inspector
- [ ] Layout visualizer

### Phase 5: Export & Documentation
- [ ] Export analysis reports
- [ ] Generate accessibility docs
- [ ] Create design guidelines
- [ ] Share color palettes
- [ ] Document findings

### Phase 6: Polish & Release
- [ ] Comprehensive documentation
- [ ] Video tutorials
- [ ] Example gallery
- [ ] Public open-source release

## 🔧 Technical Stack

### Core Technologies
- **Electron** - Cross-platform desktop framework
- **React 18** - UI components
- **TypeScript** - Type safety
- **Zustand** - State management
- **Vite** - Build tool

### Analysis Tools (No AI)
- **axe-core** - Accessibility testing (WCAG rules)
- **Chroma.js** - Color calculations (mathematical)
- **PostCSS** - CSS parsing and analysis
- **css-tree** - CSS structure analysis

### What We DON'T Use
- ❌ OpenAI API
- ❌ Anthropic Claude API
- ❌ TensorFlow.js (for AI)
- ❌ Any AI/ML services

## 🌟 Key Differentiators

| Feature | Traditional Browsers | AI Browsers | Humanity Browser |
|---------|---------------------|-------------|------------------|
| AI Usage | None | Heavy | 0% (Blocked) |
| Privacy | Varies | Poor | Excellent |
| Analysis | None | AI-powered | Rule-based |
| Control | User | AI decides | User |
| Transparency | Limited | Black box | Open source |
| Cost | Free | API fees | Free |
| Offline | Yes | No | Yes |

## 🤝 Contributing

We welcome contributions that align with our humanity-first principles!

### Guidelines
- ✅ Rule-based features welcome
- ✅ Standards-based analysis encouraged
- ✅ Privacy-enhancing features appreciated
- ❌ No AI integration
- ❌ No cloud dependencies
- ❌ No tracking or analytics

### How to Contribute

1. Fork the project
2. Create your feature branch (`git checkout -b feature/HumanFeature`)
3. Commit your changes (`git commit -m 'Add human-empowering feature'`)
4. Push to the branch (`git push origin feature/HumanFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- UI powered by [React](https://reactjs.org/)
- Accessibility testing via [axe-core](https://github.com/dequelabs/axe-core)
- Color analysis with [Chroma.js](https://gka.github.io/chroma.js/)
- State management with [Zustand](https://github.com/pmndrs/zustand)
- Standards from [W3C](https://www.w3.org/) and [WCAG](https://www.w3.org/WAI/WCAG21/quickref/)

## 📚 Documentation

- [Detailed Documentation](HUMANITY-BROWSER-README.md)
- [Development Plan](HUMANITY-DESIGN-BROWSER-PLAN.md)
- [Quick Start Guide](QUICKSTART.md)

## 📧 Contact

Project Link: [https://github.com/yourusername/humanity-browser](https://github.com/yourusername/humanity-browser)

---

**Made with ❤️ by humans, for humans. No AI involved.**

*Protecting human creativity, one website at a time.* 🛡️