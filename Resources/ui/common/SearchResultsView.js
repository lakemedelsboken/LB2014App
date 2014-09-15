var tableFormatter = require("formatters/Tables");

function getCurrentMenuWindow() {
	if (globals.osname === "android") {
		//Get last view from menu stack

		var currentView = globals.menu.windowStack[globals.menu.windowStack.length - 1];
		
		for (var i=0; i < currentView.getChildren().length; i++) {
			Ti.API.log("Child " + (i + 1) + " = " + currentView.getChildren()[i].getApiName());
		} 
		
		return currentView.getChildren()[1];
		
	} else {
		return globals.windowStack[globals.windowStack.length - 1];
	}
}

function getSearchBarFromWindow(window) {
	
	var result = undefined;

	if (globals.osname === "android") {
		var children = window.getChildren();
		
		for(var i=0,j=children.length; i<j; i++){
	
			if (children[i].getApiName() === "Ti.UI.SearchBar") {
						
				result = children[i];
				break;
			}
		}
	} else {
		var children = window.getChildren()[0].getChildren();
		
		for(var i=0,j=children.length; i<j; i++){
	
			if (children[i].getApiName() === "Ti.UI.SearchBar") {
						
				result = children[i];
				break;
			}
		}
	}
	
	return result;
}

function SearchResultsView() {
	var self = Ti.UI.createView({left: 0, top: 45, layout: "vertical", zIndex: 3});
	if (globals.osname === "android") {
		//self.backgroundColor = "#000";
		self.top = "45dp";
	} else {
		self.backgroundColor = "#fff";
	}

	var selector;

    var searchContexts = ["contentsearch", "medicinesearch"];

	if (globals.osname === "android") {

		var spacer = "125dp";
		var width = "121dp";
		var height = "35dp";
		 
		// TAB BAR
		selector = Ti.UI.createView({
		    width: "270dp",
		    height: "35dp",
		    left: "10dp",
		    backgroundColor:'transparent'
		});

		// TAB 1
		var tab1 = Ti.UI.createView({
		    width: width,
		    height: height,
		    left: "2dp",
		    bottom: "2dp",
		    backgroundColor:'#333',
		    borderRadius: 2,
		    index: 0
		});
		var tab1Label = Ti.UI.createLabel({
		    text:'Innehåll',
		    color:'#FFF'
		});
		tab1.add(tab1Label);
		selector.add(tab1);
		// TAB 2
		var tab2 = Ti.UI.createView({
		    width: width,
		    height: height,
		    left: spacer,
		    bottom: "2dp",
		    backgroundColor:'#000',
		    index: 1
		});
		var tab2Label = Ti.UI.createLabel({
		    text:'Läkemedel',
		    color:'#333'
		});
		tab2.add(tab2Label);
		selector.add(tab2);

		var currTab = tab1;		 
		//selector.index = 0;
		 
		tab1.addEventListener('click',function(event) {

			Ti.App.fireEvent("blurSearch", {});

			event.cancelBubble = true;
			currTab.backgroundColor = '#000';
			currTab.children[0].color = '#333';
			this.backgroundColor = '#333';
			this.children[0].color = '#FFF';
			//selector.index = 0;
			currTab = this;
			
	    	if (0 !== selector.lastIndex) {
	    		selector.lastIndex = 0;
	    		
	    		//Ti.API.debug("Switching context to 0: " + searchContexts[0]);
	    		globals.searchContext = searchContexts[0];
	    		//Ti.App.fireEvent("switchSearchContext", {});
	    		
				var currentWindow = getCurrentMenuWindow();
				var currentSearchBar = getSearchBarFromWindow(currentWindow);

				if (currentSearchBar && currentSearchBar.value !== "") {
					currentSearchBar.fireEvent("change", {instant: true});
				}
	
	    	}
			
			//selector.fireEvent("click", {index: 0});
		});
		
		tab2.addEventListener('click',function(event) {

			Ti.App.fireEvent("blurSearch", {});

			event.cancelBubble = true;
			currTab.backgroundColor = '#000';
			currTab.children[0].color = '#333';
			this.backgroundColor = '#333';
			this.children[0].color = '#FFF';
			//selector.index = 1;
			currTab = this;

			
	    	if (1 !== selector.lastIndex) {
	    		selector.lastIndex = 1;
	    		
	    		//Ti.API.debug("Switching context to 1: " + searchContexts[1]);
	    		globals.searchContext = searchContexts[1];
	    		//Ti.App.fireEvent("switchSearchContext", {});
	    		
				var currentWindow = getCurrentMenuWindow();
				var currentSearchBar = getSearchBarFromWindow(currentWindow);

				
				if (currentSearchBar && currentSearchBar.value !== "") {
					currentSearchBar.fireEvent("change", {instant: true});
				}
	
	    	}

			//selector.fireEvent("click", {index: 1});
		});

	} else {
		selector = Ti.UI.iOS.createTabbedBar({
			labels:['Innehåll', 'Läkemedel'],
	    	style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
	    	height:25,
	    	width: 250,
	    	top: 5,
	    	index: 0
	    });

	    selector.addEventListener("click", function(event) {

			Ti.App.fireEvent("blurSearch", {});

	    	if (event.index !== undefined && event.index !== selector.lastIndex) {
	    		selector.lastIndex = event.index;
	    		
	    		//Ti.API.debug("Switching context to " + event.index + ": " + searchContexts[event.index]);
	    		globals.searchContext = searchContexts[event.index];
	    		//Ti.App.fireEvent("switchSearchContext", {});
	    		
				var currentWindow = getCurrentMenuWindow();
				var currentSearchBar = getSearchBarFromWindow(currentWindow);
				
				if (currentSearchBar && currentSearchBar.value !== "") {
					currentSearchBar.fireEvent("change", {instant: true});
				}
	
	    	}
	    });

	}
    
    selector.lastIndex = 0;

	self.add(selector);

	var table = Ti.UI.createTableView({top: 6});

	if (globals.osname === "android") {
		table.top = "7dp";
	}
	
	table.addEventListener("dragstart", function() {
		Ti.App.fireEvent("blurSearch", {});
	});
	
	table.addEventListener("click", function(event) {

		if (event.row.type && event.row.type === "product") {
			//Ti.API.log(event.row.type);
			Ti.App.fireEvent('productSelected', {
				id: event.row.id,
				target: "center"
			});
		} else if (event.row.type && event.row.type === "atc") {
			//Ti.API.log(event.row.type);
			Ti.App.fireEvent('atcSelected', {
				id: event.row.id,
				target: "center",
				title: event.row.dataTitle
			});

		} else {
			Ti.App.fireEvent('menuItemSelected', {
				id: event.row.id
			});
		}
	});
	
	var section = Ti.UI.createTableViewSection({headerTitle: "Sökresultat"});

	table.data = [section];
	self.add(table);

	self.clear = function() {
		section = Ti.UI.createTableViewSection({headerTitle: "Sökresultat"});
		table.data = [section];
	};
	
	self.addSearchResult = function(item) {
		var row = tableFormatter.getFormattedRow(item, false);
		section.add(row);
		table.data = [section];
	};

	self.addSearchResults = function(items) {

		for(var i=0,j=items.length; i<j; i++){
			var item = items[i];
			var row = tableFormatter.getSearchFormattedRow(item);
			section.add(row);
		}

		table.data = [section];
	};
	
	return self;
}

module.exports = SearchResultsView;
