# Budget Tracker

A responsive personal budget dashboard for tracking monthly income, savings goals, and expenses. The application calculates the current balance, shows how much of the income has been spent, and presents expense data by category.

[Open the live application](https://petra-poliakova.github.io/budget-tracker/)

## Features

- Set a monthly income and savings goal
- Add expenses with a category, name, and amount
- Remove expenses with a confirmation step
- View monthly income, expenses, balance, and remaining money after savings
- Monitor budget and reserve usage with progress indicators
- Compare spending across categories
- Explore visual reports with pie, gauge, and bar charts
- Keep entered data between visits using browser local storage
- Use the application comfortably on desktop and mobile screens

## Technologies

- React 19
- TypeScript
- Vite
- Material UI and MUI X Charts
- React Router
- Vitest and Testing Library
- GitHub Actions and GitHub Pages

## Getting Started

### Requirements

- Node.js (a current LTS version is recommended)
- npm

### Installation

```bash
git clone https://github.com/Petra-Poliakova/budget-tracker.git
cd budget-tracker
npm install
npm run dev
```

Vite will print the local development address in the terminal, usually `http://localhost:5173`.

## Available Scripts

```bash
npm run dev       # Start the development server
npm run build     # Type-check and create a production build
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
npm run test      # Run tests in watch mode
npm run coverage  # Run tests and generate a coverage report
```

## Data Storage

Budget data is stored in the browser's `localStorage`. The application does not require an account or a backend, and the data is not synchronized between browsers or devices. Clearing browser storage also removes the saved budget.