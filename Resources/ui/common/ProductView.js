function ProductView(nplId) {

	var self = Ti.UI.createView({
		height: Ti.UI.FILL,
		width: Ti.UI.FILL
	});

	var LocalWebView = require('ui/common/LocalWebView');
	var ImagesView = require("ui/common/ImagesView");

	var style;
	if (Ti.Platform.name === 'iPhone OS'){
		style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
	}
	else {
		style = Ti.UI.ActivityIndicatorStyle.BIG;
	}

	var loadingIndicator = Ti.UI.createActivityIndicator({style: style, top: (((Ti.Platform.displayCaps.platformHeight - 65) / 2) - 10), left: (Ti.Platform.displayCaps.platformWidth / 2) - 10});

	if (globals.osname !== "android") {
		self.backgroundColor = "#fff";
	} else {
		loadingIndicator.width = "160px";
		loadingIndicator.top = (((Ti.Platform.displayCaps.platformHeight - (70 * Ti.Platform.displayCaps.logicalDensityFactor)) / 2) - 80) + "px";
		loadingIndicator.left = ((Ti.Platform.displayCaps.platformWidth / 2) - 80) + "px";
	}
	
	self.add(loadingIndicator);
	loadingIndicator.hide();

	self.loadAndRenderProduct = function(nplId) {
		
		loadingIndicator.show();
		
		var url = settings.serverAddress + "/products/" + nplId + ".json";
		
		globals.fetchJSON(url, function(err, data) {

			//Hide loading indicator
			loadingIndicator.hide();
			self.remove(loadingIndicator);
			
			if (err) {
				renderError(err);
			} else {
				renderProduct(data);
			}
		});
	};
	
	
	function renderProduct(product) {
		Ti.API.log("Render product:");

		var parent = self.getParent();
		
		//Set title of window
		if (parent) {
			parent.setTitle(product.name);
		}
		var subMedicine = product;
		
		var subMedicineTable = Ti.UI.createTableView({minRowHeight: 44});
		var infoSection = Ti.UI.createTableViewSection();
			
/*
		var fassRow = Ti.UI.createTableViewRow({height: "40", width: "auto", hasDetail: true, leftImage: "fass.png"});
		fassRow.add(Ti.UI.createLabel({text: " ", height: Ti.UI.SIZE, width: "auto", font: {fontWeight: "bold", fontSize: 18}, top: 10, bottom: 10, left: 10,  textAlign: "left"}));
		fassRow.addEventListener("click", function(event) {
			displayUrlDialog("Öppna preparat i Safari", "http://www.fass.se/m/#produkt/" + subMedicine.id + "/uidhealthcare", subMedicine.name);
	
			//Ti.Platform.openURL("http://www.fass.se/LIF/produktfakta/artikel_produkt.jsp?DocTypeID=3&NplID=" + subMedicine.id);
		});

			font: {
				fontSize: 18, 
				fontFamily: "Avenir Next",
				fontWeight: "normal"
			}

* */

		Flurry.logEvent("Product", {id: subMedicine.id, name: subMedicine.name});

		var titleRow = Ti.UI.createTableViewRow({layout: "vertical", height: Ti.UI.SIZE});
		titleRow.add(Ti.UI.createLabel({text: "Namn:", height: Ti.UI.SIZE, font: {fontWeight: "normal", fontSize: 12, fontFamily: "Avenir Next"}, top: 2, left: "15dp",  textAlign: "left"}));
		titleRow.add(Ti.UI.createLabel({text: subMedicine.name, height: Ti.UI.SIZE, width: "auto", font: {fontSize: 18, fontFamily: "Avenir Next"}, top: 3, bottom: 10, left: "15dp",  textAlign: "left"}));

		infoSection.add(titleRow);

		//Add images
		if (subMedicine.images && subMedicine.images.length > 0) {

			var imageView = Ti.UI.createView({layout: "horizontal", height: Ti.UI.SIZE});
			var allImages = [];
			var allDescriptions = [];
			var indentation = 15;
			
			for (var i=0; i < subMedicine.images.length; i++) {
				var imageUrl = settings.serverAddress + "/products/images/" + subMedicine.images[i].checksum + ".jpg";
				
				allImages.push(imageUrl);
				allDescriptions.push(subMedicine.images[i].description);
				
				var image = Ti.UI.createImageView({image: imageUrl, width: "60dp", height: Ti.UI.SIZE, top: 0, left: (indentation + "dp")});
				
				indentation = 5;
				
				//Ti.API.log("Adding image with url: " + imageUrl);
				imageView.add(image);
			}
			
			var imageRow = Ti.UI.createTableViewRow({hasChild: true});
			
			imageRow.addEventListener("click", function() {
				var imagesWindow = Ti.UI.createWindow({translucent: false, title: subMedicine.name, leftNavButton: Ti.UI.createView({})});

				var imagesView = new ImagesView();

				for (var i=0; i < allImages.length; i++) {
					imagesView.addImage(allImages[i], allDescriptions[i]);
				}

				imagesWindow.add(imagesView);
				globals.right.openFromHome(imagesWindow);
				globals.context.toggleRightWindow();
				
			});
			
			imageRow.add(imageView);
			
			infoSection.add(imageRow);

		}
		
		var descriptionRow = Ti.UI.createTableViewRow({layout: "vertical", height: Ti.UI.SIZE, width: "auto"});
		descriptionRow.add(Ti.UI.createLabel({text: "Beredning:", height: Ti.UI.SIZE, width: "auto", font: {fontWeight: "normal", fontSize: 12, fontFamily: "Avenir Next"}, top: 2, left: "15dp",  textAlign: "left"}));
		descriptionRow.add(Ti.UI.createLabel({text: subMedicine.description.replace("<br />", " "), height: Ti.UI.SIZE, width: 290, font: {fontSize: 15, fontFamily: "Avenir Next"}, top: 3, bottom: 10, left: "15dp", textAlign: "left"}));

		infoSection.add(descriptionRow);

		if (subMedicine.available !== "true") {
			var availRow = Ti.UI.createTableViewRow({layout: "vertical", height: Ti.UI.SIZE, width: "auto", backgroundColor: "#fff"});
			availRow.add(Ti.UI.createLabel({text: "Information:", height: Ti.UI.SIZE, width: "auto", font: {fontWeight: "normal", fontSize: 12, fontFamily: "Avenir Next"}, color: "red", top: 2, left: "15dp",  textAlign: "left"}));
			availRow.add(Ti.UI.createLabel({text: "Tillhandahålls ej", height: Ti.UI.SIZE, width: 290, font: {fontSize: 15, fontFamily: "Avenir Next"}, color: "red", top: 3, bottom: 10, left: "15dp", textAlign: "left"}));
			infoSection.add(availRow);

		}
				
		if (subMedicine.substance && subMedicine.substance !== "") {
			var substanceRow = Ti.UI.createTableViewRow({layout: "vertical", height: Ti.UI.SIZE, width: "auto"});
			substanceRow.add(Ti.UI.createLabel({text: "Substans:", height: Ti.UI.SIZE, width: "auto", font: {fontWeight: "normal", fontSize: 12, fontFamily: "Avenir Next"}, top: 2, left: "15dp",  textAlign: "left"}));
			substanceRow.add(Ti.UI.createLabel({text: subMedicine.substance, height: Ti.UI.SIZE, width: 290, font: {fontSize: 15, fontFamily: "Avenir Next"}, top: 3, bottom: 10, left: "15dp", textAlign: "left"}));
			infoSection.add(substanceRow);
		}

		//Search info boxes
		var searchRow = Ti.UI.createTableViewRow({layout: "vertical", height: Ti.UI.SIZE, width: "auto", hasChild: true});
		searchRow.add(Ti.UI.createLabel({text: "Sök bland informationsrutor...", height: Ti.UI.SIZE, width: 290, font: {fontSize: 18, fontFamily: "Avenir Next"}, top: 10, bottom: 10, left: "15dp", textAlign: "left"}));
	
		searchRow.addEventListener("click", function(event) {
			Ti.App.fireEvent("searchBoxes", {terms: subMedicine.name});
		});

		infoSection.add(searchRow);		

		//Narcotic
		var narcotic = null;

		switch(subMedicine.narcoticClass) {
			case "1":
				narcotic = "Klass II: Substanser med högre beroendepotential och liten terapeutisk användning.";
				break;
			case "2":
				narcotic = "Klass IV/V.";
				break;
			case "3":
				narcotic = "Klass III: Beredning innehållande dessa är narkotika under vissa förutsättningar";
				break;
			case "4":
				narcotic = "Klass IV: Substanser med lägre beroendepotential och bred terapeutisk användning";
				break;
			case "5":
				narcotic = "Klass V: Narkotika enbart enligt svensk lag";
				break;
			default:
				break;
		}

		//Narkotikaklass 	
		//	- = Ospecificerad, 
		//	0 = Ej narkotikaklassad, 
		//	1 = II - Narkotika. Substanser med högre beroendepotential och liten terapeutisk användning, 
		//	2 = Narkotika förteckning IV/V, 
		//	3 = III - Narkotika. Beredning innehållande dessa är narkotika under vissa förutsättningar, 
		//	4 = IV - Narkotika. Substanser med lägre beroendepotential och bred terapeutisk användning, 
		//	5 = V - Narkotika enbart enligt svensk lag, 
		//	6 = I - Narkotika ej förekommande i läkemedel, 
		//	NA = Ej tillämplig


		if (narcotic !== null) {
			
			var narcRow = Ti.UI.createTableViewRow({layout: "composite"});

			var narcImage = Ti.UI.createImageView({image: "/images/narcotic.png", width: "21dp", height: "21dp", top: "12dp", bottom: "5dp", left: "15dp"});

			if (globals.osname === "android") {
				narcImage.image = "/images/narcotic_white@2x.png";
			}

			narcRow.add(narcImage);

			narcoticDescription = subMedicine.narcoticClassTextCaution + " " + subMedicine.narcoticClassTextHabituation;
			var narcLabel = Ti.UI.createLabel({text: narcoticDescription, height: Ti.UI.SIZE, font: {fontSize: 12, fontFamily: "Avenir Next"}, top: "5dp", bottom: "5dp", left: "45dp", textAlign: "left"});

			narcRow.add(narcLabel);

			infoSection.add(narcRow);
		}

		if (subMedicine.mechanism && subMedicine.mechanism !== "") {
			var mechanismRow = Ti.UI.createTableViewRow({layout: "vertical", height: Ti.UI.SIZE, width: "auto"});
			mechanismRow.add(Ti.UI.createLabel({text: "Verkningsmekanism:", height: Ti.UI.SIZE, width: "auto", font: {fontWeight: "normal", fontSize: 12, fontFamily: "Avenir Next"}, top: 2, left: "15dp",  textAlign: "left"}));
			mechanismRow.add(Ti.UI.createLabel({text: subMedicine.mechanism, height: Ti.UI.SIZE, width: 290, font: {fontSize: 15, fontFamily: "Avenir Next"}, top: 3, bottom: 10, left: "15dp", textAlign: "left"}));
			infoSection.add(mechanismRow);
		}

		var brandRow = Ti.UI.createTableViewRow({layout: "vertical", height: Ti.UI.SIZE, width: "auto"});
		brandRow.add(Ti.UI.createLabel({text: "Tillverkare:", height: Ti.UI.SIZE, width: "auto", font: {fontWeight: "normal", fontSize: 12, fontFamily: "Avenir Next"}, top: 2, left: "15dp",  textAlign: "left"}));
		var brandLabel = Ti.UI.createLabel({text: subMedicine.brand, height: Ti.UI.SIZE, width: 290, font: {fontSize: 15, fontFamily: "Avenir Next"}, top: 3, bottom: 10, left: "15dp", textAlign: "left"});

		if (subMedicine.parallelimport !== undefined && subMedicine.parallelimport !== "") {
			 brandLabel.text += " (Parallellimport " + subMedicine.parallelimport + ")";
		}

		brandRow.add(brandLabel);
		infoSection.add(brandRow);

		var atcRow = Ti.UI.createTableViewRow({layout: "vertical", height: Ti.UI.SIZE, width: "auto", hasDetail: false, hasChild: true});
		atcRow.add(Ti.UI.createLabel({text: "ATC-kod:", height: Ti.UI.SIZE, width: "auto", font: {fontWeight: "normal", fontSize: 12, fontFamily: "Avenir Next"}, top: 2, left: "15dp",  textAlign: "left"}));
		atcRow.add(Ti.UI.createLabel({text: subMedicine.atcCode + " - visa liknande preparat", height: Ti.UI.SIZE, width: 290, font: {fontSize: 15, fontFamily: "Avenir Next"}, top: 3, bottom: 10, left: "15dp", textAlign: "left"}));
		
		atcRow.addEventListener("click", function(event) {
			Ti.App.fireEvent("atcSelected", {id: subMedicine.atcCode});
		});
		
		infoSection.add(atcRow);
		
		if (subMedicine.spcLink && subMedicine.spcLink !== "") {
			var spcType = (subMedicine.spcLink.indexOf(".pdf") > -1) ? "pdf" : "word";
			var linkText = "Extern produktresumé";
			if (spcType === "word") {
				linkText += " som Word-fil";
			} else if (spcType === "pdf") {
				linkText += " som PDF";
			}

			var spcRow = Ti.UI.createTableViewRow({layout: "vertical", height: Ti.UI.SIZE, width: "auto", hasChild: true});
			spcRow.add(Ti.UI.createLabel({text: "Produktresumé:", height: Ti.UI.SIZE, width: "auto", font: {fontWeight: "normal", fontSize: 12, fontFamily: "Avenir Next"}, top: 2, left: "15dp",  textAlign: "left"}));
			spcRow.add(Ti.UI.createLabel({text: linkText, height: Ti.UI.SIZE, width: 290, font: {fontSize: 15, fontFamily: "Avenir Next"}, top: 3, bottom: 10, left: "15dp", textAlign: "left"}));

			spcRow.addEventListener("click", function(event) {
				Ti.App.fireEvent("openLink", {href: subMedicine.spcLink, title: "Produktresumé"});
			});

			infoSection.add(spcRow);

		}

		//Benefit
		var benefit = null;
		switch(parseInt(subMedicine.benefit)) {
			case 0:
				benefit = "Ingen förpackning har förmån";
				break;
			case 1:
				benefit = "Alla förpackningar har förmån";
				break;
			case 2:
				benefit = "Vissa förpackningar har förmån";
				break;
			case 3:
				benefit = "Förmån med begränsning";
				break;
			case 4:
				benefit = null;
				break;
			default:
				break;
		}

		if (benefit !== null) {
			var benefitRow = Ti.UI.createTableViewRow({layout: "vertical", height: Ti.UI.SIZE, width: "auto"});
			benefitRow.add(Ti.UI.createLabel({text: "Förmån:", height: Ti.UI.SIZE, width: "auto", font: {fontWeight: "normal", fontSize: 12, fontFamily: "Avenir Next"}, top: 2, left: "15dp",  textAlign: "left"}));
			benefitRow.add(Ti.UI.createLabel({text: benefit, height: Ti.UI.SIZE, width: 290, font: {fontSize: 15, fontFamily: "Avenir Next"}, top: 3, bottom: 10, left: "15dp", textAlign: "left"}));

			infoSection.add(benefitRow);
		}

		//Presciption
		var prescription = null;
		switch(subMedicine.prescription) {
			case "-":
				prescription = "Ospecificerat";
				break;
			case "0":
				prescription = "Receptfritt";
				break;
			case "1":
				prescription = "Receptbelagt";
				break;
			case "2":
				prescription = "Inskränkt förskrivning";
				break;
			case "3":
				prescription = "Vissa förpackningar är receptbelagda";
				break;
			case "4":
				prescription = "Receptfritt från 2 års ålder";
				break;
			case "5":
				prescription = "Receptfritt från 12 års ålder";
				break;
			case "N":
				prescription = "Ej tillämplig";
				break;
			default:
				break;
		}

		if (prescription !== null) {
	
			if (subMedicine.specRecipe === "true") {
				prescription += " - " + subMedicine.specRecipeText.trim();
			}
			
			var prescriptionRow = Ti.UI.createTableViewRow({layout: "vertical", height: Ti.UI.SIZE, width: "auto"});
			prescriptionRow.add(Ti.UI.createLabel({text: "Recept:", height: Ti.UI.SIZE, width: "auto", font: {fontWeight: "normal", fontSize: 12, fontFamily: "Avenir Next"}, top: 2, left: "15dp",  textAlign: "left"}));
			prescriptionRow.add(Ti.UI.createLabel({text: prescription, height: Ti.UI.SIZE, width: 290, font: {fontSize: 12, fontFamily: "Avenir Next"}, top: 3, bottom: 10, left: "15dp", textAlign: "left"}));

			infoSection.add(prescriptionRow);
		}
			
/*
		//Over the counter
		if (product.overTheCounter === "AD") {
			medInfo.append($("<div><strong>Försäljning:</strong> Läkemedlet kan utöver på apotek även köpas i dagligvaruhandeln.</div>"));
		}
*/
	
		//LFF
		var lff = null;
		/*
		Vi uppmanar er att titta på värdena i nedanstående taggar som kommer med i svaret från webbtjänsten, dvs.:
		<is-part-of-fass>/<lff-insurance-member>
		1. True/True – Företaget deltar i Fass OCH i Läkemedelsförsäkringen
		2. True/False – Företaget deltar i Fass men INTE i Läkemedelsförsäkringen
		3. False/True – Företaget deltar INTE i Fass men i Läkemedelsförsäkringen – Informationen lämnas INTE med automatik. Det måste alltså läggas till en uppmaning om att söka information om läkemedlet omfattas av Läkemedelsförsäkringen eller ej, förslagsvis via t.ex. en länk: www.lakemedelsforsakringen.se
		4. False/False – Företaget deltar varken i Fass eller i Läkemedelsförsäkringen – Även här måste det ligga en uppmaning om att söka information om läkemedlet omfattas av Läkemedelsförsäkringen eller ej, förslagsvis via t.ex. en länk: www.lakemedelsforsakringen.se

		I fall 3 och 4 ignoreras alltså värdet för läkemedelsförsäkringen eftersom värdet för Fass medlemsskap är ”False”.
		Vi fortsätter att titta på detta men tills vidare måste alltså ni som användare av Fass webtjänst se till att korrekt information presenteras med hänvisning till ovanstående kombination av svar!
		*/

		var lffHref = "http://www.fass.se/LIF/produktfakta/fakta_lakare_artikel.jsp?articleID=18336";
		if (subMedicine.partOfFass === "true") {
			if (subMedicine.lffInsurance === "true") {
				lff = "Läkemedlet omfattas av Läkemedelsförsäkringen";
			} else if (product.lffInsurance === "false") {
				lff = "Omfattas ej av Läkemedelsförsäkringen";
			}
		}

		if (product.partOfFass === "false") {
			lffHref = "http://www.lakemedelsforsakringen.se/";
			lff = "Oklart om läkemedlet omfattas av Läkemedelsförsäkringen. Sök mer information på www.lakemedelsforsakringen.se";
		}

		if (lff !== null) {

			var lffRow = Ti.UI.createTableViewRow({layout: "vertical", height: Ti.UI.SIZE, width: "auto", hasChild: true});
			lffRow.add(Ti.UI.createLabel({text: "Försäkring:", height: Ti.UI.SIZE, width: "auto", font: {fontWeight: "normal", fontSize: 12, fontFamily: "Avenir Next"}, top: 2, left: "15dp",  textAlign: "left"}));
			lffRow.add(Ti.UI.createLabel({text: lff, height: Ti.UI.SIZE, width: 290, font: {fontSize: 12, fontFamily: "Avenir Next"}, top: 3, bottom: 10, left: "15dp", textAlign: "left"}));

			lffRow.addEventListener("click", function(event) {
				Ti.App.fireEvent("openLink", {href: lffHref, title: "Läkemedelsförsäkring"});
			});

			infoSection.add(lffRow);

		}
	
		var dataSection;
		if (subMedicine.noinfo) {
			dataSection = Ti.UI.createTableViewSection({headerTitle: "Det finns tyvärr ingen förskrivarinformation"});
		} else {
			dataSection = getSubMedicineData(subMedicine.sections, subMedicine.provider);
			dataSection.addEventListener("click", showSubMedicineData);
		}

		if (globals.osname !== "android") {
			subMedicineTable.style = Ti.UI.iPhone.TableViewStyle.GROUPED;
		}
		
		subMedicineTable.data = [infoSection, dataSection];
	
		self.add(subMedicineTable);

	}

	function renderError(err) {

		var aLabel = Ti.UI.createLabel({
			text : "Lyckades inte hämta förskrivarinformation, kontrollera din nätverksuppkoppling.",
			color : '#000',
			font : {fontSize:16},
			height : "auto",
			width : self.getWidth() - 40,
			top : 20,
			left : "15dp",
			textAlign : 'center'
		});
		
		// Add to the parent view.
		self.add(aLabel);
	}

	function showSubMedicineData(event) {

		var window = Ti.UI.createWindow({title: event.row.hiddenTitle, translucent: false, leftNavButton: Ti.UI.createView({}), backgroundColor: "#fff", width: globals.rightDrawerWidth});
		var view = new LocalWebView(event.row.htmlData, globals.rightDrawerWidth);

		window.add(view);
		
		globals.right.openFromHome(window);		
		if (!globals.context.isRightWindowOpen()) {
			globals.context.toggleRightWindow();
		}

/*
		var subMedicineDataView = Ti.UI.createWebView();
		subMedicineDataView.autoDetect = [];
		subMedicineDataView.html = "<html><head><meta name=\"viewport\" content=\"width=270,maximum-scale=3.0,initial-scale=1.0,user-scalable=yes\" /><style>body {font-family: Avenir; font-size: 17px; line-height: 1.5; padding: 10px} .highlight {background-color: gold; color: black;} .currenthighlight {background-color: yellow; color: #000; } div#fassImage {background: url(images/fass.png) right top no-repeat; height: 20px;} @media all and (-webkit-min-device-pixel-ratio: 2) { div#fassImage {background-image: url(images/fass@2x.png); background-size: 79px 19px;}}</style></head><body><div id='fassImage'></div>" + event.row.htmlData + "</body><script type='text/javascript' src='lb/jquery.min.js'></script><script src='lb/highlight.js'></script></html>";
		var dataWindow = Ti.UI.createWindow({title: event.row.hiddenTitle, translucent: false, leftNavButton: Ti.UI.createView({})});
		dataWindow.add(subMedicineDataView);

		globals.right.openWin(dataWindow);		
		if (!globals.context.isRightWindowOpen()) {
			globals.context.toggleRightWindow();
		}
*/
	}
	
	function getSubMedicineData(data, provider) {

		var sectionTitle = "Information från FASS";
		
		if (provider && provider !== "fass") {
			sectionTitle = "Information från " + provider;
		}
	
		var dataSection = Ti.UI.createTableViewSection({headerTitle: sectionTitle});
	
		var allContent = [];
		var sections = [];
	
		for (name in data) {
			if (data[name] !== null && data[name] !== "") {
				var dataRow = Ti.UI.createTableViewRow({hasChild: true, hiddenTitle: name, height: Ti.UI.SIZE});
				dataRow.htmlData = data[name];
				allContent.push("<h3>" + name + "</h3>" + data[name]);
				var minimumFont = 12;
				var title = Ti.UI.createLabel({text: name, font: {fontSize: 18, fontFamily: "Avenir Next"}, minimumFontSize: minimumFont, left: "15dp", height: Ti.UI.SIZE});
				dataRow.add(title);
				sections.push(dataRow);
			}
		}
		
		var allRow = Ti.UI.createTableViewRow({hasChild: true, htmlData: allContent.join("\n"), hiddenTitle: "Alla rubriker"});
		var allTitle = Ti.UI.createLabel({text: "Alla rubriker", font: {fontSize: 18, fontFamily: "Avenir Next"}, minimumFontSize: minimumFont, left: "15dp"});
		allRow.add(allTitle);
		dataSection.add(allRow);
		for (var i=0; i < sections.length; i++) {
			dataSection.add(sections[i]);
		}
		
		return dataSection;
	}


	if (nplId && nplId.length > 5) {
		//Load nplId
		self.loadAndRenderProduct(nplId);
	}
	
	return self;
}

module.exports = ProductView;