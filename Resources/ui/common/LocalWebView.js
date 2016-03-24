function LocalWebView (initialHtml, width){

	var viewWidth = Ti.UI.FILL; 

	if (width !== undefined) {
		viewWidth = width;
	}

	var self = Ti.UI.createWebView({backgroundColor: "#fff", width: viewWidth});

	var addedHtml = [];

	if (width === undefined) {
		width = "device-width";
	}

	var header = [
'<!DOCTYPE html>',
'<html>',
'	<head>',
'		<title></title>',
'		<meta name="viewport" content="width=' + width + ', initial-scale=1.0, user-scalable=yes, maximum-scale=3, minimum-scale=0.25">',
'		<meta name="author" content="Läkemedelsverket">',
'		<link rel="stylesheet" href="{server}/css/app/styles.min.css">', 
'	</head>',
'	<body>',
'		<div class="container" id="content">',
'			<div class="row">',
'				<div id="mainContainer" class="span10 offset1">',
'					<div id="main">'];

	var footer = [
'					</div>',
'				</div>',
'			</div>',
'		</div>',
'		<script src="{server}/js/app/scripts.min.js"></script>',
'	</body>',
'</html>'];

	self.addHtml = function(html) {
		addedHtml.push(html);
		
		var html = header.join("\n") + addedHtml.join("") + footer.join("\n");
		html = html.replace(/\{server\}/g, globals.serverAddress);
		
		self.setHtml(html);
				
	};
	
	if (initialHtml) {
		self.addHtml(initialHtml);
	}
	
	return self;
}

module.exports = LocalWebView;