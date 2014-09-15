var globals = {};
var Flurry = require("ti.flurry");
var settings = require("settings");

(function() {

	globals.osname = Ti.Platform.osname;
	globals.version = Ti.Platform.version;
	globals.height = Ti.Platform.displayCaps.platformHeight;
	globals.width = Ti.Platform.displayCaps.platformWidth;

	globals.serverAddress = settings.serverAddress;

	globals.lbApiKey = settings.lbiOSApiKey;
	
	var flurryId;

	if (globals.osname === "android") {
		
		globals.lbApiKey = settings.lbAndroidApiKey;
		
		flurryId = settings.flurryAndroidId;

		Flurry.debugLogEnabled = true;
		Flurry.eventLoggingEnabled = true;

		Flurry.initialize(flurryId);

		Flurry.secureTransportEnabled = false;

	} else {
		flurryId = settings.flurryiOSId;
		
		Flurry.debugLogEnabled = true;
		Flurry.eventLoggingEnabled = true;

		Flurry.initialize(flurryId);
		
		Flurry.reportOnClose = true;
		Flurry.sessionReportsOnPauseEnabled = true;
		Flurry.secureTransportEnabled = false;
	}
	
	
	//Default to using the content search
	globals.searchContext = "contentsearch";
	
	globals.fontawesome = require('lib/IconicFont').IconicFont({ font: 'lib/FontAwesome', ligature: false}); 

	globals.isTablet = true; //UI is adapted to scale with screen size;
	globals.fetchJSON = fetchJSON;

	var Window;
	if (globals.isTablet) {
		Window = require('ui/tablet/ApplicationWindow');
	} else {
		if (globals.osname === 'iphone') {
			Window = require('ui/handheld/ios/ApplicationWindow');
		}
		else {
			Window = require('ui/handheld/android/ApplicationWindow');
		}
	}
	globals.context = new Window();

	globals.context.open();
})();

var jsonCache = {};

function fetchJSON(url, callback) {

	var xhr = Titanium.Network.createHTTPClient();
	 
	xhr.onload = function() {
		var result = null;
		try {
			result = JSON.parse(this.responseText);
		} catch(err) {
			result = null;
		}
		if (result === null) {
			callback("Could not parse JSON response: " + this.responseText, null, url);
		} else {
			jsonCache[url] = result;
			callback(null, result, url);
		}
	};
	
	xhr.onerror = function(e) {
		callback("Ett fel inträffade, var god försök igen senare.", null, url);
	};

	if (jsonCache[url] !== undefined) {
		callback(null, jsonCache[url], url);
	} else {
		xhr.open('GET', url);
		xhr.send();	
	}
	
}


