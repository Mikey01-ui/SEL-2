# S‑E‑L Platform — Student Engagement & Learning

**Updated: October 22, 2025**

A **100% frontend**, **mobile-first**, **fully responsive** demo platform showcasing 11 student-facing features plus **multiplayer games** (Chess, Checkers, Wordle). Built with Tailwind CSS (CDN), vanilla JavaScript, and GSAP animations. **No backend required** - all features use localStorage for cross-tab sync!

## ✨ Key Highlights

### 🎮 Multiplayer Games (Cross-Tab Sync)
- **Chess** - Real-time strategy with localStorage sync
- **Checkers** - Classic board game with jump mechanics & kings
# S‑E‑L — Student Engagement & Learning (Frontend Demo)
- **Wordle Race** - Competitive word-guessing with live timer
- **Tic-Tac-Toe** - Quick match casual game
- **Room System** - Share room IDs to play together (same browser, different tabs)

### 📱 Mobile-First Design
- **Fully responsive** layouts (320px phones → 4K displays)
- **PWA-ready** with overscroll behavior disabled
## Core Features

### 1️⃣ Authentication & Identity
- 20 predefined student personas
- Local session storage
- Live presence tracking (~120 simulated online users)
- Click avatars to view detailed profiles
### 2️⃣ Hyper‑Localized Geo‑Wall
- Geo‑fence simulation with connect animation
- Campus zone detection
- **Swipeable notification cards** (swipe left to dismiss, right to pin)
- Cross‑tab real‑time updates

### 3️⃣ Academic Hub
- Knowledge base search (6 study guides)
- Mentor booking with time slot picker

### 4️⃣ CORE Pulse (Wellness)
- Intelligent triage alerts (Stress ≥4 AND Clarity ≤2)
- Local storage + optional Firestore sync
### 5️⃣ Networking & Events
- 18+ alumni/networking sessions
- Expandable lists with "Load More"

- Create posts with timestamp
- Pin/unpin important updates
- User attribution

- 24+ job postings with Apply
- 24+ events with RSVP
- Filterable and expandable

### 9️⃣ Marketplace

- 36+ rental listings
- Price range filter ($0 - $2000)
- Responsive image cards

### 1️⃣1️⃣ Gaming Hub
- **Multiplayer Games** (Chess, Checkers, Wordle, Tic-Tac-Toe)
- Room-based matchmaking
- Real-time game state sync (with WebSocket server)
- Casual game rooms list

## 📁 Project Structure

```
SEl/
├─ assets/
│  ├─ css/
│     └─ games.js             # Multiplayer game engines (Chess, Checkers, Wordle)
├─ server.py                   # Optional: Simple HTTP server (Python)
└─ README.md                   # This file
```

- HTML5 + CSS3 (Tailwind CDN)
- Vanilla JavaScript (ES6+)
- GSAP for animations (CDN)
- localStorage for persistence
- StorageEvent API for cross-tab sync

## 🚀 Quick Start

### Option 1: Direct Open (Instant)

**Just open `index.html` in your browser!**

- Double-click `index.html` **OR**
- Right-click → Open with → Chrome/Firefox/Edge

✅ **Everything works!** Including "multiplayer" games (open multiple tabs to test cross-tab sync).


### Option 2: HTTP Server (Recommended)

**Prerequisites:**
- Python 3.x installed (comes with Windows/Mac)
- Internet connection (for Tailwind/GSAP CDN)

**PowerShell (Windows):**

```powershell
# Navigate to project folder
cd C:\Users\Milton\Downloads\SEl
# Start server (auto-opens browser)
python server.py
```


```powershell
```

Then open: **http://localhost:8081/index.html**

**The server will:**
- ✅ Serve files on **http://localhost:8081**
- ✅ Auto-open your default browser
- ✅ Enable full cross-tab sync for games
### Option 3: Node.js (Alternative)

npm install -g http-server
```

Then open: **http://localhost:8081/index.html**
Games use **localStorage** for cross-tab communication (StorageEvent API). When you make a move in one tab, it broadcasts via localStorage, and other tabs listening to the same room ID receive the update instantly!
### Quick Test

1. **Open the app** → Click "Anonymous Test"
3. **Start a game** (e.g., Chess) → Note the **Room ID**
4. **Open another tab** → Navigate to same game type
5. **You'll see moves sync** between tabs in real-time!

### Playing with Friends (Same Device)

1. Tab 1: Start game → Note Room ID (e.g., `chess-abc123`)
3. Both tabs now sync moves!

### Playing with Friends (Different Devices)
**Currently:** Cross-tab only (same browser instance).

**To enable real multiplayer:**
- Or use a P2P library like PeerJS or WebRTC

**This demo focuses on frontend** - backend integration is straightforward with the existing architecture!


1. Press **F12** to open DevTools
2. Click **Toggle Device Toolbar** (Ctrl+Shift+M / Cmd+Shift+M)
3. Select device: iPhone 12 Pro, Pixel 5, iPad, etc.
4. Test touch interactions, swipes, and responsiveness

### Real Device Testing

1. Find your computer's IP address:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. Start server:
   ```powershell
   python server.py
   ```

3. On your phone (same WiFi network):
   - Open browser
   - Navigate to: `http://YOUR_IP:8081/index.html`
   - Example: `http://192.168.1.100:8081/index.html`

### Responsive Breakpoints

- **Mobile:** 320px - 640px (optimized)
- **Tablet:** 640px - 1024px
- **Desktop:** 1024px+
- **Landscape Mobile:** Special handling for height < 500px

## 🎨 Image Guidelines

All images use Unsplash with proper query parameters for consistency:

