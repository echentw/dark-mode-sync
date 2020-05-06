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

    function _decode(rawString, entryDelimiter, kvDelimiter) {
      return rawString
        .split(entryDelimiter)
        .map(rawItem => {
          return rawItem
            .trim()
            .split(kvDelimiter)
        })
        .reduce((obj, item) => {
          const key = item[0];
          const value = item[1];
          obj[key] = value;
          return obj;
        }, {})
    }

    function readCookie(rawCookies, name) {
      const decodedCookies = _decode(rawCookies, ';', /=(.+)/);
      return decodedCookies[name];
    }

    function encodeCookie(name, value, domain) {
      const cookie = `${name}=${value}`;
      const suffix = ` ;path=/ ;secure ;domain=.${domain}`
      return cookie + suffix;
    }

    function syncDarkMode() {
      logger('running sync dark mode');

      const cookieValue = readCookie(document.cookie, 'night_mode');
      const websiteDarkMode = (cookieValue !== undefined) && (cookieValue === "1");
      const systemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (websiteDarkMode !== systemDarkMode) {
        logger('we need to sync');
        const newValue = systemDarkMode ? "1" : "0";
        const encodedCookie = encodeCookie('night_mode', newValue, 'twitter.com');
        document.cookie = encodedCookie;
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
