/*
	View.Helpers - merges all function on View.Helpers to be available inside
	view code.
	requires: View.js
	provides: View.Helpers
*/
View.Helpers = $extend(View.Helpers, {
	
	link_to: function(text, href) {
		return '<a href="'+href+'">'+text+'</a>';
	}
	
});