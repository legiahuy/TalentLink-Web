# TalentLink Frontend

A monorepo containing React Native mobile app and React web app built with Vite.

## Getting Started

### Installation

Install dependencies from the root directory:

```bash
pnpm install
```

### Running the Web App

```bash
cd talent-link/apps/web
pnpm dev
# or from root
pnpm --filter web dev
```

The web app will be available at `http://localhost:5173`

### Running the Mobile App

#### Prerequisites

Make sure you have completed the [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment).

#### Start Metro bundler:

```bash
cd talent-link/apps/mobile
pnpm start
# or from root
pnpm --filter mobile start
```

#### Run on Android:

```bash
cd talent-link/apps/mobile
pnpm android
# or from root
pnpm --filter mobile android
```

#### Run on iOS:

```bash
cd talent-link/apps/mobile
# Install CocoaPods dependencies (first time only)
cd ios && bundle install && bundle exec pod install && cd ..

# Run the app
pnpm ios
# or from root
pnpm --filter mobile ios
```

## 📁 Project Structure

```
TalentLink-FrontEnd/
├── 📱 talent-link/
│   ├── 🌐 apps/
│   │   ├── web/           # React + TypeScript + Vite web application
│   │   └── mobile/        # React Native mobile application
│   └── 📦 packages/
│       └── ui/            # Shared UI components and theme
└── 📄 README.md
```

## License

MIT
