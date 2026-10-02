import { NextResponse } from 'next/server';
import { saveSubscription } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const subscription = await req.json();
    await saveSubscription(subscription);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
}
