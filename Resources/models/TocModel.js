var masterIndexFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "db/masterIndex.json");
var masterIndex = {};

if (masterIndexFile.exists()) {
	Ti.API.debug("Opening masterIndex.json");
	masterIndex = JSON.parse(masterIndexFile.read().text);
} else {
	Ti.API.error("masterIndex.json does not exist");
}

var divisions = {};

for (var key in masterIndex) {
	
	var item = masterIndex[key];
	if (divisions[item.division] === undefined) {
		divisions[item.division] = [];
	}
	
	divisions[item.division].push({id: key.toLowerCase(), title: item.name, hasChild: true});
	
}

var chapters = {};

var chaptersDir = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "db/chapters");
var chapterFiles = chaptersDir.getDirectoryListing();

for (var i=0; i < chapterFiles.length; i++){ 
	var fileName = chapterFiles[i].toString();
	var chapterId = fileName.split("_")[0];
	chapters[chapterId] = fileName;
}

Ti.API.debug("Populated chapters:");
Ti.API.debug(JSON.stringify(chapters));

var TocModel = {

	cache: {},	
	getIndex: function() {
		return masterIndex;
	},
	getChildren: function(parentId) {

		var self = this;
		var result = [];

		if (self.cache[parentId] !== undefined) {
			result = self.cache[parentId];
		} else {
			if (parentId === "root") {
				//Empty title item
				result.push(null);
				for (var division in divisions) {
					result.push({title: division, hasChild: true, id: division});
				}
			} else if (parentId) {
				if (divisions[parentId] !== undefined) {
					result.push({title: parentId, id: null, hasChild: false});
					result = result.concat(divisions[parentId]);
				} else {
					//Get correct chapter
					var chapterId = null;
					if (parentId.indexOf("_") > 1) {
						var possibleChapterId = parentId.toLowerCase().split("_")[0];
						if (chapters[possibleChapterId] !== null) {
							chapterId = possibleChapterId;
						}
					} else {
						//Maybe try just as an id
						if (chapters[parentId] !== undefined) {
							chapterId = parentId;
						}
					}
					
					if (chapterId !== null) {
						var indexFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "db/chapters/" + chapters[chapterId]);
						
						if (indexFile.exists()) {
							var chapterIndex = JSON.parse(indexFile.read().text);

							var parentItem = null;
							
							if (parentId.indexOf("_") > -1) {
								//Try to find a specific item by id
								for (var i=0; i < chapterIndex.length; i++) {
									if (chapterIndex[i].id === parentId) {
										parentItem = chapterIndex[i];
										break; 
									}
								}
							} else {
								//No true id provided, get the second item (root item is the first one)
								parentItem = chapterIndex[1];
							}

							if (parentItem !== null) {
								result.push({title: parentItem.title, id: parentItem.id, hasChild: false});
								for (var i=0; i < chapterIndex.length; i++) {
									if (chapterIndex[i].parentId === parentItem.id) {
										var item = chapterIndex[i];
										item.hasChild = item.hasChildren;
										result.push(item);
									}
								}
							} else {
								Ti.API.error("Could not find parentId: " + parentId);
							}
						} else {
							Ti.API.error("Could not find file at db/chapters/" + chapters[chapterId]);
						}
					} else {
						Ti.API.error("Could not find chapter for id: " + parentId);
					}
					
				}
			} else {
				Ti.API.error("parentId was " + parentId);
			}
			
			self.cache[parentId] = result;
		}

		Ti.API.debug("TOC result for parentId = " + parentId);
		Ti.API.debug(JSON.stringify(result));

		return result;
	}
	
};

module.exports = TocModel;
