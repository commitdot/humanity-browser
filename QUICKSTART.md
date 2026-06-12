# 🚀 Quick Start Guide - DesignLens Browser

Get up and running with DesignLens Browser in 5 minutes!

## Prerequisites Check

Before you begin, make sure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ npm installed (`npm --version`)
- ✅ OpenAI API key (get one at https://platform.openai.com/api-keys)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd designlens-browser
npm install
```

This will install all required packages including:
- Electron (browser framework)
- React (UI library)
- TypeScript (type safety)
- Vite (build tool)
- Zustand (state management)
- OpenAI SDK (AI capabilities)

### 2. Configure Environment

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
NODE_ENV=development
```

### 3. Build the Main Process

```bash
npm run build:main
```

This compiles the Electron main process TypeScript files.

### 4. Start Development

Open **two terminal windows**:

**Terminal 1** - Start the Vite dev server:
```bash
npm run dev
```

Wait for it to show: `Local: http://localhost:5173/`

**Terminal 2** - Start Electron:
```bash
npm start
```

The DesignLens Browser window should open!

## 🎯 First Steps

### Try These Features:

1. **Browse a Website**
   - Enter a URL in the address bar (e.g., `example.com`)
   - Press Enter to navigate

2. **Open AI Panel**
   - Click the 🤖 button in the bottom-right corner
   - Or it should be open by default on the right side

3. **Analyze a Page** (Coming Soon)
   - Click "🔍 Analyze Page" in the AI Panel
   - Wait for the AI to evaluate the design

4. **Try Multiple Tabs**
   - Click the `+` button in the tab bar
   - Switch between tabs by clicking them
   - Close tabs with the `×` button

## 🐛 Troubleshooting

### Issue: "Cannot find module" errors

**Solution:** Make sure you ran `npm install` and `npm run build:main`

```bash
npm install
npm run build:main
```

### Issue: Electron window doesn't open

**Solution:** Check if Vite dev server is running first

1. Make sure Terminal 1 shows: `Local: http://localhost:5173/`
2. Then start Electron in Terminal 2

### Issue: "OPENAI_API_KEY is not defined"

**Solution:** Check your `.env` file

1. Make sure `.env` exists in the project root
2. Verify the API key is correct (starts with `sk-`)
3. Restart both terminals after changing `.env`

### Issue: Port 5173 already in use

**Solution:** Kill the process or use a different port

```bash
# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or change port in vite.config.ts
server: {
  port: 5174  // Use different port
}
```

## 📝 Development Workflow

### Making Changes

1. **Edit React Components**
   - Files in `src/renderer/` hot-reload automatically
   - Changes appear instantly in the browser

2. **Edit Electron Main Process**
   - Files in `src/main/`
   - Run `npm run build:main` after changes
   - Restart Electron (`Ctrl+C` then `npm start`)

3. **Edit Styles**
   - CSS files hot-reload automatically
   - Changes appear instantly

### Project Structure

```
designlens-browser/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── index.ts            # App initialization
│   │   └── preload.ts          # Bridge to renderer
│   ├── renderer/                # React app
│   │   ├── components/         # UI components
│   │   │   ├── AddressBar.tsx  # URL input
│   │   │   ├── TabBar.tsx      # Tab management
│   │   │   ├── BrowserView.tsx # Web content
│   │   │   └── AIPanel.tsx     # AI features
│   │   ├── hooks/              # React hooks
│   │   │   └── useBrowser.ts   # Browser state
│   │   ├── App.tsx             # Main component
│   │   └── main.tsx            # Entry point
│   └── shared/
│       └── types.ts            # TypeScript types
├── index.html                   # HTML template
├── package.json                 # Dependencies
└── vite.config.ts              # Build config
```

## 🎨 Next Steps

Now that you have the browser running, you can:

1. **Explore the Code**
   - Check out `src/renderer/components/` for UI components
   - Look at `src/renderer/hooks/useBrowser.ts` for state management

2. **Add AI Features**
   - Implement design analysis in `src/renderer/components/AIPanel.tsx`
   - Add OpenAI integration for smart suggestions

3. **Customize the UI**
   - Edit CSS files to change colors and styles
   - Modify components to add new features

4. **Read the Full Plan**
   - Open `ai-design-browser-plan.md` for the complete roadmap
   - Follow the 10-week development plan

## 🆘 Need Help?

- 📖 Read the full [README.md](README.md)
- 📋 Check the [Project Plan](ai-design-browser-plan.md)
- 🐛 Report issues on GitHub
- 💬 Join our Discord community (coming soon)

## ✅ You're Ready!

You now have a working AI-powered browser foundation. Start building amazing features! 🚀

---

**Pro Tip:** Keep both terminal windows open while developing. The Vite server provides hot-reload for instant feedback on your changes.