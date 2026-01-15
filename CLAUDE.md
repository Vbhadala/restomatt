# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RestoMatt is a React-based project management application for renovation/furniture projects (kitchens, sofas, beds, cupboards, etc.). It uses Firebase for authentication, Firestore for data storage, and Firebase Storage for images. The app allows users to create projects, add items with dimensions and materials, track costs, manage milestones, and upload photos.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: lucide-react (use icons from this package, avoid installing others)
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **PDF Generation**: jsPDF + jspdf-autotable

## Architecture

### Firebase Integration

The app uses Firebase for all backend operations:

- **Authentication**: Email/password authentication via `firebase/auth`
- **Firestore Collections**:
  - `users` - User profiles with admin flags
  - `projects` - User projects (filtered by `userId`)
  - `projectTypes` - Shared project type definitions
  - `materials` - Material definitions linked to project types
- **Storage**: Project photos stored in `projects/{projectId}/*`

**Important**: Firebase configuration is in [src/firebase.ts](restomatt/src/firebase.ts) with security rules documented inline. Users can only read/write their own projects. Admin status is checked via Firestore `users` collection `isAdmin` field.

### State Management Pattern

The app uses React hooks for state management with real-time Firestore listeners:

- `useAuth()` - Manages authentication state and user data
- `useProjects(userId)` - Real-time listener for user's projects
- `useProjectTypes()` - Real-time listener for project types and materials

All hooks use `onSnapshot` for real-time updates. Changes to Firestore immediately reflect in the UI.

### Project Structure

```
src/
├── components/          # React components organized by feature
│   ├── AdminPanel/      # Admin UI for managing project types/materials
│   ├── Dashboard/       # Main application shell and routing
│   ├── LandingPage/     # Public landing page
│   ├── ProjectDetails/  # Project detail view with items, costs, timeline
│   ├── LoginModal/      # Authentication modal
│   └── ...
├── hooks/               # Custom React hooks for Firebase operations
│   ├── useAuth.ts       # Authentication hook
│   ├── useProjects.ts   # Projects CRUD with real-time sync
│   └── useProjectTypes.ts # Project types/materials with real-time sync
├── types/               # TypeScript type definitions
│   └── index.ts         # Project, Material, User, etc.
├── data/                # Static/default data
│   ├── projectTypes.ts  # Default project types (Kitchen, Sofa, etc.)
│   └── collections.ts   # Gallery collections for landing page
└── firebase.ts          # Firebase configuration and initialization
```

### Data Flow

1. **Authentication**: User logs in → `useAuth` hook updates → `currentUser` state propagates
2. **Projects**: `useProjects(userId)` subscribes to Firestore → Real-time updates → Component re-renders
3. **CRUD Operations**: Component calls hook method → Firestore updated → Listener triggers → State updates

### Key Type Definitions

See [src/types/index.ts](restomatt/src/types/index.ts) for full definitions:

- `Project` - Main project entity with items, extraCosts, milestones, photos
- `ProjectItem` - Individual item with dimensions (length/width/depth in inches), material, quantity
- `Material` - Material definition with ratePerSqft
- `ProjectType` - Project category (Kitchen, Sofa, etc.) with associated materials
- `User` - User profile with isAdmin flag

### Calculation Logic

**Square footage calculation** in [src/hooks/useProjects.ts](restomatt/src/hooks/useProjects.ts:146):
```typescript
sqft = (length_inches * width_inches) / 92903
amount = sqft * materialRate * quantity
```

This is a custom conversion factor used throughout the app. Do not change this without understanding the business logic.

### View Routing Pattern

The app uses hash-based routing managed in [Dashboard.tsx](restomatt/src/components/Dashboard/Dashboard.tsx) via `currentView` state:
- `landing` - Public landing page
- `projects` - User's project list
- `project-details` - Single project detail view
- `admin` - Admin panel (admin users only)
- `collection` - Gallery collection view

Navigation is handled by updating the `currentView` state, not React Router.

## Firebase Security Rules

Security rules are documented in [src/firebase.ts](restomatt/src/firebase.ts:44-80). Key points:

- Users can only access their own projects (checked via `userId` field)
- Project types and materials are shared (all authenticated users can read/write)
- User documents are private (users can only read/write their own)

## Admin Functionality

Admin users can:
- Create/edit project types
- Create/edit materials for project types
- Set material rates (ratePerSqft)

To set a user as admin:
1. Authenticate as the user
2. Open browser console and run `window.setAsAdmin()` (see [App.tsx](restomatt/src/App.tsx:51-70))
3. Manually set `isAdmin: true` in Firestore `users/{userId}` document

## Design Philosophy

From [.bolt/prompt](restomatt/.bolt/prompt):
- Designs should be beautiful and production-ready, not cookie-cutter
- Use Tailwind CSS classes for styling
- Use lucide-react for icons (avoid installing additional icon packages)
- Keep the UI clean and professional

## Common Tasks

### Adding a New Project Type
1. Admin creates project type in Admin Panel
2. Admin adds materials with rates to that project type
3. Project type becomes available in Create Project modal

### Creating a Project
1. User selects project type
2. Enters project details (name, customer info)
3. Project created in Firestore with user's `userId`
4. Add items with dimensions and materials
5. System auto-calculates sqft and amounts

### Modifying Calculations
If changing calculation logic in [useProjects.ts](restomatt/src/hooks/useProjects.ts), update both:
- `addProjectItem` (line 145-163)
- `updateProjectItem` (line 165-184)

## Important Notes

- **Do NOT commit Firebase API keys to version control** - They're already in [firebase.ts](restomatt/src/firebase.ts) for this demo project, but in production these should be environment variables
- **Permission errors on landing page are expected** - The app gracefully falls back to default data for unauthenticated users (see [useProjectTypes.ts](restomatt/src/hooks/useProjectTypes.ts:12-29))
- **Real-time sync is critical** - All CRUD operations update Firestore, which triggers `onSnapshot` listeners to update the UI
- **Square footage conversion** - The magic number `92903` in calculations is intentional business logic