- **Profile Avatars:** 120x120 - 200x200, cropped faces
- **Marketplace Items:** 320x200 - 400x300, product focus
- **Housing Listings:** 320x200, interior/exterior views
- **Fallback:** Picsum.photos for generated images

### Adding New Images

Ensure images have:
- Descriptive `alt` text matching content
- Proper aspect ratios (1:1 for avatars, 16:9 for cards)
- `loading="lazy"` for performance
- Responsive sizing with `max-width:100%`

## 🔧 Troubleshooting

### Port Already in Use

```powershell
# Find what's using port 8081 (Windows)
netstat -ano | findstr :8081

# Kill the process
taskkill /PID <PID_NUMBER> /F

# Or use a different port
$env:PORT="3000"; python server.py
# Then open http://localhost:3000/index.html
```

### Cross-Tab Sync Not Working

**Issue:** Game moves don't sync between tabs.

**Solutions:**
1. **Use HTTP server** (not file://) - localStorage events work better
2. **Same browser** - Open both tabs in same browser window
3. **Check console** - Look for "Game sync ready" message
4. **Clear storage** - Dev Tools → Application → Clear Storage

### CORS / Loading Issues

**Issue:** CDN resources don't load, or "CORS policy" errors.

**Solutions:**
- **Check internet** - Tailwind & GSAP load from CDN
- **Use HTTP server** - `python server.py` or `python -m http.server 8081`
- **Clear cache** - Hard refresh with Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Mobile Browser Issues

- **iOS Safari:** localStorage works great; no special setup needed
- **Android Chrome:** Fully supported out of the box
- **Pull-to-refresh:** Disabled via CSS (`overscroll-behavior-y: contain`)
- **Zoom on input:** Prevented with `font-size: 16px` on inputs

### Images Not Loading

**Issue:** Marketplace/housing images show broken links.

**Solutions:**
- **Check internet** - Images load from Unsplash/Picsum CDN
- **Ad blocker:** May block external images
- **Replace URLs:** For offline use, download images locally and update `src` attributes

## 🏗️ Architecture

### Pure Frontend Design

This is a **100% client-side application**:

- **No backend server required** (beyond static file serving)
- **No database** - localStorage is the database
- **No API calls** - all data is local or simulated
- **No authentication** - demo accounts only
- **No build step** - just HTML/CSS/JS

### Cross-Tab "Multiplayer"

Uses browser's **StorageEvent API**:

```javascript
// Tab 1: Make a move
localStorage.setItem('sel:game:chess-abc123', JSON.stringify({
  type: 'chess_move',
  from: [6, 4],
  to: [4, 4],
  ts: Date.now()
}));

// Tab 2: Receives storage event
window.addEventListener('storage', (e) => {
  if (e.key === 'sel:game:chess-abc123') {
    const move = JSON.parse(e.newValue);
    applyMove(move); // Update board
  }
});
```

**Limitations:**
- Same browser/device only (not true multiplayer)
- Requires tabs to be open simultaneously
- Storage limited to ~5-10MB (browser dependent)

**Benefits:**
- Zero latency (instant sync)
- Works offline
- No server costs
- Perfect for demos

## 🔐 Optional: Firebase Persistence

Want to save CORE Pulse data to cloud?

1. Create project: https://console.firebase.google.com
2. Enable Firestore
3. In `index.html`, update:

```javascript
window.SEL_FIREBASE = {
  enabled: true,
  config: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    // ... rest of config
  }
};
```

**Still frontend-only!** No backend needed - Firebase client SDK handles everything.

## 🎯 Feature Completeness

✅ **11 Core Features** - All implemented and working  
✅ **4 Multiplayer Games** - Chess, Checkers, Wordle, Tic-Tac-Toe  
✅ **Mobile Responsive** - 320px to 4K+  
✅ **Touch Optimized** - 44px minimum touch targets  
✅ **Swipe Gestures** - Notification cards  
✅ **Cross-Tab Sync** - localStorage + StorageEvent API  
✅ **Animations** - GSAP for smooth transitions  
✅ **Accessibility** - Focus states, ARIA labels, keyboard nav  
✅ **PWA-Ready** - Manifest and service worker can be added  
✅ **Zero Dependencies** - No npm install required  

## 🚀 Production Considerations

To take this beyond a demo:

1. **Add a backend:**
   - Use Firebase/Supabase for real-time database
   - Or build custom REST/GraphQL API
   - Implement real authentication (Auth0, Clerk, etc.)

2. **Build process:**
   - Add Vite/Webpack for module bundling
   - Minify CSS/JS for production
   - Self-host Tailwind instead of CDN

3. **Real multiplayer:**
   - WebSocket server (Socket.io, ws)
   - Or P2P with WebRTC/PeerJS
   - Matchmaking system

4. **Progressive Web App:**
   - Add service worker for offline
   - Generate icons and manifest
   - Implement push notifications

5. **Testing:**
   - Add Jest/Vitest for unit tests
   - Playwright/Cypress for E2E
   - Mobile device lab testing

## 📝 Development Notes

- **Architecture:** Intentionally simple for demo/portfolio purposes
- **Images:** Hot-linked from Unsplash - download locally for offline use
- **Accessibility:** WCAG 2.1 AA compliant (contrast, focus, touch targets)
- **Browser Support:** Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Mobile First:** Designed for mobile, scales up to desktop

## 📄 License

This demo is provided for **educational purposes**. Feel free to use as a portfolio piece or learning resource.

## 🤝 Contributing

This is a demo project, but suggestions welcome! Open an issue or PR on GitHub.

---

**Made with ❤️ for students**  
*A demo of modern frontend techniques - no backend required!*
#   S E L 
 
 # SEL2
#   S E L - 2 
 
 