# GALXY — Module 10: Site Content / CMS Frontend

This module implements the public-facing client pages for the **GALXY** Custom Lighting & Craft Studio application. It fetches all marketing, about, footer, and contact content from the Member 1 Backend Flask API.

## Design Highlights
- **Dynamic Glow & Flicker Effects**: Modern cosmic aesthetics featuring interactive micro-animations.
- **Scroll Reveals**: Subtle scroll reveals driven by IntersectionObserver (disabled when user prefers reduced motion).
- **Sticky Actions**: A persistent WhatsApp/Instagram contact panel driven dynamically by the API.

## Setup & Running Locally

### 1. Prerequisites
- Node.js (v18+)
- Local backend Flask API (running on port `5000` or defined in environment)

### 2. Environment Variables
Create a `.env` or `.env.local` file in the root directory based on the `.env.example` template:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Installation
Install the project dependencies (including dev ESLint utilities):
```bash
npm install
```

### 4. Running the App
Start the local development server:
```bash
npm run dev
```

### 5. Building & Verification
Compile and build the production-ready Next.js bundle:
```bash
npm run build
```
Run linting checks:
```bash
npm run lint
```