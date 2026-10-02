import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { getAllSubscriptions, removeSubscription } from '@/lib/db';
import { getWeatherWarnings } from '@/lib/hko-api';

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  privateKey: process.env.VAPID_PRIVATE_KEY || ''
};

if (vapidKeys.publicKey && vapidKeys.privateKey) {
  webpush.setVapidDetails(
    'mailto:test@example.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
}

export async function POST(req: Request) {
  // In a real scenario, this would be protected by a cron secret
  // const authHeader = req.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) { ... }

  if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
    return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 500 });
  }

  try {
    // 1. Fetch current warnings
    const warnings = await getWeatherWarnings('en');
    const hasWarnings = warnings && Object.keys(warnings).length > 0;

    // Only send if there are active severe warnings (e.g. Typhoon, Rainstorm)
    // We simplify and say any warning triggers an alert for this mock logic
    if (!hasWarnings) {
       return NextResponse.json({ success: true, message: 'No warnings to push' });
    }

    // 2. Get subscribers
    const subscriptions = await getAllSubscriptions();

    // 3. Send payload
    const payload = JSON.stringify({
      title: 'HKO Extreme Weather Warning',
      body: 'Active severe weather warning in effect. Check the app for details.',
      icon: '/icons/icon-192x192.png'
    });

    const sendPromises = subscriptions.map(sub =>
      webpush.sendNotification(sub, payload).catch(err => {
        if (err.statusCode === 404 || err.statusCode === 410) {
          console.log('Subscription expired or removed, deleting...');
          return removeSubscription(sub.endpoint);
        } else {
          console.error('Push error:', err);
        }
      })
    );

    await Promise.all(sendPromises);

    return NextResponse.json({ success: true, pushed: subscriptions.length });
  } catch (error) {
    console.error('Trigger push error:', error);
    return NextResponse.json({ error: 'Failed to trigger pushes' }, { status: 500 });
  }
}
