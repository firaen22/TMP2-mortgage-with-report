# Property Value Calculator (Renovation Report)

A React application for calculating property value appreciation with a renovation report feature. Built with Vite, React, and TypeScript.

## Features

- **Property Value Calculation**: Estimate future property value based on various parameters.
- **Renovation Report**: Generate and view detailed renovation reports.
- **PDF Export**: Export reports as PDF (using `html2canvas` and `jspdf`).
- **AI Integration**: Uses Google GenAI for intelligent insights (requires API key).

## Getting Started

### Prerequisites

- Node.js (v20 recommended)
- npm

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

### Build

Build the project for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Deployment

This project is configured for automated deployment to GitHub Pages using GitHub Actions.

1. Push changes to the `main` branch.
2. The `.github/workflows/deploy.yml` workflow will automatically run, build, and deploy the application to GitHub Pages.
3. Ensure "GitHub Pages" source is set to "GitHub Actions" in your repository settings > Pages.

## Configuration

- **Environment Variables**:
  - `VITE_GEMINI_API_KEY`: API key for Google Gemini AI. Create a `.env` file in the root directory to set this locally.

## License

[License Name]
