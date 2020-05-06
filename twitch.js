window.addEventListener('load', () => {

  const main = () => {
    const LOGGING = false;

    let logger;
    if (LOGGING) {
      logger = (arg1, arg2) => {
        if (arg2 === undefined) {
          console.log("[Dark Mode Sync]:", arg1);
        } else {
          console.log("[Dark Mode Sync]: " + arg1, arg2);
        }
      };
    } else {
      logger = () => {};
    }

    async function syncDarkMode() {
      logger('running sync dark mode');

      const key = 'twilight.theme';

      const websiteDarkMode = document.documentElement.classList.contains('tw-root--theme-dark')
      const systemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (websiteDarkMode !== systemDarkMode) {
        logger('we need to sync');

        let toggleButton = document.querySelectorAll('[data-a-target="dark-mode-toggle"] .tw-drop-down-menu-input-item__label')[0]

        if (toggleButton) {
          logger('success 1');
          toggleButton.click();
          return;
        }

        logger('here');

        const profileButton = document.querySelectorAll('[data-a-target="user-menu-toggle"]')[0];

        let done = false;
        const observer = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
            logger(mutation);
            toggleButton = document.querySelectorAll('[data-a-target="dark-mode-toggle"] .tw-drop-down-menu-input-item__label')[0]
            if (toggleButton && !done) {
              logger('success');
              toggleButton.click();
              profileButton.click();
              observer.disconnect();
              done = true;
            }
          });
        });

        observer.observe(document.documentElement, {
          childList: true,
          subtree: true,
        });

        profileButton.click();
      }
    }

    syncDarkMode();

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      syncDarkMode();
    });
  };


  const myScript = document.createElement('script');
  myScript.textContent = `( ${main.toString()} )()`;
  document.body.appendChild(myScript)
});
