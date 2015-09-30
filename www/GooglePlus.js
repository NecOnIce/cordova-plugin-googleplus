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

        if (!GoogleAuth) {
            errorCallback("The GoogleAuth Object was not initialized.");
        }

        function onLogin() {

            var GoogleUser = GoogleAuth.currentUser.get();
            var GoogleProfile = GoogleUser.getBasicProfile();
            var GoogleAuthResponse = GoogleUser.getAuthResponse();

            // create Interface specific response Object
            var response = {};
            response.email = GoogleProfile.getEmail();
            response.userId = GoogleProfile.getId();
            response.displayName = GoogleProfile.getName();
            response.imageUrl = GoogleProfile.getImageUrl();
            response.idToken = GoogleAuthResponse.id_token;
            response.oauthToken = GoogleAuthResponse.access_token;

            // this stuff is not implemented at the Moment because for
            // this we need additional scopes and an additional Request to Google.
            response.gender = "";
            response.givenName = "";
            response.middleName = "";
            response.familyName = "";
            response.birthday = "";
            response.ageRangeMin = "";
            response.ageRangeMax = "";

            successCallback(response);
        }

        GoogleAuth.signIn({
            fetch_basic_profile: true
        }).then(onLogin, errorCallback);
    };

    /**
     * Tries to silently login the User
     *
     * @param options
     * @param successCallback
     * @param errorCallback
     */
    GooglePlus.prototype.trySilentLogin = function (options, successCallback, errorCallback) {

        window.plugins.googleplus.login(options, successCallback, errorCallback);
    };

    /**
     * Logs out the User
     *
     * @param successCallback
     * @param errorCallback
     */
    GooglePlus.prototype.logout = function (successCallback, errorCallback) {

        var GoogleAuth = gapi.auth2.getAuthInstance();

        if (!GoogleAuth) {
            errorCallback("The GoogleAuth Object was not initialized.");
        }

        GoogleAuth.signOut().then(successCallback, errorCallback);
    };

    /**
     * Disconnects the User
     *
     * @param successCallback
     * @param errorCallback
     */
    GooglePlus.prototype.disconnect = function (successCallback, errorCallback) {

        var GoogleAuth = gapi.auth2.getAuthInstance();

        if (!GoogleAuth) {
            errorCallback("The GoogleAuth Object was not initialized.");
        }

        GoogleAuth.disconnect();
        successCallback();
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
            client_id: "507443783824-8j35s07cqffdq9mlia7lia4ht5kbb42d.apps.googleusercontent.com",
            fetch_basic_profile: true
        });

        var GoogleAuth = gapi.auth2.getAuthInstance();
        GoogleAuth.then(onInit, onFail);
    }

    // initialize the Browser
    (function() {

        loadScript("https://apis.google.com/js/platform.js", function() {
            //plusLoaded = true;
            gapi.load('auth2', function() {
                initBrowser();
            });
        });

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