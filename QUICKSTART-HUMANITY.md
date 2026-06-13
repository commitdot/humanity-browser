# 🚀 Quick Start: Humanity Browser

## What Is This?

**Humanity Browser** is the world's first humanity-first web browser that:
- 🛡️ Blocks AI services and detects AI content
- 🎨 Provides rule-based design analysis tools (no AI)
- 🔒 Keeps all analysis local (100% privacy)
- 👨‍💻 Empowers humans, never replaces them

## Quick Setup (5 Minutes)

### 1. Install Dependencies
```bash
cd designlens-browser
npm install
```

### 2. Start Development
```bash
# Terminal 1: Start Vite dev server
npm run dev

# Terminal 2: Start Electron
npm run electron:dev
```

### 3. Start Browsing!
The browser will open automatically. Try visiting any website to see:
- AI content detection in action
- Protection statistics
- Real-time blocking

## Current Features (v0.1.0)

### ✅ Working Now
1. **Browser Foundation**
   - Multi-tab browsing
   - Address bar with navigation
   - Back/forward/reload buttons
   - Tab management

2. **Anti-AI Protection**
   - Detects AI-generated content
   - Blocks 25+ AI services (ChatGPT, Claude, Midjourney, etc.)
   - Blocks trackers and scrapers
   - Real-time protection statistics

3. **Humanity Panel**
   - Protection status dashboard
   - Detection results
   - Blocking statistics
   - Configuration settings

### 🔜 Coming Soon
1. **Rule-Based Design Analysis**
   - WCAG accessibility checker
   - Color contrast calculator
   - Typography metrics
   - Layout analyzer

2. **Human-Assisted Tools**
   - Design inspector
   - Accessibility dashboard
   - Color tools suite
   - Typography inspector

## Key Differences from Original Plan

| Original (AI-Powered) | Current (Humanity-First) |
|----------------------|-------------------------|
| AI analyzes designs | Rules analyze designs |
| AI makes decisions | Humans make decisions |
| Sends data to APIs | Everything local |
| Costs money (APIs) | Completely free |
| Black box AI | Transparent rules |

## Project Structure

```
designlens-browser/
├── src/
│   ├── main/                          # Electron main process
│   ├── renderer/                      # React UI
│   │   ├── components/
│   │   │   ├── HumanityPanel.tsx     # Protection dashboard
│   │   │   ├── AddressBar.tsx        # URL bar
│   │   │   ├── TabBar.tsx            # Tabs
│   │   │   └── BrowserView.tsx       # Web content
│   │   ├── utils/
│   │   │   ├── aiDetector.ts         # AI detection
│   │   │   └── contentBlocker.ts     # Blocking system
│   │   └── hooks/
│   │       └── useHumanityProtection.ts  # Protection state
│   └── shared/
│       └── humanityTypes.ts           # Type definitions
├── HUMANITY-DESIGN-BROWSER-PLAN.md    # Development roadmap
├── PROJECT-TRANSFORMATION.md          # Change history
└── README.md                          # Main documentation
```

## Development Workflow

### Making Changes
1. Edit files in `src/`
2. Vite hot-reloads automatically
3. For main process changes, restart Electron

### Adding Features
1. Check `HUMANITY-DESIGN-BROWSER-PLAN.md` for roadmap
2. Follow humanity-first principles:
   - ✅ Rule-based analysis
   - ✅ Human control
   - ✅ Local processing
   - ❌ No AI
   - ❌ No cloud APIs
   - ❌ No tracking

### Testing
```bash
# Run the browser
npm run electron:dev

# Build for production
npm run build
npm run electron:build
```

## Key Files to Know

### Protection System
- `src/renderer/utils/aiDetector.ts` - Detects AI content
- `src/renderer/utils/contentBlocker.ts` - Blocks AI services
- `src/shared/humanityTypes.ts` - Type definitions

### UI Components
- `src/renderer/components/HumanityPanel.tsx` - Main protection UI
- `src/renderer/App.tsx` - Main application
- `src/renderer/hooks/useHumanityProtection.ts` - State management

### Configuration
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript settings

## Common Tasks

### Add a New AI Service to Block
Edit `src/shared/humanityTypes.ts`:
```typescript
export const AI_SERVICE_DOMAINS = [
  // ... existing domains
  'newaiservice.com',
];
```

### Modify Protection Settings
Edit `src/renderer/hooks/useHumanityProtection.ts`:
```typescript
const defaultConfig: HumanityConfig = {
  protectionLevel: 'standard', // or 'strict', 'relaxed'
  blockAIServices: true,
  // ... other settings
};
```

### Add Detection Patterns
Edit `src/renderer/utils/aiDetector.ts`:
```typescript
const AI_TEXT_PATTERNS = [
  // ... existing patterns
  /new ai pattern/i,
];
```

## Philosophy Reminders

### ✅ DO
- Use web standards (WCAG, W3C)
- Provide transparent analysis
- Let humans make decisions
- Keep everything local
- Explain all suggestions

### ❌ DON'T
- Use AI for analysis
- Send data to cloud APIs
- Make automatic changes
- Replace human judgment
- Hide how things work

## Next Steps

1. **Explore the Code**
   - Read `HUMANITY-DESIGN-BROWSER-PLAN.md`
   - Check `PROJECT-TRANSFORMATION.md`
   - Review protection system files

2. **Try the Browser**
   - Visit AI service websites (they'll be blocked)
   - Check the Humanity Panel
   - Test different protection levels

3. **Contribute**
   - Pick a feature from the roadmap
   - Follow humanity-first principles
   - Submit a pull request

## Resources

- **Main Docs**: `README.md`
- **Roadmap**: `HUMANITY-DESIGN-BROWSER-PLAN.md`
- **Detailed Guide**: `HUMANITY-BROWSER-README.md`
- **Change History**: `PROJECT-TRANSFORMATION.md`

## Getting Help

- Check existing documentation
- Review code comments
- Look at similar implementations
- Ask in discussions (when repo is public)

## Building for Production

```bash
# Build everything
npm run build
npm run build:main
npm run electron:build

# Output will be in release/ directory
```

## What Makes This Special?

1. **First Anti-AI Browser** - Unique in the market
2. **100% Local** - No cloud dependencies
3. **Rule-Based** - Transparent and explainable
4. **Human-First** - Empowers, never replaces
5. **Open Source** - Community-driven

---

**Welcome to the humanity-first movement!** 🛡️

*Building tools that empower humans, not replace them.*