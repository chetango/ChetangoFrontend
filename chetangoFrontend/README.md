# Aphellion (Chetango) - Frontend

> Modern React SaaS application for dance academy management | 500+ active users

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Azure](https://img.shields.io/badge/Azure-Static_Web_Apps-0078D4?logo=microsoft-azure)](https://azure.microsoft.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Modern web application built with React 18, TypeScript, and TailwindCSS featuring role-based dashboards, real-time updates, and a glassmorphism design system.

**Live Demo:** [https://app.corporacionchetango.com](https://app.corporacionchetango.com)  
**Fully Responsive** - Works seamlessly on mobile, tablet, and desktop

---

## Features

### Design System
- **Glassmorphism UI** - Modern frosted glass aesthetic
- **Dark/Light Mode** - Adaptive color schemes
- **Micro-interactions** - Smooth animations and transitions
- **Responsive Design** - Mobile-first approach (83% complete)
- **Atomic Design Pattern** - Scalable component architecture

### Role-Based Dashboards

## Tech Stack

### Core
- **React 18** - UI library with concurrent features
- **TypeScript 5** - Type safety and developer experience
- **Vite** - Build tool & dev server
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **TanStack Query** - Data fetching & caching
- **Axios** - HTTP client
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
git clone https://github.com/yourusername/aphellion-frontend.git
cd aphellion-frontend
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

## 📊 Project Stats

- **500+ Active Users** in production
- **15+ E2E Tests** with Playwright (critical flows covered)
- **99.8% Uptime** on Azure Static Web Apps
- **Fast Load Times** - Lighthouse score >85 for mobile
- **Zero Dependencies** security vulnerabilities

## 🗺️ Roadmap

- [ ] Complete responsive design (Phase 4-5)
- [ ] PWA support with offline mode
- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] Advanced data visualization (recharts/visx)
- [ ] Real-time collaboration features (SignalR)
- [ ] Mobile apps (React Native)

## Documentation

- [Architecture Overview](../chetango-backend/docs/ARCHITECTURE.en.md) - System architecture
- [Deployment Strategy](../chetango-backend/docs/DEPLOYMENT-STRATEGY.en.md) - CI/CD details
- [Testing Guide](e2e/README.md) - E2E testing with Playwright

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Jorge Padilla** - Full Stack Developer  
- LinkedIn: [Jorge Padilla](https://linkedin.com/in/yourprofile)
- Email: seguridad.padilla@hotmail.com
- Location: Medellín, Colombia

## Contributing

Contributions, issues, and feature requests are welcome!


---

**Built with ❤️ from Medellín, Colombia**  
*Jorge Padilla © 2024-2026*
```
