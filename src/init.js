//MVC init.js. Copyright (c) 2009-2010 Sean McArthur <http://monstarlab.com/>, MIT Style License.
if(window.init) throw new Error('init.js already included.');
var init = (function() {

	var priv = {
		
		viewExt: '.html',
		
		HEAD: document.getElementsByTagName('head')[0],
		
		ROOT: null,
		
		PAGE: '',
		
		APP_DIR: null,
		
		QUEUE: [],
		
		env: {},
		
		use_preload: (function() {
			var is_opera = window.opera && Object.prototype.toString.call(window.opera) == "[object Opera]",
				is_gecko =  (function(o) { o[o] = o+""; return o[o] != o+""; })(new String("__count__"));
			//firefox and opera keep executing order. and firefox doesnt
			// fire onload with a fake mimeType.
			return function() {
				return !(is_opera || is_gecko);
			}
		})(),
		
		start: function() {
			var self = priv.get_init_script();
			priv.PAGE = new Script(window.location.href);
			priv.set_environment(self);
			priv.domready();
			if(self.query().split(',').indexOf('compress') !== -1) {
				//include compressed file.
			} else {
				pub.queue('config.js',priv.get_app_dir(self));
			}
			
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
			var SELF = priv.ROOT = new Script(self_script)
			SELF._loaded = true;
			return SELF;
		},
		
		set_environment: function(self_script) {
			var options = self_script.query().split(',');
			priv.env.test = (options.indexOf('test') !== -1);
			priv.env.compress = (options.indexOf('compress') !== -1);
		},
		
		get_app_dir: function(init_script) {
			var path = init_script.query().split(',')[0];
			if(!path)
				throw new Error('Must include app directory after init.js');
			
			var dots = path.match(/\.\.\//g);
			if(dots && dots.length) {
				var root = priv.ROOT.dir();
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
					} catch(e) {
						setTimeout(arguments.callee, 0);
					}
					if(window.Browser && Browser.loaded) {
						window.fireEvent('domready');
						document.fireEvent('domready');
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
			request.open('GET', path, false); //asynchronous = false
			try {
				request.send();
			} catch(e) { return null; }
			if ( request.status == 500 || request.status == 404 || request.status == 2 ||(request.status == 0 && request.responseText == '') ) return null;
			return request.responseText;
		},
		
		EXECUTING: false,
		
		execute_next: function() {
			if(!priv.EXECUTING && priv.QUEUE[0]) {
				if(priv.QUEUE[0] instanceof Script && (!priv.use_preload() || priv.QUEUE[0].isLoaded())) {
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
		
		SCRIPTS: {},
		
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
		
		protocol: function() {
			return this.fileName.match(/^(https?|file)/)[1];
		},
		
		domain: function() {
			if (this.protocol() == 'file') return null;
			return this.fileName.match(/^https?:\/\/([^\/]*)/)[1];
		},
		
		isCrossDomain: function() {
			return this.domain() != priv.PAGE.domain()
		},
		
		getPath: function() {
			return this.fileName.replace('?'+this.query(), '');
		},
		
		dir: function() {
			return this.fileName.replace(this.query(),'').replace(/[^\/]+$/, '');//(/[a-zA-Z0-9\-_]+\.js(.*)$/,'');
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
			path = path || priv.ROOT.dir();
			if(path.substring(path.length-1) != '/')  path += '/';
			for(var i = 0; i < files.length; i++) {
				if(typeof files[i] == 'string') {
					var S = new Script(path + files[i].replace(/\.js$/,'') + '.js')
					if (priv.use_preload()) {
						S.load(priv.execute_next);
						priv.QUEUE.push(S);
					} else {
						//only executing
						priv.QUEUE.push(S);
						priv.execute_next();
					}
					
					
				} else if (typeof files[i] == 'function') {
					priv.QUEUE.push(files[i]);
				}
			}
			return pub;
		},
		core: function() {
			var core_files = ['mootools-1.2.4-core','mootools-1.2.4.2-more'];
			if(priv.env.test) {
				core_files = (core_files.join('-nc|')+'-nc').split('|');
			}
			core_files.push('Core');
			return this.queue(core_files, priv.ROOT.dir() + 'core');
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
			return this.queue(files, priv.ROOT.dir() + 'mvc');
		},
		app: function(app_funcs) {
			if(typeof app_funcs == 'function') {
				app_funcs();
			}
			return this.queue('Dispatcher', priv.ROOT.dir() + 'mvc');
		},
		models: function() {
			if(arguments) {
				var files = Array.prototype.slice.apply(arguments);
			
				this.queue(files, priv.APP_DIR + 'models');
			}
			return pub;
		},
		controllers: function() {
			if(arguments) {
				var files = Array.prototype.slice.apply(arguments);
			
				for(var i = 0; i < files.length; i++) {
					files[i] = files[i].replace(/\.js$/,'').replace('Controller','') + 'Controller';
				}
				this.queue(files, priv.APP_DIR + 'controllers');
			}
			return pub;
		},
		
		//checks cache (priv.VIEWS), otherwise, XHR gets contents.
		view: function(view_name) {
			var fileName = priv.APP_DIR + 'views/' + view_name.replace(/\.html$/,'') + priv.viewExt;
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
					
					var fileName = priv.APP_DIR + 'views/' + files[i].replace(/\.html$/,'') + priv.viewExt;
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
			return pub;
		},
		tests: function() {
			if(arguments) {
				pub.queue('TestSuite', priv.ROOT.dir() + 'mvc');
				var files = Array.prototype.slice.apply(arguments);
				for(var i = 0; i < files.length; i++) {
					files[i] = files[i].replace(/\.js$/,'').replace('Test','') + 'Test';
					priv.TESTS.push(files[i]);
				}
				pub.queue(files, priv.APP_DIR + 'tests');
				pub.queue(function() {
					if(!priv.EXECUTING && !priv.QUEUE.length && window.TestSuite) {
						window.TestSuite(priv.TESTS);
					} else {
						setTimeout(arguments.callee, 1);
					}
				});
			}
			return pub;
		}
	};


	priv.start();
	return pub;

})();