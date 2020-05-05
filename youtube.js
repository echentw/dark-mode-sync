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

    function _encode(rawString, entryDelimiter, kvDelimiter) {
      return Object.entries(rawString)
        .map(entry => {
          return entry
            .join(kvDelimiter)
        })
        .join(entryDelimiter)
    }

    const decodeCookie = (rawString) => _decode(rawString, ';', /=(.+)/);
    const encodeCookie = (cookie) => _encode(cookie, '; ', '=');
    const decodePref = (rawValue) => _decode(rawValue, '&', '=');
    const encodePref = (pref) => _encode(pref, '&', '=');

    function getDarkModeCookie(rawCookie) {
      const cookie = decodeCookie(rawCookie);
      const pref = decodePref(cookie['PREF']);

      delete pref['f4'];
      pref['f6'] = '400';

      const encodedPref = encodePref(pref);
      return 'PREF=' + encodedPref;
    }

    function getLightModeCookie(rawCookie) {
      const cookie = decodeCookie(rawCookie);
      const pref = decodePref(cookie['PREF']);

      pref['f4'] = '4000000';
      delete pref['f6'];

      const encodedPref = encodePref(pref);
      return 'PREF=' + encodedPref;
    }

    function setCookie(cookie) {
      const suffix = ' ;path=/ ;secure ;domain=.youtube.com'
      document.cookie = cookie + suffix;
    }

    function makeUIDark() {
      document.documentElement.setAttribute('dark', true);
      document.querySelectorAll('ytd-masthead')[0].setAttribute('dark', true);
    }

    function makeUILight() {
      document.documentElement.removeAttribute('dark');
      if (!window.location.href.startsWith('https://www.youtube.com/watch')) {
        document.querySelectorAll('ytd-masthead')[0].removeAttribute('dark');
      }
    }

    function syncDarkMode() {
      const websiteDarkMode = document.documentElement.hasAttribute('dark');
      const systemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

      logger('websiteDarkMode', websiteDarkMode);
      logger('systemDarkMode', systemDarkMode);

      if (websiteDarkMode !== systemDarkMode) {
        logger('we need to sync');

        if (systemDarkMode) {
          makeUIDark();
          setCookie(getDarkModeCookie(document.cookie));
        } else {
          makeUILight();
          setCookie(getLightModeCookie(document.cookie));
        }
      }
    }

    syncDarkMode();

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      syncDarkMode();
    });

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes') {
          if (mutation.attributeName === 'dark') {
          logger(mutation);
            const systemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (document.documentElement.hasAttribute('dark')) {
              if (!systemDarkMode) {
                logger('trying to make UI light because of navigation');
                makeUILight();
              }
            } else {
              if (systemDarkMode) {
                logger('trying to make UI dark because of navigation');
                makeUIDark();
              }
            }
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
    });
  };

  const myScript = document.createElement('script');
  myScript.textContent = `( ${main.toString()} )()`;
  document.body.appendChild(myScript)
});
