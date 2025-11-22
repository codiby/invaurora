# Invite System Setup Guide

## Overview
The invite system allows you to send personalized invitation links with a specified number of invites. Each link contains a base64-encoded JSON parameter that determines how many guest slots are available.

## Quick Setup (Recommended)

### Option 1: Using the Setup Page (Easiest)

1. **Configure Supabase Credentials**:
   - Go to [https://supabase.com](https://supabase.com) and create a new project
   - Go to **Project Settings** → **API**
   - Copy your **Project URL** and **anon/public key**
   - Update `.env.local` with these values

2. **Run the Setup Page**:
   - Start your dev server: `npm run dev` or `bun dev`
   - Visit `http://localhost:3000/setup`
   - Follow the on-screen instructions
   - The page will check your database and provide the exact SQL to run
   - Copy the SQL and run it in Supabase SQL Editor
   - Click "Check Again" to verify setup

### Option 2: Using the Setup Script

1. Configure `.env.local` (see above)
2. Run the setup checker:
   ```bash
   node scripts/setup-database.js
   ```
3. Follow the instructions provided by the script

## Manual Setup

### 1. Configure Supabase

1. Go to [https://supabase.com](https://supabase.com) and create a new project (or use an existing one)
2. Once your project is created, go to **Project Settings** → **API**
3. Copy the following values:
   - **Project URL** (something like `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 2. Update Environment Variables

Edit the `.env.local` file and replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-actual-key-here
```

### 3. Create Database Table

In your Supabase project:
1. Go to **SQL Editor**
2. Run the following SQL to create the `invite_acceptances` table:

```sql
CREATE TABLE invite_acceptances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_id TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  contact_info TEXT NOT NULL,
  invite_count INTEGER NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster lookups
CREATE INDEX idx_invite_id ON invite_acceptances(invite_id);
CREATE INDEX idx_accepted_at ON invite_acceptances(accepted_at DESC);
```

### 4. Set Up Row Level Security (RLS) - Optional but Recommended

If you want to enable RLS for security:

```sql
-- Enable RLS
ALTER TABLE invite_acceptances ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (accept invites)
CREATE POLICY "Allow public inserts" ON invite_acceptances
  FOR INSERT TO anon
  WITH CHECK (true);

-- Only authenticated users (you) can read all data
CREATE POLICY "Allow authenticated reads" ON invite_acceptances
  FOR SELECT TO authenticated
  USING (true);
```

## How to Generate Invite Links

### Manual Generation

Use this JavaScript code to generate invite links:

```javascript
// Define the invite data
const inviteData = { invites: 3 }; // 3 invites

// Encode to base64
const base64 = btoa(JSON.stringify(inviteData));

// Create the full URL
const inviteUrl = `https://yourdomain.com?i=${base64}`;

console.log(inviteUrl);
// Example: https://yourdomain.com?i=eyJpbnZpdGVzIjozfQ==
```

### Using Node.js

```javascript
const generateInviteLink = (baseUrl, inviteCount) => {
  const data = { invites: inviteCount };
  const base64 = Buffer.from(JSON.stringify(data)).toString('base64');
  return `${baseUrl}?i=${base64}`;
};

// Examples
console.log(generateInviteLink('https://yourdomain.com', 1)); // 1 invite
console.log(generateInviteLink('https://yourdomain.com', 2)); // 2 invites
console.log(generateInviteLink('https://yourdomain.com', 5)); // 5 invites
```

### Using Browser Console

Open your browser's developer console on any page and run:

```javascript
const invites = 3; // Change this number
const data = { invites };
const base64 = btoa(JSON.stringify(data));
const url = `${window.location.origin}?i=${base64}`;
console.log(url);
// Copy the logged URL and send it to your guests
```

## How It Works

1. **User clicks the invite link** with the `?i=...` parameter
2. **Page decodes the parameter** and displays the number of available invites
3. **User fills in their name and contact info**
4. **User submits the form**:
   - Data is saved to Supabase
   - A localStorage key is set to prevent duplicate submissions
5. **Confirmation message** is shown
6. **If user revisits** the same link, they see "Confirmation Received"

## LocalStorage Keys

The system uses localStorage to track accepted invites:
- **Key format**: `invite_accepted_${base64_param}`
- **Value**: `{"accepted": true, "timestamp": 1234567890}`

## Viewing Accepted Invites

To view all accepted invites in your Supabase dashboard:
1. Go to **Table Editor**
2. Select the `invite_acceptances` table
3. You'll see all submissions with:
   - Guest name
   - Contact info
   - Acceptance timestamp
   - Original invite count

Or use SQL Editor:

```sql
-- View all acceptances
SELECT * FROM invite_acceptances ORDER BY accepted_at DESC;

-- Count total guests
SELECT COUNT(*) as total_guests
FROM invite_acceptances;

-- View by invite ID
SELECT invite_id, guest_name, contact_info, accepted_at
FROM invite_acceptances
WHERE invite_id = 'specific-base64-id';
```

## Testing

1. Generate a test invite link with 3 invites
2. Open the link in your browser
3. You should see "Tienes 3 invitaciones disponibles"
4. Fill in your name and contact info
5. Submit the form
6. Check your Supabase table to verify the data was saved
7. Refresh the page - you should see the confirmation message

## Setup Verification

After completing setup, you can verify everything is working:

1. **Using the Setup Page**: Visit `http://localhost:3000/setup`
   - Should show "✅ Database is set up correctly!"
   - Shows the number of accepted invites (if any)

2. **Using the API**: Visit `http://localhost:3000/api/setup`
   - Should return JSON with `status: "success"`

## Troubleshooting

### "Missing required fields" error
- Make sure you've set up the `.env.local` file correctly
- Restart your dev server after updating environment variables

### Data not saving to Supabase
- Check the browser console for errors
- Verify your Supabase credentials are correct
- Check that the table was created successfully
- Ensure RLS policies allow inserts if you enabled RLS

### localStorage not working
- Check browser privacy settings (private browsing may disable localStorage)
- Open browser console and check for errors

### Setup page shows errors
- Visit `/setup` to see detailed error messages
- The page will guide you through exactly what needs to be fixed
- Common issues:
  - `.env.local` not configured
  - Using placeholder values in `.env.local`
  - Table not created in Supabase
  - Wrong Supabase credentials

## Example Invite Links

Assuming your domain is `https://invaurora.vercel.app`:

- **1 invite**: `https://invaurora.vercel.app?i=eyJpbnZpdGVzIjoxfQ==`
- **2 invites**: `https://invaurora.vercel.app?i=eyJpbnZpdGVzIjoyfQ==`
- **3 invites**: `https://invaurora.vercel.app?i=eyJpbnZpdGVzIjozfQ==`
- **5 invites**: `https://invaurora.vercel.app?i=eyJpbnZpdGVzIjo1fQ==`

Each unique base64 string serves as the invite ID, so you can track who used which link.
