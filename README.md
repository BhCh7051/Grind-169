# Grind 169 - LeetCode Practice Tracker

A clean, modern LeetCode practice tracker featuring 169 essential coding interview questions curated by the creator of Blind 75.

## 🚀 Quick Start

The project is ready to deploy on GitHub Pages! All files are consolidated in the `docs/` folder.

**🌐 Live Site:** [https://BhCh7051.github.io/Grind-169/](https://BhCh7051.github.io/Grind-169/)

**📦 Repository:** [https://github.com/BhCh7051/Grind-169](https://github.com/BhCh7051/Grind-169)

## 📁 Project Structure

```
.
├── docs/
│   ├── index.html      # Main HTML file
│   ├── css/
│   │   └── style.css   # All styles
│   ├── js/
│   │   ├── data.js     # Question data (169 questions)
│   │   └── script.js   # Main application logic
│   └── README.md       # Documentation
└── README.md           # This file
```

## 🌐 Deploy to GitHub Pages

### Option 1: Using the `docs` folder (Recommended)

1. Push this repository to GitHub
2. Go to your repository **Settings** → **Pages**
3. Under **Source**, select:
   - Branch: `main` (or `master`)
   - Folder: `/docs`
4. Click **Save**
5. Your site will be live at: [https://BhCh7051.github.io/Grind-169/](https://BhCh7051.github.io/Grind-169/)

### Option 2: Deploy from root

If you prefer to deploy from the root directory:

1. Move all files from `docs/` to the root directory
2. In GitHub Pages settings, select the root folder instead of `/docs`

## ✨ Features

-   ✅ **Progress Tracking** - Mark questions as complete and track your progress
-   🔄 **Retry Counter** - Keep track of questions that need more practice
-   📝 **Personal Notes** - Add notes to each question for future reference
-   🎯 **Smart Filtering** - Filter by completion status or questions to retry
-   🏷️ **Topic Tags** - Toggle visibility of question topics
-   💾 **Local Storage** - Your progress is saved automatically in your browser

## 🛠️ Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/BhCh7051/Grind-169.git
   cd Grind-169
   ```

2. Open `docs/index.html` in your browser, or use a local server:
   ```bash
   # Using Python
   cd docs
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server docs
   ```

3. Visit `http://localhost:8000` in your browser

## 📚 Question List

All 169 questions are based on the "All Rounded" order from [Tech Interview Handbook](https://www.techinterviewhandbook.org/grind75/), optimized for comprehensive interview preparation.

## 🛠️ Technologies Used

-   HTML5
-   CSS3 (Tailwind-inspired utility classes)
-   Vanilla JavaScript
-   Local Storage API

## 📝 Credits

Based on the Grind 75 list by the creator of Blind 75.

## 📄 License

This project is open source and available for personal use.

