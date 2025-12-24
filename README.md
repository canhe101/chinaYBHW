# China Insights - Research Reports Platform

A professional platform for accessing and downloading Chinese research reports, market analyses, and industry insights. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### User Features
- **Browse Reports**: Search, filter, and sort through extensive research reports
- **Online Preview**: View PDF reports directly in the browser
- **Download Tracking**: Track your download history
- **Category Navigation**: Browse reports by industry and topic
- **User Authentication**: Secure login and registration system

### Admin Features
- **Dashboard**: Overview of platform statistics
- **Report Management**: Add, edit, delete reports with Excel batch import
- **Category Management**: Organize reports into categories
- **User Management**: Manage user accounts and permissions
- **Statistics**: Detailed analytics and insights

## Design

### Color Scheme
- **Primary**: Bright Red (#D32F2F) - Main brand color
- **Secondary**: Orange (#FF6F00) - Accent and highlights
- **Background**: Clean white with subtle gray tones
- **Style**: Modern, professional design optimized for American users

### Layout
- Responsive design for desktop and mobile
- Clean card-based interface
- Intuitive navigation
- Professional typography

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Routing**: React Router v6
- **Date Handling**: date-fns
- **Excel Processing**: xlsx
- **Icons**: lucide-react

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# .env file is already configured with Supabase credentials
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start development server:
```bash
pnpm dev
```

5. Build for production:
```bash
pnpm build
```

## Usage

### First Time Setup
1. Register an account (first user automatically becomes admin)
2. Log in with your credentials
3. Admin users can access the Admin Panel from the top navigation

### For Regular Users
- Browse reports on the homepage or reports list page
- Use search and filters to find specific reports
- Click on any report to view details and download
- Check your download history in your profile

### For Administrators
- Access Admin Panel from the navigation menu
- Add reports manually or import via Excel
- Manage categories to organize reports
- View user activity and platform statistics
- Configure homepage content

### Excel Import Format
When importing reports via Excel, use the following columns:
- **Title**: Report title
- **Description**: Report description
- **Download URL**: Direct link to PDF file
- **Source**: Research institution name
- **Published Date**: Publication date (YYYY-MM-DD)

## Project Structure

```
src/
├── components/
│   ├── layouts/          # Header, Footer, AdminLayout
│   └── ui/               # shadcn/ui components
├── contexts/             # React contexts (Auth)
├── db/                   # Database API layer
├── hooks/                # Custom React hooks
├── pages/                # Page components
│   ├── admin/            # Admin pages
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── ReportsListPage.tsx
│   ├── ReportDetailPage.tsx
│   └── ProfilePage.tsx
├── services/             # External services
├── types/                # TypeScript type definitions
├── routes.tsx            # Route configuration
└── App.tsx               # Main app component
```

## Database Schema

### Tables
- **profiles**: User profiles and roles
- **categories**: Report categories
- **reports**: Research reports
- **download_logs**: Download tracking
- **homepage_config**: Homepage content configuration

### Security
- Row Level Security (RLS) policies enabled
- Role-based access control (admin/user)
- Secure authentication via Supabase Auth

## License

© 2025 China Insights. All rights reserved.
