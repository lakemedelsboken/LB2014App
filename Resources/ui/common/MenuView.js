var tocModel = require("models/TocModel");
//var TocMenuController = require("controllers/TocMenuController");
var tableFormatter = require("formatters/Tables");
var SearchResultsView = require("ui/common/SearchResultsView");
var searchModel = require("models/SearchModel");

globals.searchBars = [];

function blurSearch() {
	for(var i = 0, j = globals.searchBars.length; i < j; i++){
		globals.searchBars[i].blur();
	}
}

var timer = null;

function createSearchBar() {
	//Create search box
	var searchBar;
	
	if (globals.osname === "android") {
		searchBar = Ti.UI.createSearchBar({hintText: "Sök", height: "40dp", left: "5dp", top: 0, right: "5dp"});
	} else {
		searchBar = Ti.UI.createSearchBar({hintText: "Sök", autocorrect: false, softKeyboardOnFocus: true, top: 0}); //tintColor: "#000", barColor: "#555", borderColor: "#eee"
	}

	//Add to collection
	globals.searchBars.push(searchBar);
	
	searchBar.addEventListener("return", function(event) {

		//var send = {terms: event.source.value};

		//Ti.App.fireEvent("search", send);

		blurSearch();
	});
	
	searchBar.addEventListener("change", function(event) {

		var send = {terms: event.source.value};

		if (send.terms.length > 0 && !event.instant) {
			timer && clearTimeout(timer);
			timer = setTimeout(function() {
				Ti.App.fireEvent("search", send);
			}, 700);
		} else {
			timer && clearTimeout(timer);
			Ti.App.fireEvent("search", send);
		}

	});

	return searchBar;
	
}

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

function getMenuFromWindow(window) {
	
	var result = undefined;

	var children = [];

	if (globals.osname === "android") {
		children = window.getChildren();
	} else {
		children = window.getChildren()[0].getChildren();
	}
	
	for(var i=0,j=children.length; i<j; i++){

		Ti.API.log(children[i].getApiName());

		if (children[i].getApiName() === "Ti.UI.TableView") {
					
			result = children[i];
			break;
		}
	}
	
	return result;
}

//Master View Component Constructor
function MenuView() {
	//create object instance, parasitic subclass of Observable
	var self = Ti.UI.createView({
		//backgroundColor: "#fff",
		//layout: "vertical",
		title: "LB"
	});

	if (globals.osname === "android") {
		//self.backgroundColor = "#000";
	}

	self.add(createSearchBar());

	//Listen to event saying we should blur the search
	Ti.App.addEventListener("blurSearch", function() {
		blurSearch();
	});


	var searchResults = new SearchResultsView();
	var searchResultsAreVisible = false;

	//Listen for search on handheld
	Ti.App.addEventListener("search", function(event) {
		if (event.terms.length > 0) {
			//Ti.API.log("Search for: " + event.terms);
							
			//Get current window in stack
			var currentWindow = getCurrentMenuWindow();
			var currentMenu = getMenuFromWindow(currentWindow);

			//Hide current menu
			if (currentMenu) {
				currentMenu.hide();
			}

			searchResults.clear();
			searchResults.addSearchResult({title: "Söker efter: " + event.terms, hasChild: false, id: null});

			if (!searchResultsAreVisible) {
				//Show search results
				searchResults.setTop("44dp");
				searchResults.setLeft(0);
				currentWindow.add(searchResults);
				//searchResults.setWidth(currentWindow.size.width);
				
				Ti.API.log("Added search results to current window");
				
				for (var i=0; i < currentWindow.getChildren().length; i++) {
					Ti.API.log("Child " + i + " = " + currentWindow.getChildren()[i].getApiName());
				} 

				
				searchResultsAreVisible = true;
			}
			
			
			searchModel.search(event.terms, function(err, data) {

				var items = null; 
		
				if (err) {
					items = [{title: err, hasChild: false, id: null}]; 
				} else {
					items = data; 
				}
				
				searchResults.clear();
				if (items.length > 0) {
					searchResults.addSearchResults(items);
				} else {
					searchResults.addSearchResults([{title: "Din sökning gav tyvärr inget resultat", hasChild: false, id: null}]);
				}
				
			});
											
		} else {

			//Show the regular menu again
			var currentWindow = getCurrentMenuWindow();
			var currentMenu = getMenuFromWindow(currentWindow);

			if (searchResultsAreVisible) {
				currentWindow.remove(searchResults);
			}

			searchResultsAreVisible = false;
			
			if (currentMenu) {
				currentMenu.show();
			}
			
		}
	});


	var tableData = tocModel.getChildren("root");

	var table = Ti.UI.createTableView({
		top: "44dp"
	});

	tableFormatter.addMenuItems(table, tableData);

	table.addEventListener("dragstart", function(event) {
		blurSearch();
	});


	function clickMenuItemHandler(event) {
		if (event.row.hasChild) {
			//Check for children
			
			//console.log(event);
			
			var children = tocModel.getChildren(event.row.id);
			//Ti.API.log(children);

			if (children.length > 0) {

				var view = Ti.UI.createView({
					backgroundColor: "#fff",
					//layout: "vertical"
				});
				var table = Ti.UI.createTableView({
					top: "44dp"
				});

				var title = "";
				
				if (children.length > 0) {
					title = children[0].title;
				}
				
				tableFormatter.addMenuItems(table, children);
				
				table.addEventListener("click", clickMenuItemHandler);
				table.addEventListener("dragstart", blurSearch);

				//self.addMenu(children);
				var searchBar = createSearchBar(); 

				view.add(searchBar);
				view.add(table);
				//Ti.API.log(globals);
								
				var window = Titanium.UI.createWindow({
				    backgroundColor: "#fff",
				    //navTintColor: "#000",
				    title: title,
				    translucent: false
				});
				
				if (Ti.Platform.osname === "android") {
					window.setBackgroundColor("#000");
					view.setBackgroundColor("#000");
					
					var version = Ti.Platform.version.split(".");
					var majorVersion = version.shift();
		
					if (majorVersion < 4) {
						window.backgroundColor = "#000";
					}
				}

				window.addEventListener("close", function(event) {
					searchResultsAreVisible = false;
					globals.windowStack.pop();
				});
				
				window.add(view);
				
				searchResultsAreVisible = false;
				globals.windowStack.push(window);
				globals.menu.openWin(window);
			} else {
				Ti.API.error(event.row.id + " has no children");
			}
		} else {
			Ti.App.fireEvent('menuItemSelected', {
				id: event.row.id
			});
		}
		
	}

	table.addEventListener('click', clickMenuItemHandler);

	self.add(table);
			
	return self;
};

module.exports = MenuView;