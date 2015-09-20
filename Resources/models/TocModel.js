//var masterIndexFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "db/masterIndex.json");

var masterIndex = null;
var divisions = null;

var TocModel = {

	cache: {},	
	getIndex: function(callback) {
		if (masterIndex !== null) {
			return callback(null, masterIndex);
		} else {
			fetchJSON(globals.serverAddress + "/api/v1/appindex", function(err, index) {
				if (err) {
					//Ti.API.error(err);
					//masterIndex = {"Err": {name: "Kunde inte hämta kapitelinformation, kontrollera din internetanslutning."}};
					//divisions["Kontrollera din internetanslutning"] = [{id: "reload", title: "", hasChild: false}]; 
					return callback(err);
				} else {
					masterIndex = index;
					divisions = {};
				}
			
				for (var key in masterIndex) {
					
					var item = masterIndex[key];
					if (divisions[item.division] === undefined) {
						divisions[item.division] = [];
					}
					
					divisions[item.division].push({id: key.toLowerCase(), title: item.name, hasChild: true, url: item.url});
				}
				return callback(null, masterIndex);
			});
		}
	},
	getChildren: function(parentId, chapterUrl, callback) {

		var self = this;
		var result = [];

		self.getIndex(function(err, index) {

			if (err) {
				return callback(err);
			}

			if (self.cache[parentId] !== undefined) {
				result = self.cache[parentId];
				return callback(null, result);
			} else {
				if (parentId === "root") {
					//Empty title item
					result.push(null);
					for (var division in divisions) {
						result.push({title: division, hasChild: true, id: division});
					}
					return callback(null, result);
				} else if (parentId) {
					if (divisions[parentId] !== undefined) {
						result.push({title: parentId, id: null, hasChild: false});
						result = result.concat(divisions[parentId]);
						return callback(null, result);
					} else {
						//Get correct chapter
						var chapterId = null;
						if (chapterUrl) {
							chapterId = chapterUrl;
						}
						
						if (chapterId !== null) {
							fetchJSON(globals.serverAddress + chapterId.replace(".html", ".index"), function(err, chapterIndex) {
								if (err) {
									return callback(err, result);
								} else {

									var apiChapterUrl = globals.serverAddress + "/api/v1/appify?apikey=" + globals.lbApiKey + "&url=" + encodeURIComponent(chapterId.replace(".index", ".html"));
									//Fix url for each item
									for (var k=0,l=chapterIndex.length; k<l; k++){
										if (chapterIndex[k].hasChildren) {
											chapterIndex[k].url = chapterId.replace(".html", ".index");
										} else {
											chapterIndex[k].url = apiChapterUrl;
										}
									}

									var parentItem = null;
									
									if (parentId) {
										//Try to find a specific item by id
										for (var i=0; i < chapterIndex.length; i++) {
											if (chapterIndex[i].id === parentId) {
												parentItem = chapterIndex[i];
												break; 
											}
										}
									}
									
									if (parentItem === null) {
										
										//Find first item where level == 1
										for (var i=0; i < chapterIndex.length; i++) {
											if (chapterIndex[i].level === 1) {
												parentItem = chapterIndex[i];
												break; 
											}
										}
	
										//Last resort																			
										if (parentItem === null && chapterIndex.length > 0) {
											parentItem = chapterIndex[1];
										}
									}
		
									if (parentItem !== null) {
										result.push({title: parentItem.title, id: parentItem.id, hasChild: false, url: apiChapterUrl});
										for (var i=0; i < chapterIndex.length; i++) {
											if (chapterIndex[i].parentId === parentItem.id) {
												var item = chapterIndex[i];
												item.hasChild = item.hasChildren;
												result.push(item);
											}
										}
										return callback(null, result);
	
									} else {
										Ti.API.error("Could not find parentId: " + parentId);
										return callback(new Error("Could not find chapter for id: " + parentId));
									}
								}									
							});
							
						} else {
							Ti.API.error("Could not find chapter for id: " + parentId + ", chapterId: " + chapterId);
							return callback(new Error("Could not find chapter for id: " + parentId));
						}
						
					}
				} else {
					Ti.API.error("parentId was " + parentId);
					return callback(new Error("Could not find chapter for id: " + parentId));
				}

				//self.cache[parentId] = result;
			}
			//return callback(null, result);
		});


		//Ti.API.debug("TOC result for parentId = " + parentId);
		//Ti.API.debug(JSON.stringify(result));

		//return result;
	}
	
};

module.exports = TocModel;
