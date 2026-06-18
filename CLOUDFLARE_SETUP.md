# Cloudflare Pages Deployment Guide

This project is configured to run on Cloudflare Pages with D1 database for global countdown synchronization.

## Prerequisites

1. Bun runtime installed
2. Cloudflare account
3. Git repository connected to GitHub

## Local Development

### Setup

```bash
# Install dependencies
bun install

# Run development server
bun run dev
```

The app will be available at `http://localhost:5173`

### Testing Countdown

1. Navigate to `http://localhost:5173/admin`
2. Enter password: `gen-zcience321`
3. Configure countdown settings and save
4. Settings are stored in browser localStorage for local testing

## Cloudflare Pages Deployment

### Step 1: Create D1 Database

```bash
# Login to Cloudflare
npx wrangler login

# Create D1 database
npx wrangler d1 create gms_countdown

# Apply migrations to create tables
npx wrangler d1 execute gms_countdown --file migrations/0001_create_countdown_table.sql
```

### Step 2: Update wrangler.toml

After creating the database, update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "gms_countdown"
database_id = "your-database-id-here"
migrations_dir = "migrations"
```

Get your `database_id` from the command output above.

### Step 3: Deploy to Cloudflare Pages

Option A: Using GitHub Integration (Recommended)
1. Push code to GitHub
2. Go to Cloudflare Dashboard → Pages
3. Create new project
4. Connect your GitHub repository
5. Set build command: `bun run build`
6. Set output directory: `dist`
7. Add environment variables:
   - Bind D1 database in the settings

Option B: Using Wrangler CLI

```bash
# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name gms-neon-arrival
```

### Step 4: Configure D1 Binding in Cloudflare Dashboard

1. Go to your Pages project settings
2. Navigate to "Functions" → "D1 Database Bindings"
3. Add binding:
   - Variable name: `DB`
   - Database: `gms_countdown`

## How It Works

### Countdown Synchronization

1. **Frontend** (`src/routes/index.tsx`):
   - Fetches countdown settings from `/api/countdown` GET endpoint
   - Settings are synced globally from Cloudflare D1 database
   - Every user worldwide sees the same countdown
   - Updates every second

2. **Admin Panel** (`src/routes/admin.tsx`):
   - Password-protected interface at `/admin`
   - Save changes to Cloudflare D1 via `/api/countdown` POST endpoint
   - Changes are immediately reflected globally

3. **API Route** (`src/routes/api/countdown.ts`):
   - `GET`: Retrieves current countdown settings from D1
   - `POST`: Updates countdown settings in D1
   - Falls back to localStorage if database is unavailable

4. **Redirect on Timeout**:
   - When countdown reaches zero, users are immediately redirected
   - Uses `window.location.replace()` for instant redirect
   - No delay or additional UI

## File Structure

```
├── migrations/
│   └── 0001_create_countdown_table.sql    # Database schema
├── src/
│   └── routes/
│       ├── index.tsx                      # Home page with countdown display
│       ├── admin.tsx                      # Admin control panel
│       └── api/
│           └── countdown.ts               # API endpoints
├── wrangler.toml                          # Cloudflare Worker configuration
└── vite.config.ts                         # Vite configuration
```

## Database Schema

```sql
CREATE TABLE countdown (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  enabled BOOLEAN DEFAULT 0,
  ends_at TEXT DEFAULT '',
  redirect_url TEXT DEFAULT '',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

No environment variables required for production. Database binding is configured in Cloudflare Dashboard.

For local development, settings are stored in browser localStorage.

## Testing Countdown Feature

### Via Admin Panel
1. Go to `/admin`
2. Password: `gen-zcience321`
3. Check "SHOW COUNTDOWN ON HOME PAGE"
4. Set end time to future date/time
5. (Optional) Set redirect URL
6. Click SAVE
7. Homepage shows countdown timer prominently

### Settings Sync
- All instances see the same countdown
- Works across different browsers and devices
- Updates in real-time when admin changes settings

## Troubleshooting

### Database Connection Issues
- Verify `database_id` in `wrangler.toml` matches Cloudflare Dashboard
- Check D1 binding in Functions settings
- Ensure migrations have been applied

### Settings Not Persisting
- Check browser console for API errors
- Verify D1 database is created and migrations applied
- Check Cloudflare Dashboard logs

### Countdown Not Showing
- Verify admin settings are saved
- Check that countdown is enabled in admin panel
- Ensure end time is in the future

## UI Features

### Countdown Display
- Shows **Days, Hours, Minutes, Seconds** in separate units
- Larger text when countdown is active
- "COMING SOON" text becomes smaller when countdown is active
- Positioned above the main title

### Immediate Redirect
- When countdown reaches zero, automatic redirect occurs
- No confirmation dialogs
- No delay - happens instantly

## Building for Production

```bash
# Build the project
bun run build

# Preview production build locally
bun run preview

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name gms-neon-arrival
```

## Admin Password

**Current Password**: `gen-zcience321`

To change password, update `COUNTDOWN_ADMIN_PASSWORD` in `src/lib/countdown-settings.ts` and redeploy.

## Support

For issues or questions, contact: support@geethmunasinghe.lk
