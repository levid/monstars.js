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
		
		now: new Date(),
		
		use_preload: (function() {
			var is_opera = window.opera && Object.prototype.toString.call(window.opera) == "[object Opera]",
				is_gecko =  navigator.userAgent.indexOf('Firefox') >= 0;
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
			if(priv.env.compress) {
				pub.queue('compressed.js', priv.get_app_dir(self));
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
			var options = self_script.options();
			priv.env.test = options.test;
			priv.env.compress = options.compress || options.production || options.deploy;
		},
		
		get_app_dir: function(init_script) {
			var path = init_script.options().app;
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
						setTimeout(arguments.callee, 13);
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
						setTimeout( arguments.callee, 13 );
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
			return this.fileName.replace('?'+this.query(),'').replace('#'+this.hash(), '').replace(/[^\/]+$/, '');//(/[a-zA-Z0-9\-_]+\.js(.*)$/,'');
		},
		
		query: function() {
			var q;
			try {
				q = this.fileName.match(/\?(.*)$/)[1];
			} catch(e) {}
			return q;			
		},
        
        hash: function() {
            var h;
            try {
                h = this.fileName.match(/\#(.*)$/)[1];
            } catch(e) {}
            return h;
        },
        
        options: function() {
            var raw = this.query() || this.hash(),
                options = {},
                split = raw.split(',');
            
            options.app = split.shift();
            for (var i = 0; i < split.length; i++) {
                options[split[i]] = true;
            }
            
            return options;
        }
	};
	
	var eachArg = function(func) {
		return function() {
			for(var i = 0; i < arguments.length; i++) {
				func(arguments[i]);
			}
			return this;
		};
	};
	
	var extend = function(parent, child) {
		for(var i in child) {
			if(child.hasOwnProperty(i)) {
				parent[i] = child[i];
			}
		}
	};
	
	if(!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(value) {
			for(var i = 0, len = this.length; i < len; i++) {
				if(this[i] === value) {
					return i;
				}
			}
			return -1;
		};
	}
	
	var pub = function init(config) {
		if(config && typeof config == 'object') {
			pub.core();
			var app = false;
			for(var i in config) {
				if(typeof pub[i] == 'function') {
					pub[i].apply(pub, config[i]);
					if(i == 'controllers') {
						app = true;
					}
				}
			}
			if(app) {
				pub.app();
			}
		}
		
		return pub.queue(arguments, priv.APP_DIR);
	};

	extend(pub, {
		
		app_dir: function() {
			return priv.APP_DIR;
		},	
		queue: function(files, path) {
			if(!(files instanceof Array)) files = [files];
			path = path || priv.ROOT.dir();
			if(path.substring(path.length-1) != '/')  path += '/';
			for(var i = 0; i < files.length; i++) {
				if(typeof files[i] == 'string') {
					var filename = path + files[i].replace(/\.js$/,'') + '.js';
					if(priv.env.test) {
						filename += '?' + priv.now.getTime();
					}
					var S = new Script(filename);
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
			var core_files = ['mootools-1.3-core','mootools-1.3.0.1-more'];
			if(priv.env.test) {
				core_files = (core_files.join('-nc|')+'-nc').split('|');
			}
			core_files.push('Core');
			return pub.queue(core_files, priv.ROOT.dir() + 'core');
		},
		mvc: function() {
			(eachArg(function(p) {
				pub.queue(p, priv.ROOT.dir() + 'mvc');
			})).apply(window, ['GetClass','Element.Serialize','Model','Model.Fields','Controller','View'].concat(Array.prototype.slice.apply(arguments)));
		},
		
		lib: eachArg(function(p) { pub.queue(p, priv.APP_DIR + 'lib'); }),

		
		app: function(app_funcs) {
			if(typeof app_funcs == 'function') {
				app_funcs();
			}
			return pub.queue('Dispatcher', priv.ROOT.dir() + 'mvc');
		},
		
		models: eachArg(function(p) { pub.queue(p, priv.APP_DIR + 'models'); }),

		controllers: eachArg(function(p) { pub.queue(p.replace('Controller','') + 'Controller', priv.APP_DIR + 'controllers'); }),
		
		//checks cache (priv.VIEWS), otherwise, XHR gets contents.
		//XHR could be problematic for views if you store the JS on a seperate domain
		view: function(view_name) {
			var fileName = priv.APP_DIR + 'views/' + view_name.replace(/\.html$/,'') + priv.viewExt;
			if(!priv.VIEWS[fileName]) {
				priv.VIEWS[fileName] = priv.request(priv.env.test ? (fileName + '?' + priv.now.getTime()) : fileName);
			}
			return priv.VIEWS[fileName];
		},
		
		//this lets us preload views if we want to
		views: eachArg(function(p) {
			var fileName = priv.APP_DIR + 'views/' + p.replace(/\.html$/,'') + priv.viewExt;
			if(!priv.VIEWS[fileName]) {
				var viewScript = new Script(fileName);
				if(!viewScript.isLoaded()) {
					viewScript.load(function() {
						var file = this.fileName;
						this.script.parentNode.removeChild(this.script);
						pub.view(p);
					});
				}
			}
		}),

		tests: function() {
			pub.queue('TestSuite', priv.ROOT.dir() + 'mvc');
			(eachArg(function(p) {
				var test = p.replace('Test','') + 'Test';
				pub.queue(test, priv.APP_DIR + 'tests');
				priv.TESTS.push(test);
			})).apply(window, arguments);
			pub.queue(function() {
				if(!priv.EXECUTING && !priv.QUEUE.length && window.TestSuite) {
					window.TestSuite(priv.TESTS);
				} else {
					setTimeout(arguments.callee, 1);
				}
			});
			return pub;
		}
	});


	priv.start();
	return pub;

})();