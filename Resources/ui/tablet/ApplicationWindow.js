
var tocModel = require("models/TocModel");


function ApplicationWindow() {

	var MenuView = require('ui/common/MenuView'),
		ATCListView = require('ui/common/ATCListView'),
		BoxSearchView = require('ui/common/BoxSearchView'),
		ProductView = require('ui/common/ProductView'),
		ImagesView = require('ui/common/ImagesView'),
		LocalWebView = require('ui/common/LocalWebView'),
		RemoteWebView = require('ui/common/RemoteWebView'),
		NappDrawerModule = require('dk.napp.drawer'),
		CPNavigationWindow = require("controllers/CPNavigationWindow");

	var menuView = new MenuView();

	globals.leftDrawerWidth = 270;
	globals.rightDrawerWidth = 270;

	if (Ti.Platform.osname === "ipad") {
		globals.leftDrawerWidth = 320;
		globals.rightDrawerWidth = 400;
	}

/*
	if (Ti.Platform.osname === "iphone") {
		Ti.API.info('Ti.Platform.displayCaps.density: ' + Ti.Platform.displayCaps.density);
		Ti.API.info('Ti.Platform.displayCaps.dpi: ' + Ti.Platform.displayCaps.dpi);
		Ti.API.info('Ti.Platform.displayCaps.platformHeight: ' + Ti.Platform.displayCaps.platformHeight);
		Ti.API.info('Ti.Platform.displayCaps.platformWidth: ' + Ti.Platform.displayCaps.platformWidth);		
	}
*/

	if (Ti.Platform.osname === "iphone") {
		if (Ti.Platform.displayCaps.density === "high" && Ti.Platform.displayCaps.platformWidth === 414) {
			//iPhone 6 Plus
			globals.leftDrawerWidth = 340;
			globals.rightDrawerWidth = 340;
			
		} else if (Ti.Platform.displayCaps.density === "high" && Ti.Platform.displayCaps.platformWidth === 375) {
			//iPhone 6
			globals.leftDrawerWidth = 300;
			globals.rightDrawerWidth = 300;
			
		}
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
	//var informationView = Ti.UI.createScrollView({backgroundColor: "#fff", layout: "vertical", contentHeight: "auto"});

	var infoLabel = Ti.UI.createLabel({
		color : '#000',
		font : {fontSize:12, fontFamily: "Avenir Next"},
		width: "80%",
		textAlign : 'left',
		backgroundPaddingTop: '30px'
		
	});
	
	var headerLabel = Ti.UI.createLabel({
		color : '#000',
		font : {fontSize:24, fontFamily: "Avenir Next"},
		width: "80%",
		textAlign : 'center',
		
	});
	
	headerLabel.text = "\n";
	headerLabel.text += "Läkemedelsboken";
	headerLabel.text += "\n";
	
	var startId = "Forord";
	var ForUrl= "forord/index.html";
	var startUrl = globals.serverAddress +"/api/v1/appify?apikey=" + globals.lbApiKey + "&url=" + encodeURIComponent(ForUrl);
	var informationView = new RemoteWebView(startUrl, startId);
	
	/*infoLabel.html = "<a href=\"http://www.lakemedelsboken.se\">Läkemedelsbokens</a> övergripande målsättning är att ge producentoberoende information om läkemedelsbehandling vid vanliga sjukdomstillstånd. Läkemedelsboken tar också upp aktuella aspekter på läkemedelsanvändning samt information om regelverket inom läkemedelsområdet. Läkemedelsboken vänder sig framför allt till specialister i allmänmedicin, läkare under specialistutbildning eller allmäntjänstgöring samt medicine och farmacie studerande. Den används också mycket av läkare som söker lättillgänglig och väl sammanfattad information om medicinska frågor utanför den egna specialiteten, samt som ett uppslagsverk av alla kategorier av sjukvårdspersonal inklusive farmaceuter. Se även Faktaruta 1.";
	infoLabel.html += "\n\nLäkemedelsboken är indelad i terapikapitel och specialkapitel. Terapikapitlen beskriver olika sjukdomstillstånd, deras förekomst, symtom, diagnostik och behandling. Läkemedel placeras in i ett helhetsperspektiv i vilket även icke-farmakologiska behandlingsalternativ ingår. Läkemedel benämns med substansnamn, men i undantagsfall och vid noga övervägande kan ibland produktnamn komma att användas.  Specialkapitlen redogör bland annat för kliniskt farmakologiska principer, biverkningsmönster, läkemedelsinteraktioner samt läkemedels miljöpåverkan. Dessutom tas mer övergripande aspekter på läkemedelsanvändning upp, till exempel hälsoekonomi och IT-stöd. I regelverkskapitlen beskrivs de lagar och förordningar som styr läkemedelsområdet.";
	infoLabel.html += "\n\nKapitelförfattarna svarar själva för innehållet. En redaktionskommitté, fristående från Läkemedelsverkets myndighetsuppdrag, har granskat innehållet och i dialog med författarna vinnlagt sig om att det inte står i strid med officiella direktiv, riktlinjer eller vetenskap och beprövad erfarenhet. Ledamöterna i redaktionskommittén har en omfattande klinisk erfarenhet och är väl insatta i forsknings- och utvecklingsarbete inom sina respektive områden. De har vidare ett brett nätverk inom myndigheter, landsting och universitet liksom inom intresseorganisationer (Svenska Läkaresällskapet och Apotekarsocieteten).";
	infoLabel.html += "\n\nRedaktionskommitténs ledamöter och samtliga författare har inför sina uppdrag redovisat eventuella jävsförhållanden enligt de jävsgrunder som förvaltningslagen (1986:223) tar upp. Detta görs på den jävsblankett som Läkemedelsverket och flera andra myndigheter använder och bedömningen följer fastlagda rutiner. Se Läkemedelsverkets webbplats för mer information: https://lakemedelsverket.se/jav. Jävsdeklarationerna är offentliga handlingar och finns tillgängliga hos Läkemedelsverket.";
	infoLabel.html += "\n\nLäkemedelsboken har givits ut sedan 1977, först av Apoteket AB och sedan omregleringen av apoteksmarknaden 2009 av Läkemedelsverket. Som komplement till den tryckta boken har Läkemedelsboken sedan ett antal år tillbaka även publicerats på webben. I de senare utgåvorna har den tryckta boken i huvudsak bestått av terapikapitlen, medan specialkapitlen webbpublicerats. I utgåvan från 2014 (LB 2014) var den tryckta boken fortfarande huvudprodukten, men från och med 2016 publiceras Läkemedelsboken enbart på webben.";
	infoLabel.html += "\n\nVi bedriver ett kontinuerligt arbete med att anpassa innehållet i Läkemedelsboken till den kliniska vardagen och sjukvårdens behov av att snabbt få fram information om lämplig behandling/lämpliga läkemedel vid ett aktuellt sjukdomstillstånd. Samtidigt har vi behållit indelning i kapitel så att man kan använda Läkemedelsboken som läromedel eller källa när man vill veta mer inom något terapiområde. Läkemedelsboken ska vara lika användarvänlig oavsett om man läser på dator, surfplatta eller mobiltelefon.";
	infoLabel.html += "\n\nLäkemedelsbokens redaktion arbetar kontinuerligt för att hålla Läkemedelsboken uppdaterad med för läsarna relevant information från Läkemedelsverket och andra myndigheter samt med ny kunskap inom läkemedelsområdet.";
	infoLabel.html += "\n\nSynpunkter på Läkemedelsboken tas tacksamt emot av redaktionen.";*/
	
	//informationView.add(infoLabel);
	//informationView.add(headerLabel);
	
	
	globals.contentStack = [];
	globals.contentStack.push(informationView);
	globals.topContentView = informationView;
	detailContainer.add(informationView);

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
		    rightDrawerWidth: globals.rightDrawerWidth,
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
			isLeftOpen = drawer.isLeftWindowOpen();
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
			isRightOpen = drawer.isRightWindowOpen();
		}
		
		return isRightOpen;

	};

	Ti.App.addEventListener('menuItemSelected', function(event) {

		var id = event.id;
		var url = event.url;

		//Check if top window is a webview
		if (globals.topContentView && globals.topContentView.getApiName() === "Ti.UI.WebView") {
			if (url) {
				Ti.API.log(url);
				Ti.API.log(globals.topContentView.getUrl());
					
				
				if (!globals.topContentView.getUrl() || globals.topContentView.getUrl().indexOf(url) !== 0) {

					//TODO: Fix title
					var title = "";

					//Create a new view
					var window = Ti.UI.createWindow({translucent: false, title: title, backgroundColor: "#fff"});
					var view = new RemoteWebView(url, id);

					//view.openUrl(url, id);
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
			if (url) {
				Ti.API.log("2");
				Ti.API.log(url);
				//Ti.API.log(globals.topContentView.getUrl());

				
				//TODO: Fix title
				var title = "";

				var window = Ti.UI.createWindow({translucent: false, title: title, backgroundColor: "#fff"});

				var view = new RemoteWebView(url, id);
				
				//view.openUrl(url, id);
				globals.contentStack.push(view);
				window.add(view);
				globals.contentController.openFromHome(window);

				//Make sure events have propagated
				setTimeout(function() {
					globals.topContentView = view;
				}, 2);
				
			} else {
				Ti.API.error("Id was not correct: " + id + ", url: " + url);
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

			//var content = '<img src="chapters/' + src + '" style="max-width: 700px;"><p class="figureText">' + text + '</p>';
			var content = '<img src="' + src + '" style="max-width: 700px;"><p class="figureText">' + text + '</p>';

			var imageView = new LocalWebView(content, globals.rightDrawerWidth);
			window.add(imageView);
			
		} else {

			var image = new ImagesView("#fff");
			
			//var imageFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "chapters/" + src);
			var imageFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "chapters/" + src);
			
			image.addImage(src, text);
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
		var url = event.url;
		
		//var masterIndex = tocModel.getIndex();
		var title = "";
		//if (chapterId !== null && masterIndex[chapterId.toUpperCase()] !== undefined) {
		//	title = masterIndex[chapterId.toUpperCase()].name;
		//}

		//Create a new view
		var window = Ti.UI.createWindow({translucent: false, backgroundColor: "#fff", title: title});

		url = globals.serverAddress + "/api/v1/appify?apikey=" + globals.lbApiKey + "&url=" + encodeURIComponent(url);
		var view = new RemoteWebView(url, id);

		//view.openChapter(id, chapterId);
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
					event.cancelBubble = true;
					globals.menu.closeWin();
				} else {
					//event.cancelBubble = false;
					//globals.menu.fireEvent("clickedHamburger");
					drawer.close();
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
