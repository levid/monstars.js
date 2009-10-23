(function() {

var init = this.init = function() {
	//get *this* script tag
	var self = init.get_self_script();
	
	//grab directory of this script tag
	var root_dir = init.get_root(self);
	
	//get app dir from GET
	var app_dir = init.get_app(self);
	
	//setup DOMready function, since MooTools might get loaded too late
	init.domready();
	
	//include APP
	init.include('config.js', app_dir);
};

init.head = document.getElementsByTagName('head')[0];

init.get_self_script = function() {
	var scripts = init.head.getElementsByTagName('script');
	for(var i = 0, len = scripts.length; i < len; i++) {
		var src = scripts[i].src;
		if(src.match(/init\.js/)) {
			this.self_script = scripts[i];
			break;
		}
	}
	
	return this.self_script;
};

init.get_dir = function(script) {
	return script.src.replace(/[a-zA-Z0-9\-_]+\.js(.*)$/,'')
};

init.get_root = function(self_script) {
	return this.root = this.get_dir(self_script);
};

init.get_app = function(self_script) {
	try {
		var path = self_script.src.match(/init\.js\?(.*)$/)[1];
	} catch(e) {}
	if(!path)
		throw new Error('Must include app directory after init.js');
	
	var dots = path.match(/\.\.\//g);
	if(dots.length) {
		var root = this.root;
		for(var i = 0; i < dots.length; i++) {
			root = root.replace(/[a-zA-Z0-9\-_]+\/$/,'');
		}
		path = root + path.replace(/\.\.\//g,'').replace(/\/$/,'') + '/';
	}
	return this.app_dir = path;
};

init.domready = function() {
	var loaded = false;
	var domready = function(){
		loaded = true;
		(function() {
			try {
				Browser.loaded = true;
				window.fireEvent('domready');
				document.fireEvent('domready');
			} catch(e) {
				setTimeout(arguments.callee, 0);
			}
		})();
	};

	// Mozilla, Opera and webkit nightlies currently support this event
	if ( document.addEventListener ) {
		// Use the handy event callback
		document.addEventListener( "DOMContentLoaded", function(){
			document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
			domready();
		}, false );

	// If IE event model is used
	} else if ( document.attachEvent ) {
		// ensure firing before onload,
		// maybe late but safe also for iframes
		document.attachEvent("onreadystatechange", function(){
			if ( document.readyState === "complete" ) {
				document.detachEvent( "onreadystatechange", arguments.callee );
				domready();
			}
		});

		// If IE and not an iframe
		// continually check to see if the document is ready
		if ( document.documentElement.doScroll && window == window.top ) (function(){
			if ( loaded ) return;

			try {
				// If IE is used, use the trick by Diego Perini
				// http://javascript.nwbox.com/IEContentLoaded/
				document.documentElement.doScroll("left");
			} catch( error ) {
				setTimeout( arguments.callee, 0 );
				return;
			}

			// and execute any waiting functions
			domready();
		})();
	}
};

init.include = function(file, callback) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = file.replace(/\.js$/,'') + '.js';
	if(callback && typeof callback == 'function') {
		script.onload = callback;
		script.onreadystatechange = function() {
			if(this.readyState == 'complete') {
				callback();
			}
		}
	}
	this.head.appendChild(script);
	return script;
};

var queue = [];
init.queue = function(files, path) {
	if(!(files instanceof Array)) files = [files];
	path = path || this.root;
	if(path.substring(path.length-1) != '/')  path += '/';
	for(var i = 0; i < files.length; i++) {
		queue.push(path + files[i]);
	}
	if(!including)
		this.queue_next();
};

var including = false;
init.queue_next = function() {
	if(including) return;
	including = true;
	var script = this.include(queue.shift(), function() {
		including = false;
		if(queue.length)
			init.queue_next();
	});
	
}

init.core = function(path) {
	
	var core_files = ['Core','mootools-1.2.4-core','mootools-1.2.4.1-more'];
	this.queue(core_files, this.root + 'core');
};

init.mvc = function() {
	//maybe load Dispatcher last?
	var standard_files = ['GetClass','Element.Serialize','Model','Controller','View'];//,'Dispatcher'];
	var files;
	if(arguments.length) {
		var extra_files = Array.prototype.slice.apply(arguments);
		files = standard_files.concat(extra_files);
	} else {
		files = standard_files;
	}
	this.queue(files, this.root + 'mvc');
};

init.app = function(app_funcs) {
	if(typeof app_funcs == 'function') {
		app_funcs();
	}
	init.queue('Dispatcher', this.root + 'mvc');
};

init.models = function() {
	if(arguments.length) {
		var files = Array.prototype.slice.apply(arguments);
	}
	this.queue(files, this.app_dir + 'models');
};

init.controllers = function() {
	if(arguments.length) {
		var files = Array.prototype.slice.apply(arguments);
	}
	for(var i = 0; i < files.length; i++) {
		files[i] = files[i].replace(/\.js$/,'').replace('Controller','') + 'Controller';
	}
	this.queue(files, this.app_dir + 'controllers');
};

init.views = function() {
	if(arguments.length) {
		var files = Array.prototype.slice.apply(arguments);
	}
	for(var i = 0; i < files.length; i++) {
		files[i] = files[i].replace(/\.js$/,'').replace('View','') + 'View';
	}
	this.queue(files, this.app_dir + 'views');
};

init();

})()