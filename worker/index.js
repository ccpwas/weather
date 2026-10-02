self.addEventListener('push', function (event) {
  const data = event.data?.json() ?? { title: 'Weather Alert', body: 'New severe weather warning in effect.' };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/icons/icon-192x192.png',
    })
  );
});
