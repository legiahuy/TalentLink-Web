# TalentLink Web Frontend

A React + TypeScript + Vite web application with Tailwind CSS v4.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd TalentLink-FrontEnd

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev

# Open http://localhost:5173
```

### Build & Preview

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
TalentLink-FrontEnd/
├── public/                 # Static assets
├── src/
│   ├── components/        # Shared/common components
│   ├── features/          # Feature-specific components
│   ├── hooks/            # Custom React hooks
│   ├── layouts/          # Layout components
│   ├── pages/            # Page components
│   ├── assets/           # Images, icons, etc.
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # App entry point
│   └── index.css         # Global styles
├── package.json
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
