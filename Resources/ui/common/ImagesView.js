function ImagesView(backgroundColor) {

	var nrOfImages = 0;

	var self = Ti.UI.createScrollView({
		backgroundColor: "#000",
		layout: "vertical",
		contentWidth: globals.rightDrawerWidth,
		contentHeight: 'auto',
		minZoomScale: 1,
		maxZoomScale: 5
	});
	
	if (backgroundColor) {
		self.backgroundColor = backgroundColor;
	}
	
	self.addEventListener("dblclick", function(event) {

		if (globals.osname !== "android") {
			if (self.getZoomScale() !== 1) {
				self.setZoomScale(1, {animated: true});
			} else {
				self.setZoomScale(2, {animated: true});
			}
		}

	});
	
	self.addImage = function(url, description) {

		nrOfImages++;

		Ti.API.log("Opening image with url: " + url);

		var image = Ti.UI.createImageView({
			image: url, 
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			top: "10dp"
		});

		self.add(image);
		
		if (description) {
			var descriptionLabel = Ti.UI.createLabel({
				text : description,
				color : '#fff',
				font : {fontSize:14, fontFamily: "Avenir Next"},
				top : "5dp",
				left : "5dp",
				right: "5dp",
				textAlign : 'center'
			});
			
			if (self.backgroundColor !== "#000") {
				descriptionLabel.color = "#000";
			}
			
			self.add(descriptionLabel);
		}
		
		if (globals.osname === "android") {
			if (nrOfImages === 1) {
				self.scrollType = "horizontal";
			} else if (nrOfImages > 1) {
				self.scrollType = "vertical";
			}
		}
				
	};
	
	return self;
};

module.exports = ImagesView;