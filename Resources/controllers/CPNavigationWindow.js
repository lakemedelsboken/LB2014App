function CPNavigationWindow(options) {

	var self;
	
	if (Ti.Platform.osname !== "android") {
		
		options = options ? options : {};
		//Ti.API.log("Creating navigation window...");
		self = Ti.UI.iOS.createNavigationWindow(options);
		
		if (options) {
			self.options = options;
		} else {
			self.options = {};
		}
		
		//Ti.API.log("Created navigation window " + self.getApiName());

		self.windowStack = [];

		//Ti.API.log("Created: ");		
		//Ti.API.log(self.windowStack);		

		if (options && options.window) {
			//Titanium goodness
			var stack = self.windowStack;
			stack.push(options.window);
			self.windowStack = stack;
			
			var showHamburger = true;
			if (options.showHamburger !== undefined) {
				showHamburger = options.showHamburger;
			}
			
			if (stack.length === 1 && showHamburger) {
				
				//Add hamburger
				var hamburgerButton = Ti.UI.createButton({image: "images/hamburger_white.png"});
				hamburgerButton.addEventListener("click", function(event) {
					self.fireEvent("clickedHamburger");
				});
				
				options.window.setLeftNavButton(hamburgerButton);
			}
			
		}

		self.openWin = function(window, windowOptions) {

			//Titanium goodness
			var stack = self.windowStack;
			stack.push(window);
			self.windowStack = stack;

			//Ti.API.log("Open window, add to windowStack, now of length: " + self.windowStack.length);

			var showHamburger = true;
			if (self.options.showHamburger !== undefined) {
				showHamburger = self.options.showHamburger;
			}

			if (stack.length <= 2 && showHamburger) {
				
				//Add hamburger
				var hamburgerButton = Ti.UI.createButton({image: "images/hamburger_white.png"});
				hamburgerButton.addEventListener("click", function(event) {
					self.fireEvent("clickedHamburger");
				});
				
				window.setLeftNavButton(hamburgerButton);
			}

			self.openWindow(window, windowOptions);
		};
		
		self.closeWin = function(window, windowOptions) {

			//Titanium goodness, working around that the property is immutable
			var stack = self.windowStack;
			var winToClose = stack.pop();
			self.windowStack = stack;
			
			windowOptions = windowOptions ? windowOptions : {animated: true};
			self.closeWindow(winToClose, windowOptions);
			self.fireEvent("closeWin");
		};
		
		self.openFromHome = function(window) {

			//Ti.API.log("openFromHome, children: " + self.windowStack.length);

			//Clear all other windows
			var children = self.windowStack;

			//Can not close root window on iOS
			for (var i = children.length - 1; i >= 1; i--){
				//Ti.API.log("Closing: " + i);
				self.closeWin(children[i], {animated: false});
			}

			//Open new window, wait for closeWin event to propagate
			setTimeout(function() {
				self.openWin(window, {animated: false});
			}, 1);
		};

	} else {

		self = Ti.UI.createView({
			//layout: "composite",
			//backgroundColor: "#000",
			zIndex: 1
		});

		self.options = options;
		self.windowStack = [];
		
		self.openFromHome = function(window) {
			//Clear all other windows
			var children = self.windowStack;

			for (var i = children.length - 1; i >= 0; i--){
				//Ti.API.log("Closing: " + i);
				self.closeWin(children[i], {animated: false});
			}

			//Open new window
			self.openWin(window);
		};

		self.openWin = function(winOrViewToOpen) {

			//Ti.API.log("Open window...");

			if (winOrViewToOpen.getApiName() !== "Ti.UI.View") {

				//Ti.API.log("Creating new view from window...");

				//Create a new view and add each child of the window
				var replacementView = Ti.UI.createView({
					backgroundColor: winOrViewToOpen.getBackgroundColor(),
					layout: "vertical"
				});
				
				var topView = Ti.UI.createView({
					layout: "composite",
					backgroundColor: "#000",
					height: "50dp"
				});
				
				if (winOrViewToOpen.getTitle()) {
					var control = winOrViewToOpen.getTitle();

					if (typeof control === "string") {

						//Ti.API.log("Creating title: " + control);
						
						var title = Ti.UI.createLabel({
							text : control,
							color : '#fff',
							font : {fontSize:"12sp"},
							height : "40dp",
							width : Ti.UI.FILL,
							top : "5dp",
							left : "5dp",
							textAlign : 'center'
						});

						if (self.windowStack.length > 0) {
							title.setLeft("90dp");
							title.setTextAlign("left");
						}						

						// Add to the parent view.
						topView.add(title);
						
					} else {
						topView.add(control);
					}

				} else {
					var title = Ti.UI.createLabel({
						text : "",
						color : '#fff',
						font : {fontSize:"12sp"},
						height : "40dp",
						width : Ti.UI.FILL,
						top : "5dp",
						left : "5dp",
						textAlign : 'center'
					});

					if (self.windowStack.length > 0) {
						title.setLeft("90dp");
						title.setTextAlign("left");
					}						

					// Add to the parent view.
					topView.add(title);
					topView.titleControl = title;
				}
				
				if (self.windowStack.length > 0) {
					
					//Create a back button.
					var backButton = Ti.UI.createButton({
						//title : 'Tillbaka',
						height : "40dp",
						width : "60dp",
						top : "5dp",
						left : "5dp",
						font : {fontFamily: globals.fontawesome.fontfamily(), fontSize: "16sp"},
						title: globals.fontawesome.icon('fa-chevron-left'),
						color: "#fff",
						backgroundColor: "transparent"
					});
					
					//Listen for click events.
					backButton.addEventListener('click', function() {
						self.closeWin();
					});
					
					//Add to the parent view.
					topView.add(backButton);

					if (winOrViewToOpen.rightButton !== undefined) {
						var rightButton = winOrViewToOpen.rightButton;
						topView.add(rightButton);
					}

					
				} else {

					var showHamburger = true;
					if (self.options.showHamburger !== undefined) {
						showHamburger = self.options.showHamburger;
					}
					
					if (showHamburger) {
						//Create a back button.
						var hamburgerButton = Ti.UI.createButton({
							//title : 'Meny',
							height : "40dp",
							width : "60dp",
							top : "5dp",
							left : "5dp",
							font: {fontFamily: globals.fontawesome.fontfamily(), fontSize: "16sp"},
							title: globals.fontawesome.icon('fa-bars'),
							color: "#fff",
							backgroundColor: "transparent"
						});
						
						//Listen for click events.
						hamburgerButton.addEventListener('click', function() {
							self.fireEvent("clickedHamburger");
						});
						
						//Add to the parent view.
						topView.add(hamburgerButton);
					}
					
					if (winOrViewToOpen.rightButton !== undefined) {
						var rightButton = winOrViewToOpen.rightButton;
						topView.add(rightButton);
					}
					
				}

				if (topView.getChildren().length > 0) {
					replacementView.add(topView);
				}

				var children = winOrViewToOpen.getChildren();
				
				for (var i=0; i < children.length; i++) {
					replacementView.add(children[i]);
				}
				
				winOrViewToOpen = replacementView;
				winOrViewToOpen.setTitle = function(title) {
					topView.titleControl.text = title;
				};
			}
			
			


			self.windowStack.push(winOrViewToOpen);

			if (self.windowStack.length === 1) {
				winOrViewToOpen.setLeft(0);
			} else {
				winOrViewToOpen.setLeft(self.windowStack[0].size.width + 1);
				winOrViewToOpen.setWidth(self.windowStack[0].size.width);
			}
			
			winOrViewToOpen.setTop(0);

			if (self.windowStack.length === 1) {
				self.add(winOrViewToOpen);
				winOrViewToOpen.animate(Titanium.UI.createAnimation({left: 0, duration: 100})); 
			} else {
				var menuIn = self.windowStack[self.windowStack.length - 1];
				var menuOut = self.windowStack[self.windowStack.length - 2];
	
				//Add new
				self.add(menuIn);

				var moveLeft = (self.windowStack[0].size.width * -1);

				menuOut.animate(Titanium.UI.createAnimation({left: moveLeft, duration: 100})); 
				menuIn.animate(Titanium.UI.createAnimation({left: 0, duration: 100})); 
	
	
			}
		};
		
		self.closeWin = function(winOrViewToClose) {
			var menuOut = self.windowStack[self.windowStack.length - 1];
			var menuIn = self.windowStack[self.windowStack.length - 2];

			//Add new
			//self.add(menuIn);
			self.windowStack.pop();

			if (self.windowStack.length > 0) {
				var moveLeft = (self.windowStack[0].size.width + 1);
				menuOut.animate(Titanium.UI.createAnimation({left: moveLeft, duration: 100})); 
			}

			if (menuIn) {
				menuIn.animate(Titanium.UI.createAnimation({left: 0, duration: 100}));
			}
			
			self.fireEvent("closeWin");
			
			setTimeout(function() {
				//TODO: Implement true cleanup/release function
				if (menuOut) {
					self.remove(menuOut);
					menuOut = null;
				}
			}, 300); 

		};
		
		if (self.options && self.options.window) {
			self.openWin(self.options.window);
		}

		
	}

	return self;

}

module.exports = CPNavigationWindow;

