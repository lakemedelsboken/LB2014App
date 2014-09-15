var tableFormatter = require("formatters/Tables");

function ATCListView(id) {

	var self = Ti.UI.createView({
		height: Ti.UI.SIZE,
	});

	var table = Ti.UI.createTableView();
	
	// Create a TableView.
	var tempTable = Ti.UI.createTableView();
	var tempTableIsVisible = true;
	
	
	// Populate the TableView data.
	var data = [
		{
			title:'Hämtar lista...', 
			//header:'', 
			font: {
				fontSize: 18, 
				fontFamily: "Avenir Next",
				fontWeight: "normal"
			}

		},
	];
	tempTable.setData(data);
		
	// Add to the parent view.
	self.add(tempTable);

	//var loadingIndicator = Ti.UI.createActivityIndicator({style: Ti.UI.iPhone.ActivityIndicatorStyle.DARK}); // top: 100, left: self.getWidth() / 2 - 10
	
	//self.add(loadingIndicator);
	//loadingIndicator.hide();

	self.loadAndRenderATCList = function(id, titles) {
		
		//loadingIndicator.show();
		//self.remove(tempTable);
		
		var idList = id;
		if (idList.indexOf("," > -1)) {
			idList = idList.split(",");
		} else {
			idList = [idList];
		}
		
		if (titles) {
			titles = decodeURIComponent(titles).split("##");
			for (var i=0; i < titles.length; i++) {
				titles[i] = titles[i].replace(/\_/g, " ").replace(/\-\-/g, " - ");
			}
		}		

		
		var listCounter = 0;
		
		var titleLookup = {};
		
		for (var i=0; i < idList.length; i++) {
			var url = globals.serverAddress + "/api/v1/atctree?parentid=" + idList[i] + "&apikey=" + globals.lbApiKey;

			if (titles && titles.length > 0) {
				var title = titles[i];
				titleLookup[url] = title; 
			}
			
			//Ti.API.log("Fetching: " + url);
			globals.fetchJSON(url, function(err, data, requestUrl) {
	
				listCounter++;
	
				if (err) {
					//TODO: Fix error message
					renderError(err);
				} else if (idList.length === listCounter) {
					var title = "";
					if (titleLookup[requestUrl] !== undefined) {
						title = titleLookup[requestUrl];
					}
					Flurry.logEvent("ATC", {"id": idList.join(",")});
					renderATCList(data, title, true);
				} else {
					var title = "";
					if (titleLookup[requestUrl] !== undefined) {
						title = titleLookup[requestUrl];
					}
					renderATCList(data, title);
				}
			});
		}
		
	};
	
	
	function renderATCList(list, title, complete) {
		Ti.API.log("Render atc list with " + list.length + " items");

		var parent = self.getParent();
		
		//Set title of window
//		if (parent) {
//			parent.setTitle(product.name);
//		}

		
		// Populate the TableView data.
		var data = [null];
		
		if (title) {
			data = [{title: title, id: null, hasChild: false, type: "header"}];
		}
		
		for(var i=0,j=list.length; i<j; i++){
			var code = list[i];
			if (code.children && code.children.length > 0) {
				
				for(var k=0,o=code.children.length; k<o; k++){
					var product = code.children[k];

					data.push({title: product.text, id: product.id, hasChild: false, disabled: product.noinfo, type: "product", images: product.images});
				}

			} else {
				data.push({title: code.text, id: code.id, hasChild: code.hasChildren, type: "atc"});
			}
		}

		tableFormatter.addMenuItems(table, data);
		
		
		if (tempTableIsVisible && complete) {

			// Listen for click events.
			table.addEventListener('click', function(e) {
				if (e.row.type === "atc") {
					Ti.App.fireEvent("atcSelected", {id: e.row.id, title: e.row.dataTitle});
				} else if (e.row.type === "product") {
					Ti.App.fireEvent("productSelected", {id: e.row.id});
				} else {
					//alert('title: \'' + e.row.title + '\', section: \'' + e.section.headerTitle + '\', index: ' + e.index);
				}
	
			});

			self.remove(tempTable);
			tempTableIsVisible = false;

			self.add(table);

		}
		
	}

	function renderError(err) {

		var errorLabel = Ti.UI.createLabel({
			text : "Lyckades inte hämta preparatlista, kontrollera din nätverksuppkoppling.",
			color : '#000',
			font : {fontSize:16, fontFamily: "Avenir Next"},
			height : "auto",
			width : self.getWidth() - 40,
			top : 20,
			left : 20,
			textAlign : 'center'
		});

		if (tempTableIsVisible) {
			tempTableIsVisible = false;
			self.remove(tempTable);
		}
		
		self.add(errorLabel);
	}

	if (id && id.length > 0) {
		self.loadAndRenderATCList(id);
	}
	
	return self;
}

module.exports = ATCListView;