var TableFormatter = {

	addMenuItems: function(table, data) {
		
		if (data.length < 1) {
			return;
		}
		
		var titleItem = data[0];
		
		if (titleItem && titleItem.id) {

			var headerSection = Ti.UI.createTableViewSection();
			headerSection.add(TableFormatter.getFormattedRow(titleItem, true));

			var titlesSection =  Ti.UI.createTableViewSection({headerTitle: "Rubriker"});
			
			for(var i=1,j=data.length; i<j; i++){
				titlesSection.add(TableFormatter.getFormattedRow(data[i]));
			}
	
			table.data = [headerSection, titlesSection];
		} else {
			if (titleItem && titleItem.type === "header") {

				var titleView = Ti.UI.createView({
					backgroundColor: "#eee",
					layout: "vertical"
				});				

				var titleLabel = Ti.UI.createLabel({
					text : titleItem.title,
					color : '#000',
					font : {fontSize: "14sp", fontFamily: "Courier New"},
					textAlign : 'center',
					left: "5dp",
					top: "2dp",
					right: "5dp",
					width: "250dp",
					height: Ti.UI.SIZE
				});
				
				if (globals.osname === "android") {
					titleLabel.font = {fontSize: "14sp", fontFamily: "monospace"};
					titleLabel.setColor("#fff");
					titleView.setBackgroundColor("#444444");
				}
				
				var nrOfRows = 1;
				var pixelsPerRow = 17;
				var words = titleItem.title.split(" ");

				var maxAllowedRowLength = 28;

				if (Ti.Platform.osname === "ipad") {
					maxAllowedRowLength = 45;
					titleLabel.setWidth("380dp");
				}

				var currentCount = 0;
								
				for (var i=0; i < words.length; i++) {
					if ((currentCount + words[i].length) > maxAllowedRowLength) {
						nrOfRows++;
						currentCount = (words[i].length + 1);
					} else {
						currentCount += (words[i].length + 1);
					}
				}
				
				titleView.setHeight((nrOfRows * pixelsPerRow) + "dp");
				titleView.add(titleLabel);
				
				//titleView.setHeight(titleLabel.rect.height);
				
				var section = Ti.UI.createTableViewSection({headerView: titleView});
				table.appendSection(section);
				
				//titleView.setHeight(titleLabel.toImage().height);
				
				for(var i=1,j=data.length; i<j; i++){
					table.appendRow(TableFormatter.getFormattedRow(data[i]));
				}
			} else {
				for(var i=1,j=data.length; i<j; i++){
					table.appendRow(TableFormatter.getFormattedRow(data[i]));
				}
			}
		}
	},
	rowTypes: {
		product: function() {
			var icon = Ti.UI.createLabel({left: 15, font: {fontFamily: globals.fontawesome.fontfamily(), fontSize: 18}, text: globals.fontawesome.icon('fa-medkit')});
			if (globals.osname === "android") {
				icon.left = "15dp";
				//icon.top = "8dp";
				icon.font.fontSize = "18sp";
			}
			return icon;
		},
		facts: function() {
			var icon = Ti.UI.createLabel({left: 15, font: {fontFamily: globals.fontawesome.fontfamily(), fontSize: 18}, text: globals.fontawesome.icon('fa-th-list')});
			if (globals.osname === "android") {
				icon.left = "15dp";
				//icon.top = "8dp";
				icon.font.fontSize = "18sp";
			}
			return icon;
		},
		infoTable: function() {
			var icon = Ti.UI.createLabel({left: 15, font: {fontFamily: globals.fontawesome.fontfamily(), fontSize: 18}, text: globals.fontawesome.icon('fa-th-large')});
			if (globals.osname === "android") {
				icon.left = "15dp";
				//icon.top = "8dp";
				icon.font.fontSize = "18sp";
			}
			return icon;
		},
		figure: function() {
			var icon = Ti.UI.createLabel({left: 15, font: {fontFamily: globals.fontawesome.fontfamily(), fontSize: 18}, text: globals.fontawesome.icon('fa-bar-chart-o')});
			if (globals.osname === "android") {
				icon.left = "15dp";
				//icon.top = "8dp";
				icon.font.fontSize = "18sp";
			}
			return icon;
		},
		atc: function() {
			var icon = Ti.UI.createLabel({left: 15, font: {fontFamily: globals.fontawesome.fontfamily(), fontSize: 18}, text: globals.fontawesome.icon('fa-plus')});
			if (globals.osname === "android") {
				icon.left = "15dp";
				//icon.top = "8dp";
				icon.font.fontSize = "18sp";
			}
			return icon;
		},
		therapyRecommendations: function() {
			var icon = Ti.UI.createLabel({left: 15, font: {fontFamily: globals.fontawesome.fontfamily(), fontSize: 18}, text: globals.fontawesome.icon('fa-info-circle')});
			if (globals.osname === "android") {
				icon.left = "15dp";
				//icon.top = "8dp";
				icon.font.fontSize = "18sp";
			}
			return icon;
		},
		_header: function() {
			var icon = Ti.UI.createLabel({left: 15, font: {fontFamily: globals.fontawesome.fontfamily(), fontSize: 18}, text: globals.fontawesome.icon('fa-bookmark-o')});
			if (globals.osname === "android") {
				icon.left = "15dp";
				//icon.top = "8dp";
				icon.font.fontSize = "18sp";
			}
			return icon;
		}
	},
	getFormattedRow: function(data, isHeaderItem) {

		if (!data) {
			return Ti.UI.createTableViewRow({top: 10, title: "Okänd"});
		}

		var row = Ti.UI.createTableViewRow({layout: "composite", top: 10});

		var label = Ti.UI.createLabel({
			left: 0,
			top: 10,
			//bottom: 15,
			text: data.title,
			font: {
				fontSize: 18, 
				fontFamily: "Avenir Next",
				fontWeight: "normal"
			}
		});

		if (isHeaderItem) {
			label.font.fontWeight = "bold";
			//label.font.textStyle = Ti.UI.TEXT_STYLE_HEADLINE;
		}

		row.id = data.id;
		row.dataTitle = data.title;

		if (data.hasChild !== undefined) {
			row.hasChild = data.hasChild;
		}

		if (data.hasChildren !== undefined) {
			row.hasChild = data.hasChildren;
		}

		var textView = Ti.UI.createView({left: 15, top: 0, layout: "vertical", height: Ti.UI.SIZE});

		if (globals.osname === "android") {

			textView.left = "18dp";

			label.height = Ti.UI.SIZE;
			//Ti.API.error(label.getBottom());
			row.top = 0;
			label.top = "8dp";
			label.bottom = "8dp";

			label.font = {fontFamily: "sans-serif-light", fontSize: "18sp"};
		}

		if (data.disabled || data.noinfo === true) {
			label.setColor("#cecece");
			if (globals.osname === "android") {
				label.setColor("#414141");
			}
		}
		
		textView.add(label);
		
		if (data.type !== undefined) {
			row.type = data.type;
			if (TableFormatter.rowTypes[row.type] !== undefined) {
				var icon = TableFormatter.rowTypes[row.type]();
				textView.left = 40;
				
				if (globals.osname === "android") {
					textView.left = "40dp";
				}

				row.add(icon);
			}
		}

		if (data.type === "product") {
			var brand = undefined;
			var description = undefined;
			
			var title = data.title.split(", ");
			if (title.length >= 3) {
				brand = title.pop().trim();
				description = title.pop().trim();
			}
			
			title = title.join("\n");
			
			label.text = title;

			if (description) {
				
				var descriptionLabel = Ti.UI.createLabel({
					text : description,
					font : {fontSize: "14sp", fontFamily: "Avenir Next"},
					textAlign : "left",
					left: 0
				});

				if (data.disabled || data.noinfo === true) {
					descriptionLabel.setColor("#cecece");
					if (globals.osname === "android") {
						descriptionLabel.setColor("#414141");
					}
				}
				
				textView.add(descriptionLabel);
				
			}
			
			if (brand) {
				
				var brandLabel = Ti.UI.createLabel({
					text : brand,
					font : {fontSize: "12sp", fontFamily: "Avenir Next"},
					textAlign : "left",
					left: 0
				});

				if (data.disabled || data.noinfo === true) {
					brandLabel.setColor("#cecece");
					if (globals.osname === "android") {
						brandLabel.setColor("#414141");
					}
				}
				
				textView.add(brandLabel);
				
			}
		}



		//Add images
		if (data.images && data.images.length > 0) {
			var imageView = Ti.UI.createView({layout: "composite"});
			
			for (var i=0; i < data.images.length; i++) {
				var indentation = (35 * i) + "dp";

				var imageUrl = "http://www.lakemedelsboken.se/" + data.images[i];
				var image = Ti.UI.createImageView({image: imageUrl, width: "30dp", left: indentation});
				
				//Ti.API.log("Adding image with url: " + imageUrl);
				imageView.add(image);
			}
			
			imageView.height = 25;
			
			textView.add(imageView);
		}
		
/*
		if (maxImageHeight > 0) {
			textView.setTop(maxImageHeight + 10);
		}
*/
		row.textView = textView;
		row.add(textView);
		
		return row;
	},
	
	getSearchFormattedRow: function(data) {
		var row = TableFormatter.getFormattedRow(data);
		
		//row.setLayout("vertical");
		//row.setTop(10);
		
		/*
		var children = row.getChildren();

		for(var i=0,j=children.length; i<j; i++){
			if (children[i].getApiName() === "Ti.UI.Label") {
				children[i].setTop(10);
			}
		}
		*/
		
		if (data.titlePath && data.titlePath !== "") {
			var label = Ti.UI.createLabel({
				left: 0,
				text: data.titlePath.replace(/\s&&\s/g, " / "),
				font: {
					fontSize: 10, 
					fontFamily: "Avenir Next",
					fontWeight: "normal"
				}
			});

			if (globals.osname === "android") {

				label.top = "1dp";
				label.bottom = "8dp";
	
				label.font = {fontFamily: "sans-serif-light", fontSize: "10sp"};

				var firstLabel = row.textView.getChildren()[0];
				firstLabel.bottom = undefined;

			}

			row.textView.add(label);

		}
		
		return row;
	}
};

module.exports = TableFormatter;