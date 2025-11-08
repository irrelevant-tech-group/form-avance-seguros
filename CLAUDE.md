# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an insurance quote form application for Avance Seguros, built as a multi-step form system that collects customer information and sends quotes via email and Google Sheets. The application supports both personal insurance quotes (life, health, vehicles, pets) and business insurance quotes.

## Tech Stack

- **Frontend**: React 18.3 + TypeScript + Vite
- **UI Components**: shadcn-ui (built on Radix UI)
- **Styling**: Tailwind CSS + Framer Motion for animations
- **Form Management**: react-hook-form + zod for validation
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **Serverless Functions**: Netlify Functions
- **Email Service**: Resend API
- **Data Storage**: Google Sheets API (googleapis)
- **Deployment**: Netlify

## Development Commands

### Local Development
```bash
# Install dependencies
npm install

# Start development server (Vite only, port 8080)
npm run dev

# Start with Netlify Functions support (recommended for full functionality)
npm run netlify:dev
# or
netlify dev
```

### Building
```bash
# Production build
npm run build

# Development build (with different optimizations)
npm run build:dev

# Preview production build locally
npm run preview
```

### Linting
```bash
npm run lint
```

### Testing Netlify Functions Locally
```bash
# Test specific quote type
npm run test:function         # defaults to personal
npm run test:personal         # test personal/life insurance
npm run test:vehiculo         # test vehicle insurance
npm run test:empresarial      # test business insurance
npm run test:salud           # test health insurance
npm run test:mascotas        # test pet insurance
npm run test:all             # test all types sequentially
```

**Important**: These test scripts require `netlify dev` to be running in another terminal.

### Netlify Functions
```bash
# Serve functions locally
npm run functions:serve
```

## Architecture

### Application Flow

1. **Landing Page** (`DynamicQuotePage`): Users choose between personal or business insurance
2. **Quote Type Selection**: Based on choice, users are redirected to:
   - `/personales` - Personal insurance options (vida, salud, vehiculos, mascotas)
   - `/empresariales` - Business insurance options (corporativos, cyber security, etc.)
3. **Form Submission**: Multi-step forms collect user information
4. **Processing**: Data is sent to Netlify Function `send-quote-email.cjs` which:
   - Sends confirmation email to user (via Resend)
   - Sends notification email to admin
   - Saves quote data to Google Sheets
5. **Success Page**: User sees confirmation at `/exito`

### Key Directories

- **`src/pages/`**: Main page components
  - `DynamicQuotePage.tsx` - Landing page with personal/business selection
  - `PersonalInsurancePage.tsx` - Personal insurance quote types
  - `BusinessInsurancePage.tsx` - Business insurance quote types
  - `*QuoteForm.tsx` - Individual form components for each insurance type
  - `steps/` - Multi-step form components (for vehicle insurance)
  - `SuccessPage.tsx` - Post-submission success page

- **`src/components/`**: Reusable form components
  - `FormComponent.tsx` - Main reusable form wrapper
  - `FormInput.tsx`, `FormSelect.tsx`, `FormRadioGroup.tsx` - Form field components
  - `FormFileUpload.tsx` - File upload component
  - `PhoneInput.tsx` - Colombian phone number input
  - `ui/` - shadcn-ui components

- **`src/data/`**: Static data and form options
  - `FormData.tsx` - Vehicle brands, models, years, common form options

- **`src/services/`**: API integration services
  - `emailService.ts` - Email sending interface (points to Netlify Function)

- **`netlify/functions/`**: Serverless backend
  - `send-quote-email.cjs` - Main function handling email + Google Sheets integration

### Environment Variables

Required environment variables (stored in `.env`):

```bash
# Email service (Resend API)
RESEND_API_KEY=re_...
DOMAIN=updates.stayirrelevant.com

# Google Sheets authentication (production - Netlify)
GOOGLE_CREDENTIALS_BASE64=...  # Base64 encoded service account JSON

# Google Sheets authentication (alternative/local)
GOOGLE_CLIENT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
GOOGLE_PROJECT_ID=...

# Google Sheets configuration
GOOGLE_SHEET_ID=...  # The spreadsheet ID to write quote data
```

### Google Sheets Integration

The Netlify function uses two authentication methods (in priority order):
1. **Production (Netlify)**: `GOOGLE_CREDENTIALS_BASE64` - Base64-encoded service account JSON
2. **Fallback/Local**: Individual variables (`GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, etc.)

The function automatically creates tabs/sheets for different quote types and appends data to the appropriate sheet.

### Email Flow

- **User emails**: Sent via Resend API from `no-reply@{DOMAIN}`
- **Admin emails**:
  - Personal quotes → `jpgomez@stayirrelevant.com`
  - Business quotes → `juanpablog857@gmail.com` + CC to `jpgomez@stayirrelevant.com`

### Path Aliases

The project uses `@/` as an alias for `src/`:

```typescript
import { Button } from "@/components/ui/button";
import FormComponent from "@/components/FormComponent";
```

## Common Development Patterns

### Creating a New Quote Form

1. Create form component in `src/pages/` (e.g., `NewQuoteForm.tsx`)
2. Use `FormComponent` wrapper with proper fields
3. Define validation schema with `zod`
4. Add route in `App.tsx`
5. Add link in appropriate insurance page (`PersonalInsurancePage` or `BusinessInsurancePage`)
6. Update Netlify function to handle new quote type if needed
7. Add test data in `test-function-local.cjs`

### Form Field Components

All form fields use react-hook-form's `Controller` pattern:

```typescript
<FormInput
  control={control}
  name="fieldName"
  label="Field Label"
  placeholder="Placeholder text"
  required
/>
```

### Styling Conventions

- Use Tailwind utility classes
- Primary brand colors:
  - Teal: `#0A4958`, `#0A5866`, `#0A6578`
  - Gold: `#C69C3F`, `#D5A429`
- Use Framer Motion for page transitions and animations
- Responsive design: mobile-first approach

## Testing Netlify Functions

The `test-function-local.cjs` script simulates form submissions locally:

1. Start Netlify dev server: `netlify dev`
2. In another terminal, run test: `npm run test:personal`
3. Check console output for email sending status and Google Sheets integration
4. Verify emails arrive and data appears in spreadsheet

## Important Notes

- The project was originally created with Lovable.dev
- All routes must be added ABOVE the catch-all `*` route in `App.tsx`
- Netlify handles SPA routing via redirects in `netlify.toml`
- Development server runs on port 8080
- When using `netlify dev`, it proxies to the Vite server and adds function support
