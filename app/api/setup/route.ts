import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Database Setup Check Endpoint
 *
 * GET /api/setup
 *
 * Checks if the database table exists and provides clear instructions for manual setup.
 * Tables must be created via Supabase SQL Editor for security.
 */
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Check if credentials are configured
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Supabase credentials not configured',
          instructions: [
            '1. Create a Supabase project at https://supabase.com',
            '2. Get your credentials from Project Settings → API',
            '3. Update .env.local with your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
          ],
        },
        { status: 500 }
      );
    }

    // Check if using placeholder values
    if (supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key')) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Please replace placeholder values in .env.local',
          instructions: [
            '1. Go to https://app.supabase.com/project/_/settings/api',
            '2. Copy your Project URL and anon/public key',
            '3. Update .env.local with the real values',
            '4. Restart your dev server',
          ],
        },
        { status: 500 }
      );
    }

    // Create client for checking
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Try to query the table to check if it exists
    const { error, count } = await supabase
      .from('invite_acceptances')
      .select('*', { count: 'exact', head: true });

    if (!error) {
      return NextResponse.json(
        {
          status: 'success',
          message: '✅ Database is set up correctly!',
          tableExists: true,
          recordCount: count || 0,
        },
        { status: 200 }
      );
    }

    // Check if the error is because the table doesn't exist
    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      const projectMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
      const projectRef = projectMatch ? projectMatch[1] : 'your-project';

      return NextResponse.json(
        {
          status: 'setup_required',
          message: 'Table does not exist - please create it in Supabase SQL Editor',
          tableExists: false,
          instructions: [
            `Open Supabase SQL Editor`,
            'Click "New Query"',
            'Copy and paste the SQL code shown below',
            'Click "Run" or press Ctrl+Enter (Cmd+Enter on Mac)',
            'Wait for "Success. No rows returned" message',
            'Come back here and click "Check Again"',
          ],
          sql: `-- Create the invite_acceptances table
CREATE TABLE invite_acceptances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_id TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  contact_info TEXT NOT NULL,
  invite_count INTEGER NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_invite_id ON invite_acceptances(invite_id);
CREATE INDEX idx_accepted_at ON invite_acceptances(accepted_at DESC);

-- Enable Row Level Security
ALTER TABLE invite_acceptances ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (accept invites)
CREATE POLICY "Allow public inserts" ON invite_acceptances
  FOR INSERT TO anon
  WITH CHECK (true);`,
          sqlEditorUrl: `https://app.supabase.com/project/${projectRef}/sql/new`,
          projectDashboardUrl: `https://app.supabase.com/project/${projectRef}`,
        },
        { status: 200 }
      );
    }

    // Other error
    return NextResponse.json(
      {
        status: 'error',
        message: 'Error checking database',
        error: error.message,
        instructions: [
          'Make sure your Supabase project is active',
          'Verify your API credentials are correct',
          'Check your internet connection',
        ],
      },
      { status: 500 }
    );
  } catch (error: any) {
    console.error('Setup check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
