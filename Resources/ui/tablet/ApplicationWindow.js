
var tocModel = require("models/TocModel");


function ApplicationWindow() {

	var MenuView = require('ui/common/MenuView'),
		ChapterView = require('ui/common/ChapterView'),
		ATCListView = require('ui/common/ATCListView'),
		BoxSearchView = require('ui/common/BoxSearchView'),
		ProductView = require('ui/common/ProductView'),
		ImagesView = require('ui/common/ImagesView'),
		LocalWebView = require('ui/common/LocalWebView'),
		NappDrawerModule = require('dk.napp.drawer'),
		CPNavigationWindow = require("controllers/CPNavigationWindow");

	var menuView = new MenuView();

	globals.chapters = {};
	
	var chaptersDir = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "db/chapters");
	var chapterFiles = chaptersDir.getDirectoryListing();
	
	//Populate chapters
	for (var i=0; i < chapterFiles.length; i++){ 
		var fileName = chapterFiles[i].toString();
		var chapterId = fileName.split("_")[0];
		globals.chapters[chapterId] = fileName;
	}

	globals.leftDrawerWidth = 270;
	globals.rightDrawerWidth = 270;

	if (Ti.Platform.osname === "ipad") {
		globals.leftDrawerWidth = 320;
		globals.rightDrawerWidth = 400;
	}

		
	var masterContainer = Ti.UI.createWindow({
		top: 0,
		bottom: 0,
		left: 0,
		width: globals.leftDrawerWidth,
		zIndex: 1,
		translucent: false,
		navBarHidden: false,
		backgroundColor: "#fff",
		title: "Läkemedelsboken"
	});

	masterContainer.add(menuView);

	globals.windowStack = [];
	if (globals.osname === "android") {
		globals.windowStack.push(menuView);
		masterContainer.backgroundColor = "#000";
	} else {
		globals.windowStack.push(masterContainer);
	}

	
	var detailContainer = Ti.UI.createWindow({
		top: 0,
		bottom: 0,
		right: 0,
		left: 0,
		zIndex: 0,
		navBarHidden: false,
		translucent: false,
		backgroundColor: "#fff",
		title: "Information"
	});

	//Build informationView
	var informationView = Ti.UI.createScrollView({backgroundColor: "#fff", layout: "vertical", contentHeight: "auto"});

	var imageFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "images/cover.png");

	var lbImage = Ti.UI.createImageView({image: imageFile.nativePath, top: "10dp", width: "80%"});

	if (Ti.Platform.osname === "ipad") {
		lbImage.width = 400;
	}
	informationView.add(lbImage);

	var infoLabel = Ti.UI.createLabel({
		color : '#000',
		font : {fontSize:12, fontFamily: "Avenir Next"},
		width: "80%",
		textAlign : 'left',
		
	});

	infoLabel.text = "Detta är den 19:e utgåvan av Läkemedelsboken (LB). Med anledning av apoteksmarknadens omreglering har Läkemedelsverket från och med förra utgåvan tagit över ansvaret för utgivningen från Apoteket AB, som gett ut boken sedan den första utgåvan 1977. LB finns tillgänglig i elektroniskt format och som en traditionellt tryckt bok.";
	infoLabel.text += "\n\nKapitelförfattarna svarar själva för innehållet även om en redaktionskommitté, fristående från Läkemedelsverkets myndighetsuppdrag, granskat innehållet och i dialog med författarna vinnlagt sig om att innehållet inte står i strid med officiella direktiv, riktlinjer eller vetenskap och beprövad erfarenhet. Ledamöterna i redaktionskommittén har en omfattande klinisk erfarenhet och är väl insatta i forsknings- och utvecklingsarbete inom sina respektive områden. De har vidare ett brett nätverk inom såväl Läkemedelsverket och SBU som Svenska Läkaresällskapet och Apotekarsocieteten.";
	infoLabel.text += "\n\nRedaktionskommitténs ledamöter och samtliga författare har fått redovisa eventuella jävsförhållanden och bindningar till läkemedelsindustrin och dessa har bedömts och godkänts enligt det regelverk som finns inom Läkemedelsverket. Jävsdeklarationerna finns tillgängliga hos Läkemedelsverket.";
	infoLabel.text += "\n\nLB:s övergripande målsättning är att ge producentoberoende information om läkemedelsbehandling vid vanliga sjukdomstillstånd. Boken innehåller också kapitel som tar upp mer övergripande aktuella aspekter på läkemedelsanvändning samt kapitel om regelverket inom läkemedelsområdet.";
	infoLabel.text += "\n\nLB vänder sig framför allt till specialister i allmänmedicin, läkare under specialistutbildning eller allmäntjänstgöring samt medicine och farmacie studerande, men också till läkare som behöver råd vid medicinska problem utanför den egna specialiteten. LB används som ett uppslagsverk av alla kategorier av sjukvårdspersonal inklusive farmaceuter.";
	
	informationView.add(infoLabel);
	
	detailContainer.add(informationView);
	globals.contentStack = [];
	globals.contentStack.push(informationView);
	globals.topContentView = informationView;
	
	var centerController = new CPNavigationWindow({window: detailContainer});
	//centerController.open(detailContainer);

	centerController.addEventListener("closeWin", function(event) {
		
		Ti.API.log("closeWin, setting new globals.topContentView");
		
		//Find the new window and the corresponding content view
		globals.contentStack.pop();
		globals.topContentView = globals.contentStack[globals.contentStack.length - 1];
	});
	
	centerController.addEventListener("clickedHamburger", function(event) {
		drawer.toggleLeftWindow();
	});

	globals.contentController = centerController;

	var newMenuController = new CPNavigationWindow({window: masterContainer, showHamburger: false});

	globals.menu = newMenuController;
	

	var rightWindow = Ti.UI.createWindow({translucent: false, backgroundColor: "#fff"});
	var rightStartView = Ti.UI.createView({width: globals.rightDrawerWidth + "dp", layout: "vertical"});
	var rightLabel = Ti.UI.createLabel({top: 20, left: 20, right: 20, font: {fontFamily: "Avenir Next", fontSize: "16sp"}, text: "För mer information om Läkemedelsboken, var god se", textAlign: "center"});
	var rightLabelButton = Ti.UI.createButton({title: "www.läkemedelsboken.se"});

	rightLabelButton.addEventListener("click", function(event) {
		Ti.App.fireEvent("openLink", {title: "Läkemedelsboken", href: "http://www.lakemedelsboken.se/"});
	});
	
	rightStartView.add(rightLabel);
	rightStartView.add(rightLabelButton);
	rightWindow.add(rightStartView);
	
	var rightController = new CPNavigationWindow({window: rightWindow, showHamburger: true});
	
	rightController.addEventListener("clickedHamburger", function(event) {
		drawer.toggleRightWindow();
	});

	globals.right = rightController;

	var drawer;
	
	if (globals.osname === "android") {

		drawer = NappDrawerModule.createDrawer({
			fullscreen: false,
			navBarHidden: true,
			leftWindow: newMenuController,
			centerWindow: centerController,
			rightWindow: rightController,
			fading: 0.1,
			parallaxAmount: 0.2,
			shadowWidth:"10dp", 
		    leftDrawerWidth: globals.leftDrawerWidth,
			orientationModes: [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT, Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT],
			animationMode: NappDrawerModule.ANIMATION_NONE,
		    closeDrawerGestureMode: NappDrawerModule.CLOSE_MODE_MARGIN,
		    openDrawerGestureMode: NappDrawerModule.OPEN_MODE_ALL,
//   			backgroundColor: "#fff"
		});
		
		drawer.orientationModes = [Titanium.UI.PORTRAIT];
		
	} else {
				
		drawer = NappDrawerModule.createDrawer({
			navBarHidden: false,
			fullscreen: false,
			leftWindow: newMenuController,
			centerWindow: centerController,
			rightWindow: rightController,
			closeDrawerGestureMode: NappDrawerModule.CLOSE_MODE_ALL,
			openDrawerGestureMode: NappDrawerModule.OPEN_MODE_ALL,
			showShadow: true,
			shadowWidth: 1,
			leftDrawerWidth: globals.leftDrawerWidth,
			rightDrawerWidth: globals.rightDrawerWidth,
			orientationModes: [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT, Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT],
			shouldStretchDrawer: false,
			animationMode: NappDrawerModule.ANIMATION_FADE,
			animationVelocity: 960,
			centerHiddenInteractionMode: NappDrawerModule.OPEN_CENTER_MODE_NAVBAR,
			backgroundColor: "#fff" 
		});

		drawer.setStatusBarStyle(NappDrawerModule.STATUSBAR_BLACK);

	}

	if (globals.osname === "android") {
		setTimeout(function() {
			drawer.toggleLeftWindow();
		}, 1000);
	} else {
		setTimeout(function() {
			drawer.toggleLeftWindow();
		}, 1000);
	}

	globals.isLeftWindowOpen = function() {
		var isLeftOpen = false;
		
		//INFO: Workaround for https://github.com/viezel/NappDrawer/issues/54
		if (globals.osname === "android") {
			isLeftOpen = (drawer.isLeftWindowOpen() && !drawer.isRightWindowOpen() && drawer.isAnyWindowOpen());
		} else {
			isLeftOpen = (drawer.isLeftWindowOpen() && drawer.isRightWindowOpen() && drawer.isAnyWindowOpen());
		}
		
		return isLeftOpen;
	};

	globals.isRightWindowOpen = function() {
		var isRightOpen = false;
		
		//INFO: Workaround for https://github.com/viezel/NappDrawer/issues/54
		if (globals.osname === "android") {
			isRightOpen = (drawer.isLeftWindowOpen() && drawer.isRightWindowOpen() && drawer.isAnyWindowOpen());
		} else {
			isRightOpen = (!drawer.isLeftWindowOpen() && !drawer.isRightWindowOpen() && drawer.isAnyWindowOpen());
		}
		
		return isRightOpen;

	};

	Ti.App.addEventListener('menuItemSelected', function(event) {

		var id = event.id;

		//Check if top window is a webview
		if (globals.topContentView && globals.topContentView.getApiName() === "Ti.UI.WebView") {
			if (id && id.indexOf("_") > -1) {
				var chapterId = id.split("_")[0];
				var chapterPath = Ti.Filesystem.resourcesDirectory + "chapters/" + globals.chapters[chapterId].replace(".json", ".html");
		
				//Set current id
				globals.topContentView.currentId = id;
		
				var scroll = true;
		
				//Open the chapter and scroll to correct position
//				Ti.API.log("current: " + globals.topContentView.getUrl());
//				Ti.API.log("new: " + chapterPath);
				
				if (globals.topContentView.getUrl().indexOf(chapterPath) !== 0) {

					var masterIndex = tocModel.getIndex();
					var title = "";
					if (masterIndex[chapterId.toUpperCase()] !== undefined) {
						title = masterIndex[chapterId.toUpperCase()].name;
					}
		
					//Create a new view
					var window = Ti.UI.createWindow({translucent: false, title: title, backgroundColor: "#fff"});
					var view = new ChapterView();

					view.openChapter(id);
					globals.contentStack.push(view);
					window.add(view);
					globals.contentController.openFromHome(window);

					//Make sure events have propagated
					setTimeout(function() {
						globals.topContentView = view;
					}, 2);

				} else {
					globals.topContentView.currentId = id;
					globals.topContentView.scrollToCurrentId();
				}
				
			}
		} else {
			//Create a new view and load
			if (id && id.indexOf("_") > -1) {
				var chapterId = id.split("_")[0];
				//var chapterPath = Ti.Filesystem.resourcesDirectory + "chapters/" + globals.chapters[chapterId].replace(".json", ".html");

				var masterIndex = tocModel.getIndex();
				var title = "";
				if (masterIndex[chapterId.toUpperCase()] !== undefined) {
					title = masterIndex[chapterId.toUpperCase()].name;
				}
	
				var window = Ti.UI.createWindow({translucent: false, title: title, backgroundColor: "#fff"});

				var view = new ChapterView();
				
				view.openChapter(id);
				globals.contentStack.push(view);
				window.add(view);
				globals.contentController.openFromHome(window);

				//Make sure events have propagated
				setTimeout(function() {
					globals.topContentView = view;
				}, 2);

			} else {
				Ti.API.error("Id was not correct: " + id);
			}
			
		}

		//Close drawer
		if (globals.isLeftWindowOpen()) {
			drawer.toggleLeftWindow();
		}

		if (globals.isRightWindowOpen()) {
			drawer.toggleRightWindow();
		}

	});
	
	Ti.App.addEventListener('atcSelected', function(event) {
		var id = event.id;
		var titles = undefined;
		var title = "";
		
		if (event.titles) {
			titles = event.titles;
		}
		
		if (event.title) {
			title = event.title;
		}
		
		var atcContainerWindow = Ti.UI.createWindow({translucent: false, title: title, backgroundColor: "#fff"});
		
		if (globals.osname === "android") {
			atcContainerWindow.setBackgroundColor("#000");
		}

		var atcView = new ATCListView();
		
		atcContainerWindow.add(atcView);
		
		var isLeftOpen = globals.isLeftWindowOpen();
		var isRightOpen = globals.isRightWindowOpen();
		
		if (event.target && event.target === "center") {
			
			globals.contentController.openFromHome(atcContainerWindow);

			globals.topContentView = atcView;
			globals.contentStack.push(atcView);

			if (isLeftOpen) {
				//Ti.API.log("toggleLeftWindow 1");
				drawer.toggleLeftWindow();
			}

			setTimeout(function() {
				if (isRightOpen) {
					//Ti.API.log("toggleRightWindow 1");
					drawer.toggleRightWindow();
				}
			}, 100);
			
		} else {
			globals.right.openWin(atcContainerWindow);
	
			if (isLeftOpen) {
				//Ti.API.log("toggleLeftWindow 2");
				drawer.toggleLeftWindow();
			}
			
			//setTimeout(function() {
				if (!isRightOpen) {
					//Ti.API.log(drawer.isRightWindowOpen());
					//Ti.API.log("toggleRightWindow 2");
					drawer.toggleRightWindow();
				}
			//}, 100);
			
		}
				
		atcView.loadAndRenderATCList(id, titles);
		
	});

	drawer.addEventListener("windowDidClose", function() {
		Ti.App.fireEvent("blurSearch");
	});

	Ti.App.addEventListener('searchBoxes', function(event) {
		var terms = event.terms;
		var boxContainerWindow = Ti.UI.createWindow({translucent: false, backgroundColor: "#fff"});
		
		if (globals.osname === "android") {
			boxContainerWindow.setBackgroundColor("#000");
		}

		var boxView = new BoxSearchView();
		
		boxContainerWindow.add(boxView);
		
		var isLeftOpen = globals.isLeftWindowOpen();
		var isRightOpen = globals.isRightWindowOpen();
		
		if (event.target && event.target === "center") {
			
			globals.contentController.openFromHome(boxContainerWindow);

			globals.topContentView = boxView;
			globals.contentStack.push(boxView);

			if (isLeftOpen) {
				//Ti.API.log("toggleLeftWindow 1");
				drawer.toggleLeftWindow();
			}

			setTimeout(function() {
				if (isRightOpen) {
					//Ti.API.log("toggleRightWindow 1");
					drawer.toggleRightWindow();
				}
			}, 100);
			
		} else {
			globals.right.openFromHome(boxContainerWindow);
	
			if (isLeftOpen) {
				//Ti.API.log("toggleLeftWindow 2");
				drawer.toggleLeftWindow();
			}
			
			//setTimeout(function() {
				if (!isRightOpen) {
					//Ti.API.log(drawer.isRightWindowOpen());
					//Ti.API.log("toggleRightWindow 2");
					drawer.toggleRightWindow();
				}
			//}, 100);
			
		}
				
		boxView.loadAndRenderBoxSearch(terms);
		
	});


	Ti.App.addEventListener('productSelected', function(event) {
		//Ti.App.fireEvent('itemSelected',e);
		var productContainerWindow = Ti.UI.createWindow({translucent: false, backgroundColor: "#fff"});

		if (globals.osname === "android") {
			productContainerWindow.setBackgroundColor("#222");
		}

		var id = event.id;

		Ti.API.log("Open product with id:" + id);
		var productView = new ProductView();
		
		productContainerWindow.add(productView);

		//Set the new top content view 
		globals.topContentView = productView;
		globals.contentStack.push(productView);

		if (event.target && event.target === "center") {
			centerController.openFromHome(productContainerWindow);
		} else {
			centerController.openWin(productContainerWindow);
		}

		if (globals.isLeftWindowOpen()) {
			drawer.toggleLeftWindow();
		}
		
		if (globals.isRightWindowOpen()) {
			drawer.toggleRightWindow();
		}

		productView.loadAndRenderProduct(id);
	});

	Ti.App.addEventListener('figureSelected', function(event) {
		var src = event.url;
		var name = event.name;
		var text = event.text;

		var window = Ti.UI.createWindow({translucent:false, title: name, backgroundColor: "#fff"});
		
		if (globals.osname === "android") {

			var content = '<img src="chapters/' + src + '" style="max-width: 700px;"><p class="figureText">' + text + '</p>';

			var imageView = new LocalWebView(content, globals.rightDrawerWidth);
			window.add(imageView);
			
		} else {

			var image = new ImagesView("#fff");
			
			var imageFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "chapters/" + src);
			
			image.addImage(imageFile.nativePath, text);
			window.add(image);
			
		}
		
		globals.right.openFromHome(window);

		if (globals.isLeftWindowOpen()) {
			drawer.toggleLeftWindow();
		}
		
		if (!globals.isRightWindowOpen()) {
			drawer.toggleRightWindow();
		}

	});

	Ti.App.addEventListener('referenceSelected', function(event) {

		var content = event.html;
		var title = event.title;
		
		var window = Ti.UI.createWindow({translucent:false, title: title, backgroundColor: "#fff"});

		var view = new LocalWebView(content, globals.rightDrawerWidth);
		
		window.add(view);
		
		globals.right.openFromHome(window);
		
		if (globals.isLeftWindowOpen()) {
			drawer.toggleLeftWindow();
		}
		
		if (!globals.isRightWindowOpen()) {
			drawer.toggleRightWindow();
		}
	});

	Ti.App.addEventListener('pageLinkSelected', function(event) {

		var chapterId = event.chapterId;
		var id = event.id;
		
		var masterIndex = tocModel.getIndex();
		var title = "";
		if (masterIndex[chapterId.toUpperCase()] !== undefined) {
			title = masterIndex[chapterId.toUpperCase()].name;
		}

		//Create a new view
		var window = Ti.UI.createWindow({translucent: false, backgroundColor: "#fff", title: title});
		var view = new ChapterView();

		view.openChapter(id, chapterId);
		globals.contentStack.push(view);
		window.add(view);
		globals.contentController.openWin(window);

		//Make sure only center window is visible
		if (globals.isLeftWindowOpen()) {
			drawer.toggleLeftWindow();
		}
		
		if (globals.isRightWindowOpen()) {
			drawer.toggleRightWindow();
		}

		//Make sure events have propagated
		setTimeout(function() {
			globals.topContentView = view;
		}, 2);
	});

	Ti.App.addEventListener('openLink', function(event) {

		var href = event.href;
		var title = event.title;
		
		if (!title) {
			title = "";
		}
		
		//TODO: Add web view controls and title from page
		var window = Ti.UI.createWindow({translucent: false, backgroundColor: "#fff", title: title});
		
		var openUrlButton;
		
		if (globals.osname === "android") {
			openUrlButton = Ti.UI.createButton({
				//title : 'Öppna',
				height : "40dp",
				width : "60dp",
				top : "5dp",
				right : "5dp",
				font : {fontFamily: globals.fontawesome.fontfamily(), fontSize: "16sp"},
				title: globals.fontawesome.icon('fa-ellipsis-v'),
				color: "#fff",
				backgroundColor: "transparent"
			});

			openUrlButton.addEventListener("click", function(event) {
				Ti.Platform.openURL(href);
			});
			
			window.rightButton = openUrlButton;

		} else {

			openUrlButton = Ti.UI.createButton({systemButton: Ti.UI.iPhone.SystemButton.ACTION});
			openUrlButton.addEventListener("click", function(event) {
				Ti.Platform.openURL(href);
			});

			window.setRightNavButton(openUrlButton);

		}


		var view = Ti.UI.createWebView({url: href});

		window.add(view);
		globals.contentController.openWin(window);

		//Make sure only center window is visible
		if (globals.isLeftWindowOpen()) {
			drawer.toggleLeftWindow();
		}
		
		if (globals.isRightWindowOpen()) {
			drawer.toggleRightWindow();
		}

		//Make sure events have propagated
		setTimeout(function() {
			globals.topContentView = view;
		}, 2);
	});

	if (globals.osname === "android") {
		//Handle events from android hardware back button
		drawer.addEventListener("android:back", function(event) {
			event.cancelBubble = true;
			if (globals.isLeftWindowOpen()) {
				//Ti.API.log("Left window");
				if (globals.menu.windowStack.length > 1) {
					globals.menu.closeWin();
				} else {
					//globals.menu.fireEvent("clickedHamburger");
				}
				
			} else if (globals.isRightWindowOpen()) {
				//Ti.API.log("Right window");
				if (globals.right.windowStack.length > 1) {
					globals.right.closeWin();
				} else {
					globals.right.fireEvent("clickedHamburger");
				}
			} else {
				//Ti.API.log("Center window");
				if (globals.contentController.windowStack.length > 1) {
					globals.contentController.closeWin();
				} else {
					globals.contentController.fireEvent("clickedHamburger");
				}
				
			}
		});
	}

	return drawer;
};

module.exports = ApplicationWindow;
