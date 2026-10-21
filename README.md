# Black Entrepreneur Service Provider Directory (LSU & Baton Rouge)

A clean, modern web directory celebrating and connecting students, faculty, and residents with **Black-owned service providers within a 25-mile radius of Louisiana State University (LSU)** in Baton Rouge, Louisiana.

---

## 🌟 Project Philosophy: Zero Build Tools Needed

This project is intentionally built using **pure Vanilla Web Technologies** (HTML5, CSS3, and JavaScript ES Modules) with **Tailwind CSS loaded via CDN**:

- **No Node.js, npm, Vite, or Webpack required** – designed specifically to work smoothly in school and university computer lab environments where Node.js installation or package downloads are blocked.
- **Pure JavaScript ES Modules** (`<script type="module">`) – enables clean code separation with `import` and `export` statements without compiling or bundling.
- **Tailwind CSS CDN** – utility-first CSS styling on the fly directly in the browser.

---

## 📁 Project Structure

```text
Black Entre SIte/
├── index.html              # Main webpage with Tailwind CDN and LSU theme
├── css/
│   └── styles.css          # Custom CSS styles, LSU theme variables, and animations
├── js/
│   ├── app.js              # Root ES Module entry point
│   ├── components/         # Reusable UI component renderers
│   │   └── serviceCard.js  # Starter card component function
│   ├── data/               # Local directory database
│   │   └── directoryData.js# Directory categories & provider records
│   └── utils/              # Helper utilities
│       └── distance.js     # LSU campus coordinates & Haversine distance math
├── .gitignore              # Files and folders ignored by Git
└── README.md               # Project documentation & setup instructions
```

---

## 🚀 How to Preview Locally

> **⚠️ IMPORTANT BEGINNER NOTE ON ES MODULES:**  
> Because this project uses modern JavaScript ES Modules (`import` / `export`), modern web browsers enforce security (CORS) rules that **block imports if you just double-click `index.html` from File Explorer** (which opens a `file:///` URL).  
> You must preview the site through a **local HTTP server** (which opens `http://localhost:...`). Here are the easiest ways to do this:

### Option 1: Using the Live Server Extension in Antigravity (Recommended)

1. In Antigravity IDE, open the **Extensions** panel on the left sidebar (or press `Ctrl + Shift + X`).
2. Search for **Live Server** (by *Ritwick Dey*) and click **Install**.
3. Once installed, right-click `index.html` in the file explorer and select **"Open with Live Server"** (or click the **"Go Live"** button on the bottom status bar).
4. Your browser will automatically open:
   ```text
   http://127.0.0.1:5500/index.html
   ```
5. Any time you make edits and save, your browser will refresh automatically!

---

### Option 2: Using Built-in Python Server (No Extensions Required)

Python 3 is already installed on your machine! You can start a local server anytime in one command:

1. Open the integrated terminal in Antigravity (`Ctrl + ` `~` or **Terminal > New Terminal**).
2. Run this command:
   ```powershell
   python -m http.server 3000
   ```
3. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```
4. To stop the server when you are done, press `Ctrl + C` in the terminal.

---

## 🐯 LSU Brand Palette Reference

- **LSU Purple**: `#461D7C`
- **LSU Gold**: `#FDD023`
- **Coordinates**: Latitude `30.4133° N`, Longitude `91.1800° W` (LSU Memorial Tower)

---

## 🛠️ Next Steps

When you're ready to start building features:
1. Populate business listings in `js/data/directoryData.js`.
2. Connect search and category filters in `js/app.js`.
3. Render directory cards dynamically on the page using `js/components/serviceCard.js`.
