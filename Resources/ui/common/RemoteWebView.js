function RemoteWebView (url, id, width){


	Ti.API.log("Opening: " + url + " with id: " + id);

	var viewWidth = Ti.UI.FILL; 

	if (width !== undefined) {
		viewWidth = width;
	}

	var self = Ti.UI.createWebView({backgroundColor: "#fff", width: viewWidth});

	var addedHtml = [];

	self.currentId = id;
	
	self.scrollToCurrentId = function() {
		if (self.currentId !== null && self.currentId !== undefined) {
			self.evalJS('location.hash="#' + self.currentId + '"');
		}
	};

	self.addEventListener("load", self.scrollToCurrentId);
		
	self.openUrl = function(url, id) {
		fetchUrl(url, function(err, html) {
			if (err) {
				self.getParent().title = "Ett fel inträffade";
				self.setHtml("<html><head><style>body {font-family: 'Avenir Next', 'Helvetica Neue Ultra Light', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; text-align: center;}</style></head><body>Kunde inte öppna sidan, kontrollera din internetanslutning.</body></html>");
				Ti.API.log(err);
			} else {
				html = html.replace(/\{server\}/g, globals.serverAddress);
				//Find title
				var title = "";
				
				if (html.indexOf("<title>") > -1 && html.indexOf("</title>") > -1) {
					title = html.split("</title>")[0];
					title = title.split("<title>");
					title = title[title.length - 1];
					
					self.getParent().title = title;
				}
				
				self.setHtml(html);
			}
		});
	};

	if (url) {
		self.openUrl(url, id);
	}
	
	return self;
}

module.exports = RemoteWebView;