function onUpdateFound(registration) {
  // eslint-disable-next-line no-param-reassign
  registration.onupdatefound = () => {
    const installingWorker = registration.installing;
    installingWorker.onstatechange = () => {
      if (installingWorker.state === 'installed') {
        if (navigator.serviceWorker.controller) {
          // At this point, the old content will have been purged and
          // the fresh content will have been added to the cache.
          // It's the perfect time to display a "New content is
          // available; please refresh." message in your web app.
          console.log('New content is available; please refresh.');
        } else {
          // At this point, everything has been precached.
          // It's the perfect time to display a
          // "Content is cached for offline use." message.
          console.log('Content is cached for offline use.');
        }
      }
    };
  };
}

export default function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          return registration;
        })
        .then(onUpdateFound)
        .catch((error) => {
          console.error('ServiceWorker registration failed:', error);
        });
    });
  }
}
