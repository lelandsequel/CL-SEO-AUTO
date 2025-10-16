import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET automation config
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from('automation_config')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching automation config:', error);
      return NextResponse.json(
        { error: 'Failed to fetch automation config' },
        { status: 500 }
      );
    }

    return NextResponse.json({ config: data || null });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch automation config' },
      { status: 500 }
    );
  }
}

// POST/UPDATE automation config
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { enabled, location, day_of_week, time, industries } = body;

    // Check if config exists
    const { data: existing } = await supabaseAdmin
      .from('automation_config')
      .select('id')
      .limit(1)
      .single();

    let result;

    if (existing) {
      // Update existing config
      result = await supabaseAdmin
        .from('automation_config')
        .update({
          enabled,
          location,
          day_of_week,
          time,
          industries,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      // Create new config
      result = await supabaseAdmin
        .from('automation_config')
        .insert({
          enabled,
          location,
          day_of_week,
          time,
          industries,
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Error saving automation config:', result.error);
      return NextResponse.json(
        { error: 'Failed to save automation config' },
        { status: 500 }
      );
    }

    return NextResponse.json({ config: result.data });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to save automation config' },
      { status: 500 }
    );
  }
}

