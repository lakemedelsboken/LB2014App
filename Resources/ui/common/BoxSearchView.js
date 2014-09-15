var tableFormatter = require("formatters/Tables");

function BoxSearchView(terms) {

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
		
	self.add(tempTable);

	self.loadAndRenderBoxSearch = function(terms) {
		
			var url = globals.serverAddress + "/api/v1/boxsearch?search=" + encodeURIComponent(terms) + "&apikey=" + globals.lbApiKey;

			globals.fetchJSON(url, function(err, data, requestUrl) {
	
				if (err) {
					//TODO: Fix error message
					renderError(err);
				} else {
					Flurry.logEvent("BoxSearch", {"terms": terms});
					renderBoxSearchList(data);
				}
			});
	};
	
	
	function renderBoxSearchList(list) {

		var parent = self.getParent();
				
		// Populate the TableView data.
		var data = [null].concat(list);
		
		if (list.length === 0) {
			data = [null, {title: "Preparatet nämns inte i några informationsrutor"}];
		}
		
		tableFormatter.addMenuItems(table, data);
		
		if (tempTableIsVisible) {

			if (list.length > 0) {
				table.addEventListener('click', function(e) {
					Ti.App.fireEvent("menuItemSelected", {id: e.row.id});
				});
			}

			self.remove(tempTable);
			tempTableIsVisible = false;

			self.add(table);

		}
		
	}

	function renderError(err) {

		var errorLabel = Ti.UI.createLabel({
			text : "Lyckades inte hämta lista, kontrollera din nätverksuppkoppling.",
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

	if (terms && terms.length > 0) {
		self.loadAndRenderBoxSearch(terms);
	}
	
	return self;
}

module.exports = BoxSearchView;