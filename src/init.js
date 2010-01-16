//MVC init.js. Copyright (c) 2009-2010 Sean McArthur <http://monstarlab.com/>, MIT Style License.
var init = (function() {

	var priv = {
		
		HEAD: document.getElementsByTagName('head')[0],
		
		ROOT: null,
		
		APP_DIR: null,
		
		QUEUE: [],
		
		start: function() {
			var self = this.get_init_script();
			this.ROOT = self.dir();
			
			this.domready();

			pub.queue('config.js',this.get_app_dir(self));
		},
		
		get_init_script: function() {
			var scripts = this.HEAD.getElementsByTagName('script');
			var self_script;
			for(var i = 0, len = scripts.length; i < len; i++) {
				var src = scripts[i].src;
				if(src.match(/init\.js/)) {
					self_script = scripts[i];
					break;
				}
			}
			var SELF = new Script(self_script)
			SELF._loaded = true;
			return SELF;
		},
		
		get_app_dir: function(init_script) {
			var path = init_script.query();
			if(!path)
				throw new Error('Must include app directory after init.js');
			
			var dots = path.match(/\.\.\//g);
			if(dots && dots.length) {
				var root = this.ROOT;
				for(var i = 0; i < dots.length; i++) {
					root = root.replace(/[a-zA-Z0-9\-_]+\/$/,'');
				}
				path = root + path.replace(/\.\.\//g,'').replace(/\/$/,'') + '/';
			}
			return this.APP_DIR = path;
		},
		
		domready: function() {
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
		},
		
		request: function(path) {
			var request = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
			request.open('GET', path, false);
			try {
				request.send();
			} catch(e) { return null; }
			if ( request.status == 500 || request.status == 404 || request.status == 2 ||(request.status == 0 && request.responseText == '') ) return null;
			return request.responseText;
		},
		
		EXECUTING: false,
		
		execute_next: function() {
			if(!priv.EXECUTING && priv.QUEUE[0]) {
				if(priv.QUEUE[0] instanceof Script && priv.QUEUE[0].isLoaded()) {
					priv.EXECUTING = true;
					var script = priv.QUEUE.shift();
					script.execute(function() {
						priv.EXECUTING = false;
						priv.execute_next();
					});
				} else if (typeof priv.QUEUE[0] =='function') {
					var func = priv.QUEUE.shift();
					func();
					priv.execute_next();
				}
			}
		},
		
		SCRIPTS: [],
		
		VIEWS: [],
		
		TESTS: []
		
	};
	
	function Script(file) {
		if(typeof file == 'string') {
			this.fileName = file;
		} else if (file && file.nodeName && file.nodeName == 'SCRIPT') {
			this.script = file;
			this.fileName = this.script.src;
			this._loaded = true;
		}
		
		if(priv.SCRIPTS[this.fileName])
			return priv.SCRIPTS[this.fileName];
		else
			return priv.SCRIPTS[this.fileName] = this;
	};
	
	Script.prototype = {
		
		include: function(callback, type) {
			var fileName = this.fileName;
			var that = this;
			var loaded = function() {
				that._loaded = true;
				callback.call(that);
			}
			
			var script = document.createElement('script');
			script.type = type || 'text/javascript';
			script.src = fileName;
			if(callback && typeof callback == 'function') {
				script.onload = loaded;
				script.onreadystatechange = function() {
					if(this.readyState == 'complete' || this.readyState == 'loaded') {
						loaded();
					}
				}
			}
			if(this.script) {
				priv.HEAD.replaceChild(script, this.script);
			} else {
				priv.HEAD.appendChild(script);
			}
			priv.SCRIPTS[fileName] = this;
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
		},
		
		dir: function() {
			return this.fileName.replace(/[a-zA-Z0-9\-_]+\.js(.*)$/,'');
		},
		
		query: function() {
			var q;
			try {
				q = this.fileName.match(/\?(.*)$/)[1];
			} catch(e) {}
			return q;			
		}
		
	};

	var pub = {
		
		app_dir: function() {
			return priv.APP_DIR;
		},
		
		queue: function(files, path) {
			if(!(files instanceof Array)) files = [files];
			path = path || priv.ROOT;
			if(path.substring(path.length-1) != '/')  path += '/';
			for(var i = 0; i < files.length; i++) {
				if(typeof files[i] == 'string') {
					var S = new Script(path + files[i].replace(/\.js$/,'') + '.js')
					S.load(priv.execute_next);
					priv.QUEUE.push(S);
				} else if (typeof files[i] == 'function') {
					priv.QUEUE.push(files[i]);
				}
			}
		},
		core: function() {
			var core_files = ['mootools-1.2.4-core','mootools-1.2.4.1-more','Core'];
			this.queue(core_files, priv.ROOT + 'core');
		},
		mvc: function() {
			var standard_files = ['GetClass','Element.Serialize','Model','Model.Fields','Controller','View'];
			var files;
			if(arguments) {
				var extra_files = Array.prototype.slice.apply(arguments);
				files = standard_files.concat(extra_files);
			} else {
				files = standard_files;
			}
			this.queue(files, priv.ROOT + 'mvc');
		},
		app: function(app_funcs) {
			if(typeof app_funcs == 'function') {
				app_funcs();
			}
			this.queue('Dispatcher', priv.ROOT + 'mvc');
		},
		models: function() {
			if(arguments) {
				var files = Array.prototype.slice.apply(arguments);
			
				this.queue(files, priv.APP_DIR + 'models');
			}
		},
		controllers: function() {
			if(arguments) {
				var files = Array.prototype.slice.apply(arguments);
			
				for(var i = 0; i < files.length; i++) {
					files[i] = files[i].replace(/\.js$/,'').replace('Controller','') + 'Controller';
				}
				this.queue(files, priv.APP_DIR + 'controllers');
			}
		},
		
		//checks cache (priv.VIEWS), otherwise, XHR gets contents.
		view: function(view_name) {
			var fileName = priv.APP_DIR + 'views/' + view_name.replace(/\.html$/,'') + '.html';
			if(!priv.VIEWS[fileName]) {
				priv.VIEWS[fileName] = priv.request(fileName);
			}
			return priv.VIEWS[fileName];
		},
		
		//this lets us preload views if we want to
		views: function() {
			if(arguments) {
				var files = Array.prototype.slice.apply(arguments);
				for(var i = 0; i < files.length; i++) {
					
					var fileName = priv.APP_DIR + 'views/' + files[i].replace(/\.html$/,'') + '.html';
					if(!priv.VIEWS[fileName]) {
						var viewScript = new Script(fileName);
						if(!viewScript.isLoaded()) {
							viewScript.load(function() {
								var file = this.fileName;
								this.script.parentNode.removeChild(this.script);
								
							});
						}
					}
				}
			}
		},
		tests: function() {
			if(arguments) {
				this.queue('TestSuite', priv.ROOT + 'mvc');
				var files = Array.prototype.slice.apply(arguments);
			
				for(var i = 0; i < files.length; i++) {
					files[i] = files[i].replace(/\.js$/,'').replace('Test','') + 'Test';
					priv.TESTS.push(files[i]);
				}
				this.queue(files, priv.APP_DIR + 'tests');
				this.queue(this.testsuite);
				this.queue(function() {
					if(!priv.EXECUTING && !priv.QUEUE.length) {
						window.TestSuite(priv.TESTS);
					} else {
					   setTimeout(arguments.callee, 1);
					}
				});
			}
		}
	};


	priv.start();
	return pub;

})();