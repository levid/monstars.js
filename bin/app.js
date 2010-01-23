print('Not implemented yet.');
quit();

var app = (function(appName) {
	
	var config = '';
	
	function File(path) {
		this.fileName = path;
	}
	File.prototype = {
		dir: function() {
			return this.fileName.replace(/[^\/\\]*$/,'');
		}
	};
	
	var fileize = function(name) {
		return name.toLowerCase().replace(/[^a-zA-Z0-9\.\-_]/g,'-');
	};
	
	var pub = {
		generate: function(appName, path) {
			path = path || 'apps/'+fileize(appName)
			config = new File(); 
		}
	};
	return pub;

})();

app.generate(arguments[0], arguments[1]);