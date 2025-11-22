#!/usr/bin/env node

/**
 * Database Setup Script
 *
 * This script creates the invite_acceptances table in your Supabase database.
 *
 * Usage:
 *   node scripts/setup-database.js
 *
 * Make sure you have set up your .env.local file with valid Supabase credentials first.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ Error: .env.local file not found!');
  console.error('Please create .env.local with your Supabase credentials.');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Error: Missing Supabase credentials in .env.local');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

if (SUPABASE_URL.includes('your-project') || SUPABASE_KEY.includes('your-anon-key')) {
  console.error('❌ Error: Please replace placeholder values in .env.local with your actual Supabase credentials');
  console.error('\nGet your credentials from: https://app.supabase.com/project/_/settings/api');
  process.exit(1);
}

console.log('🚀 Setting up Supabase database...\n');

// SQL to create the table
const sql = `
CREATE TABLE IF NOT EXISTS invite_acceptances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_id TEXT NOT NULL,
  guest_names TEXT[] NOT NULL,
  contact_info TEXT NOT NULL,
  invite_count INTEGER NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invite_id ON invite_acceptances(invite_id);
CREATE INDEX IF NOT EXISTS idx_accepted_at ON invite_acceptances(accepted_at DESC);
`;

// Parse the URL to get the project reference
const urlMatch = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/);
if (!urlMatch) {
  console.error('❌ Error: Invalid Supabase URL format');
  process.exit(1);
}

const projectRef = urlMatch[1];

console.log('📊 Creating table: invite_acceptances');
console.log('📍 Project:', projectRef);
console.log('\n⚠️  Note: This script uses the anon key which may not have permissions to create tables.');
console.log('If this fails, please run the SQL manually in Supabase SQL Editor.\n');

// Make a test query to check if table exists
const testUrl = new URL(`${SUPABASE_URL}/rest/v1/invite_acceptances`);
testUrl.searchParams.append('select', 'count');
testUrl.searchParams.append('limit', '1');

const options = {
  method: 'GET',
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  }
};

const req = https.request(testUrl, options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Table already exists and is accessible!');
      console.log('\n🎉 Setup complete! You can now use the invite system.');
    } else if (res.statusCode === 404 || (res.statusCode >= 400 && data.includes('does not exist'))) {
      console.log('❌ Table does not exist.');
      console.log('\n📝 Please create it manually:');
      console.log('\n1. Go to: https://app.supabase.com/project/' + projectRef + '/sql');
      console.log('2. Run this SQL:\n');
      console.log('─'.repeat(60));
      console.log(sql.trim());
      console.log('─'.repeat(60));
      console.log('\n3. Run this script again to verify setup.');
    } else {
      console.log('⚠️  Unexpected response:', res.statusCode);
      console.log('Response:', data);
      console.log('\nIf you need to create the table manually, use the SQL from INVITE_SETUP.md');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
  console.log('\nPlease check your Supabase credentials and try again.');
});

req.end();
