"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import clsx from "clsx";

export default function PushToggle() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSubscription() {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setLoading(false);
        return;
      }

      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch (err) {
        console.error("Error checking subscription", err);
      }
      setLoading(false);
    }
    checkSubscription();
  }, []);

  const handleToggle = async () => {
    if (!('serviceWorker' in navigator)) return;
    setLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;

      if (isSubscribed) {
        // Unsubscribe
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          // Ideally also tell backend to delete, but PWA logic handles 410 Gone on trigger
        }
        setIsSubscribed(false);
      } else {
        // Subscribe
        const pubKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!pubKey) throw new Error("No VAPID key");

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: pubKey
        });

        // Send to backend
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription)
        });

        setIsSubscribed(true);
      }
    } catch (err) {
      console.error("Subscription error:", err);
    }

    setLoading(false);
  };

  if (loading) {
     return <Loader2 className="animate-spin text-gray-400" size={18} />;
  }

  return (
    <button
      onClick={handleToggle}
      className={clsx(
        "p-2 rounded-full transition-colors glass flex items-center justify-center",
        isSubscribed ? "bg-white/50 dark:bg-white/20 text-black dark:text-white" : "text-gray-500 hover:text-black dark:hover:text-white"
      )}
      aria-label="Toggle Push Notifications"
    >
      {isSubscribed ? <Bell size={18} /> : <BellOff size={18} />}
    </button>
  );
}
