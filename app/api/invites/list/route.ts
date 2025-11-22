import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch all invite acceptances
    const { data, error, count } = await supabase
      .from('invite_acceptances')
      .select('*', { count: 'exact' })
      .order('accepted_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch invite acceptances' },
        { status: 500 }
      );
    }

    // Calculate total assistants (sum of invite_count)
    const totalAssistants = (data || []).reduce(
      (sum, invite) => sum + (invite.invite_count || 0),
      0
    );

    return NextResponse.json(
      {
        success: true,
        totalConfirmations: count || 0,
        totalAssistants: totalAssistants,
        invites: data || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
