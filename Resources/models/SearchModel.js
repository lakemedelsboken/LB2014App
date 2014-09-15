
var SearchModel = {
	cache: {},
	lastSearchUrl: "",
	search: function(terms, callback) {

		SearchModel.serverSearch(terms, function(err, data) {
			if (err) {
				SearchModel.localSearch(terms, function(err, data) {
					if (err) {
						callback(err);
					} else {
						callback(null, data);
					}
				});
			} else {
				callback(null, data);
			}
		});

	},
	serverSearch: function(terms, callback) {

		var url = globals.serverAddress + "/api/v1/" + globals.searchContext + "?search=" + encodeURIComponent(terms) + "&apikey=" + globals.lbApiKey;

		SearchModel.lastSearchUrl = url;		
		//Ti.API.debug("Searching: " + url);
		
		if (SearchModel.cache[url]) {
			callback(null, SearchModel.cache[url]);
		} else {
			Flurry.logEvent("Search", {terms: terms, context: globals.searchContext});

			globals.fetchJSON(url, function(err, data) {

				if (err) {
					//TODO: Properly log error
					Ti.API.error(err);
					callback("Ingen koppling till server");
				} else {
					SearchModel.cache[url] = data;
					if (SearchModel.lastSearchUrl === url) {
						callback(null, data);
					} else {
						Ti.API.log("Skipping return of results for " + url);
						return;
					}
				}
			});
		}

		
	},
	localSearch: function(terms, callback) {
		//TODO: Implement local search
		callback("Ingen koppling till server", []);
	}
	
};

module.exports = SearchModel;