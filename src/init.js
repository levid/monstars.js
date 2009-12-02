(function() {

var init = this.init = function() {
	//get *this* script tag
	var self = get_self_script();
	
	//grab directory of this script tag
	get_root(self);
	
	//setup DOMready function, since MooTools might get loaded too late
	domready();
	
	//get app dir from GET
	get_app(self);
		
	//include APP
	init.queue('config.js', APP_DIR);
};

var HEAD = document.getElementsByTagName('head')[0];

var get_self_script = function() {
	var scripts = HEAD.getElementsByTagName('script');
	var self_script;
	for(var i = 0, len = scripts.length; i < len; i++) {
		var src = scripts[i].src;
		if(src.match(/init\.js/)) {
			self_script = scripts[i];
			break;
		}
	}
	
	return self_script;
};

var get_dir = function(script) {
	return script.src.replace(/[a-zA-Z0-9\-_]+\.js(.*)$/,'')
};

var ROOT;
var get_root = function(self_script) {
	return ROOT = get_dir(self_script);
};

var APP_DIR;
var get_app = function(self_script) {
	try {
		var path = self_script.src.match(/init\.js\?(.*)$/)[1];
	} catch(e) {}
	if(!path)
		throw new Error('Must include app directory after init.js');
	
	var dots = path.match(/\.\.\//g);
	if(dots && dots.length) {
		var root = ROOT;
		for(var i = 0; i < dots.length; i++) {
			root = root.replace(/[a-zA-Z0-9\-_]+\/$/,'');
		}
		path = root + path.replace(/\.\.\//g,'').replace(/\/$/,'') + '/';
	}
	return APP_DIR = path;
};

var domready = function() {
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
var SCRIPTS = [];
function Script(file) {
	var fileName = this.fileName = file.replace(/\.js$/,'') + '.js';
	if(SCRIPTS[fileName])
		return SCRIPTS[fileName];
	else
		return SCRIPTS[fileName] = this;
};

Script.prototype = {
	
	include: function(callback, type) {
		var fileName = this.fileName;
		var that = this;
		var loaded = function() {
			that._loaded = true;
			callback()
		}
		
		var script = document.createElement('script');
		script.type = type || 'text/javascript';
		script.src = fileName;
		if(callback && typeof callback == 'function') {
			script.onload = loaded;
			script.onreadystatechange = function() {
				if(this.readyState == 'complete') {
					loaded();
				}
			}
		}
		if(this.script) {
			HEAD.replaceChild(script, this.script);
		} else {
			HEAD.appendChild(script);
		}
		SCRIPTS[fileName] = this;
		return this.script = script;
	},
	
	load: function(callback) {
		return this.include(callback, 'text/html');
	},
	
	execute: function(callback) {
		return this.include(callback);
	},
	
	isLoaded: function() {
		return this._loaded;
	}
	
	
};

var QUEUE = [];
init.queue = function(files, path) {
	if(!(files instanceof Array)) files = [files];
	path = path || ROOT;
	if(path.substring(path.length-1) != '/')  path += '/';
	for(var i = 0; i < files.length; i++) {
		if(typeof files[i] == 'string') {
			var S = new Script(path + files[i])
			S.load(execute_next);
			QUEUE.push(S);
		} else if (typeof files[i] == 'function') {
			QUEUE.push(files[i]);
		}
	}
};

var executing = false;

var execute_next = function() {
	if(!executing && QUEUE[0]) {
		
		if(QUEUE[0] instanceof Script && QUEUE[0].isLoaded()) {
			executing = true;
			var script = QUEUE.shift();
			script.execute(function() {
				executing = false;
				execute_next();
			});
		} else if (typeof QUEUE[0] =='function') {
			var func = QUEUE.shift();
			func();
			executing = false;
			execute_next();
		}
	}	
}

init.core = function(path) {
	
	var core_files = ['Core','mootools-1.2.4-core','mootools-1.2.4.1-more'];
	this.queue(core_files, ROOT + 'core');
};

init.mvc = function() {
	//maybe load Dispatcher last?
	var standard_files = ['GetClass','Element.Serialize','Model','Controller','View'];//,'Dispatcher'];
	var files;
	if(arguments) {
		var extra_files = Array.prototype.slice.apply(arguments);
		files = standard_files.concat(extra_files);
	} else {
		files = standard_files;
	}
	this.queue(files, ROOT + 'mvc');
};

init.app = function(app_funcs) {
	if(typeof app_funcs == 'function') {
		app_funcs();
	}
	init.queue('Dispatcher', ROOT + 'mvc');
};

init.models = function() {
	if(arguments) {
		var files = Array.prototype.slice.apply(arguments);
	}
	this.queue(files, APP_DIR + 'models');
};

init.controllers = function() {
	if(arguments) {
		var files = Array.prototype.slice.apply(arguments);
	}
	for(var i = 0; i < files.length; i++) {
		files[i] = files[i].replace(/\.js$/,'').replace('Controller','') + 'Controller';
	}
	this.queue(files, APP_DIR + 'controllers');
};

init.views = function() {
	if(arguments) {
		var files = Array.prototype.slice.apply(arguments);
	}
	for(var i = 0; i < files.length; i++) {
		files[i] = files[i].replace(/\.js$/,'').replace('View','') + 'View';
	}
	this.queue(files, APP_DIR + 'views');
};

var TESTS = [];

init.tests = function() {
	if(arguments) {
		var files = Array.prototype.slice.apply(arguments);
	}
	for(var i = 0; i < files.length; i++) {
		files[i] = files[i].replace(/\.js$/,'').replace('Test','') + 'Test';
		TESTS.push(files[i]);
	}
	this.queue(files, APP_DIR);
	this.queue(init.testsuite);
};


init.testsuite = function() {
	if(!executing && !QUEUE.length) {
		var casesCount = 0;
		for(var T in TESTS) {
			if(!TESTS.hasOwnProperty(T)) continue;
			var testCase = typeof TESTS[T] == 'string' ? window[TESTS[T]] : TESTS[T];
			if(testCase instanceof window.TestCase) {
				testCase.run();
				casesCount++;
			}
		}
		$(document.body).grab(new Element('div', { text: casesCount + ' Test Cases.' }));
	} else {
		setTimeout(arguments.callee, 1);
	}
};

init();

})()