window.addEventListener('load', () => {
  const main = () => {
    const logger = (arg1, arg2) => {
      if (arg2 === undefined) {
        console.log("[Dark Mode Sync]:", arg1);
      } else {
        console.log("[Dark Mode Sync]: " + arg1, arg2);
      }
    };

    function syncDarkMode() {
      const profileButton = document.getElementById('USER_DROPDOWN_ID');

      const websiteDarkMode = getComputedStyle(profileButton, null).getPropertyValue('--background') !== '#FFFFFF';
      const systemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (websiteDarkMode !== systemDarkMode) {
        const observer = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
            logger(mutation);
            if (mutation.addedNodes.length > 0) {
              const parentNode = mutation.addedNodes[0];
              const nightModeButton = parentNode.querySelector('button');
              nightModeButton.click();

              observer.disconnect();
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
