# fotd

A minimalist food tracking and habit streak MVP built with React and local storage.

## Features

- Quick meal logging for breakfast, lunch, and dinner
- Optional text notes and image uploads
- Automatic daily completion logic
- Current streak and longest streak tracking
- Monthly calendar with completed and incomplete days
- History timeline for past entries
- Mobile-first, no-login MVP experience

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Build for production:

   ```bash
   npm run build
   ```

## Project structure

```text
fotd/
|-- index.html
|-- package.json
|-- vite.config.js
`-- src/
    |-- App.jsx
    |-- index.css
    |-- main.jsx
    |-- components/
    |   |-- CalendarPanel.jsx
    |   |-- DayDetails.jsx
    |   |-- HistoryList.jsx
    |   |-- QuickAddMealDialog.jsx
    |   `-- StatsCard.jsx
    `-- utils/
        |-- date.js
        |-- storage.js
        `-- streaks.js
```
