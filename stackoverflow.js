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

    function syncDarkMode() {
      logger('running sync dark mode');

      // 0 == Light mode
      // 1 == Dark mode
      // 2 == Match system's dark mode
      const THEME = 2;

      const { fkey, accountId } = StackExchange.options.user;

      logger('sending post request');

      $.post("/account/set-theme-preference", { "fkey": fkey, "accountId": accountId, "theme": THEME })
        .done(function (response) {
            logger('received successful response');

            var theme = response.themeClass || '';

            $('body').removeClass(function (i, oldClassList) {
                return (oldClassList.match(/(^|\s)theme-\S+/g) || []).join(' ');
            });
            $('body').addClass(theme);
        })
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
