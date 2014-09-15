var chapters = {};

var chaptersDir = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "db/chapters");
var chapterFiles = chaptersDir.getDirectoryListing();

var ProductView = require("ui/common/ProductView");

var tocModel = require("models/TocModel");

//Populate chapters
for (var i=0; i < chapterFiles.length; i++){ 
	var fileName = chapterFiles[i].toString();
	var chapterId = fileName.split("_")[0];
	chapters[chapterId] = fileName;
}

function ChapterView() {

	var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'chapters/index.html');
	
	var self = Ti.UI.createWebView({
		url: file.nativePath,
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		baseUrl: Ti.Filesystem.resourcesDirectory
	});

	self.scrollToCurrentId = function(event) {
		if (self.currentId !== null) {
			//Ti.API.log("currentId = " + currentId);
			//setTimeout(function() {
				self.evalJS('location.hash="#' + self.currentId + '"');
			//}, 500);
		}
	};

	self.addEventListener("load", self.scrollToCurrentId);

	self.currentId = null;
	
	self.openChapter = function(id, forcedChapterId) {
	
		if ((id && id.indexOf("_") > -1) || id && forcedChapterId) {
			var chapterId = "";

			if (forcedChapterId) {
				chapterId = forcedChapterId;
			} else {
				chapterId = id.split("_")[0];
			}
			
			Flurry.logEvent("Chapter", {id: chapterId, name: chapters[chapterId].replace(".json", "")});

			var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "chapters/" + chapters[chapterId].replace(".json", ".html"));

			//var chapterPath = Ti.Filesystem.resourcesDirectory + "chapters/" + chapters[chapterId].replace(".json", ".html");
			var chapterPath = file.nativePath;
	
			//Set current id
			self.currentId = id;
	
			var scroll = true;
	
			//Open the chapter and scroll to correct position
			if (self.getUrl().indexOf(chapterPath) !== 0) {
				Ti.API.log("Setting url to " + chapterPath + " for webView, previous: " + self.getUrl());
				self.setUrl(chapterPath);
		
				var title = "";
	
				//var masterIndex = tocModel.getIndex();
				//if (masterIndex[chapterId.toUpperCase()] !== undefined) {
				//	title = masterIndex[chapterId.toUpperCase()].name;
				//	self.setTitle(title);
				//}
				
				scroll = false;
			}
			
			if (scroll) {
				self.scrollToCurrentId();
			}
	
	
		}
	};
	
	//if (globals.osname === "android") {
		
	//}
	
	return self;
};

module.exports = ChapterView;
