function GooglePlus() {
}

if (cordova.platformId == "browser") {

  /**
   * Checks that GooglePlus is available
   *
   * @param callback
   */
  GooglePlus.prototype.isAvailable = function (callback) {

      callback(isInitialized);
  };

  /**
   * Logs in the User
   *
   * @param options
   * @param successCallback
   * @param errorCallback
   */
  GooglePlus.prototype.login = function (options, successCallback, errorCallback) {

      var GoogleAuth = gapi.auth2.getAuthInstance();
      GoogleAuth.signIn({
          fetch_basic_profile: true
      }).then(successCallback, errorCallback);
  };

  /**
   * Tries to silently login the User
   *
   * @param options
   * @param successCallback
   * @param errorCallback
   */
  GooglePlus.prototype.trySilentLogin = function (options, successCallback, errorCallback) {

  };

  /**
   * Logs out the User
   *
   * @param successCallback
   * @param errorCallback
   */
  GooglePlus.prototype.logout = function (successCallback, errorCallback) {

  };

  /**
   * Disconnects the User
   *
   * @param successCallback
   * @param errorCallback
   */
  GooglePlus.prototype.disconnect = function (successCallback, errorCallback) {

  };

    var isInitialized = false;

    function onInit() {
        isInitialized = true;
    }

    function onFail() {
        isInitialized = false;
        console.log("GoogleAuth could not be initialized");
    }

    function initBrowser() {

        gapi.auth2.init({
            client_id: "",
            fetch_basic_profile: true
        });

        var GoogleAuth = gapi.auth2.getAuthInstance();
        GoogleAuth.then(onInit, onFail);
    }

    // initialize the Browser
    (function() {

        var plusLoaded = false;
        var clientPlusLoaded = false;

        loadScript("https://apis.google.com/js/plus.js", function() {
            plusLoaded = true;
            onCompleteLoad();
        });

        loadScript("https://apis.google.com/js/client:plus.js", function() {
            clientPlusLoaded = true;
            onCompleteLoad();
        });

        function onCompleteLoad() {

            if (plusLoaded && clientPlusLoaded) {
                initBrowser();
            }
        }

    })();

    function loadScript(sSrc, onLoad) {

        var oHead = document.head || document.getElementsByTagName("head")[0];

        function loadError (oError) {
            throw new URIError("The script " + oError.target.src + " is not accessible.");
        }

        var oScript = document.createElement("script");
        oScript.type = "text\/javascript";
        oScript.onerror = loadError;
        if (onLoad) { oScript.onload = onLoad; }
        oHead.appendChild(oScript);
        oScript.src = sSrc;
    }

} else {

  /**
   * Checks that GooglePlus is available
   *
   * @param callback
   */
  GooglePlus.prototype.isAvailable = function (callback) {
    cordova.exec(callback, null, "GooglePlus", "isAvailable", []);
  };

  /**
   * Logs in the User
   *
   * @param options
   * @param successCallback
   * @param errorCallback
   */
  GooglePlus.prototype.login = function (options, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "GooglePlus", "login", [options]);
  };

  /**
   * Tries to silently login the User
   *
   * @param options
   * @param successCallback
   * @param errorCallback
   */
  GooglePlus.prototype.trySilentLogin = function (options, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "GooglePlus", "trySilentLogin", [options]);
  };

  /**
   * Logs out the User
   *
   * @param successCallback
   * @param errorCallback
   */
  GooglePlus.prototype.logout = function (successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "GooglePlus", "logout", []);
  };

  /**
   * Disconnects the User
   *
   * @param successCallback
   * @param errorCallback
   */
  GooglePlus.prototype.disconnect = function (successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "GooglePlus", "disconnect", []);
  };
}



GooglePlus.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.googleplus = new GooglePlus();
  return window.plugins.googleplus;
};

cordova.addConstructor(GooglePlus.install);