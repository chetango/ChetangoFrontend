# Chetango Web App

Modern web application for Chetango dance studio management, built with React, TypeScript, and Vite.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **TanStack Query** - Data fetching & caching
- **Axios** - HTTP client
- **Azure AD B2C** - Authentication
- **Playwright** - E2E testing

- **Azure AD B2C** - Authentication
- **Playwright** - E2E testing

## Features

- **Role-based Dashboards**: Admin, Professor, Student views
- **Class Management**: Schedule & manage dance classes
- **Attendance Tracking**: Check-in system with real-time updates
- **Package Management**: Buy and track class packages
- **Payment Verification**: Upload receipts & admin verification
- **Reports & Analytics**: Comprehensive business metrics
- **Event Management**: Promote special events
- **Referral System**: Track student referrals

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/chetango/ChetangoFrontend.git
cd chetangoFrontend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables

Create `.env.development` file:
```env
VITE_API_BASE_URL=http://localhost:5194/api
VITE_AZURE_CLIENT_ID=your-client-id
VITE_AZURE_AUTHORITY=https://your-tenant.ciamlogin.com
```

4. Run development server
```bash
npm run dev
```

App will be available at `http://localhost:5173`

## Available Scripts

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Testing
```bash
npm run test         # Run unit tests
npm run test:e2e     # Run Playwright E2E tests
npm run test:ui      # Open Playwright UI mode
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Project Structure

```
src/
├── app/                  # App-wide configuration
├── features/            # Feature modules
│   ├── asistencias/    # Attendance
│   ├── clases/         # Classes
│   ├── eventos/        # Events
│   ├── pagos/          # Payments
│   └── reportes/       # Reports
├── shared/             # Shared utilities
│   ├── api/           # API client
│   ├── auth/          # Authentication
│   ├── components/    # Reusable components
│   └── hooks/         # Custom hooks
└── pages/             # Page components
```

## Authentication

Uses Azure AD B2C for authentication. Configure in environment variables:

```env
VITE_AZURE_CLIENT_ID=d35c1d4d-9ddc-4a8b-bb89-1964b37ff573
VITE_AZURE_AUTHORITY=https://8a57ec5a-e2e3-44ad-9494-77fbc7467251.ciamlogin.com
```

### Protected Routes

All routes except `/login` require authentication. Role-based access enforced by backend API.

## API Integration

### Base Configuration

API client configured in `src/shared/api/client.ts`:

```typescript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### Authentication Interceptor

JWT tokens automatically attached to requests:

```typescript
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Testing

### E2E Tests

Playwright tests located in `/e2e` directory:

```bash
# Run all tests
npm run test:e2e

# Run specific test suite
npm run test:e2e -- asistencias

# Debug mode
npm run test:e2e -- --debug

# UI mode
npm run test:ui
```

Test coverage includes:
- Authentication flows
- Admin workflows
- Class management
- Attendance tracking
- Payment processing
- Report generation

## Deployment

### Azure Static Web Apps

Automated deployment via GitHub Actions:

```yaml
on:
  push:
    branches: [main]
```

Deploys to: `https://delightful-plant-02670d70f.azurestaticapps.net`

### Environment Variables

Set in Azure Portal under Configuration:
- `VITE_API_BASE_URL`
- `VITE_AZURE_CLIENT_ID`
- `VITE_AZURE_AUTHORITY`

## Styling

### TailwindCSS

Utility-first CSS framework. Configuration in `tailwind.config.js`:

```js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#...',
        secondary: '#...'
      }
    }
  }
}
```

### Design System

Shared components in `src/design-system/`:
- Buttons
- Forms
- Modals
- Tables
- Cards

## Performance

- Code splitting via React.lazy()
- Image optimization
- TanStack Query for caching
- Vite for fast HMR

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create feature branch from `develop`
2. Follow TypeScript & ESLint rules
3. Write tests for new features
4. Create Pull Request to `develop`
5. After approval, merge to `main` for production

## Common Issues

### Build Errors

Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors

Ensure backend API includes frontend URL in CORS configuration.

### Authentication Redirect Loops

Clear browser cache and verify Azure AD configuration.

## License

Proprietary - Chetango Dance Studio

## Contact

For questions or support, contact the development team.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
