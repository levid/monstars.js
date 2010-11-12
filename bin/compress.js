var configFile = arguments[0];
if(!configFile) {
	print('No path supplied.');
	quit();
}

load('bin/mootools-1.2.4-core-server.js');
//load src/mvc/View so we can compile templates
load('src/mvc/View.js');

var init = (function() {
	
	function File(path) {
		this.fileName = path;
	};
	File.prototype = {
		write: function(text, encoding) {
			var fout = new java.io.FileOutputStream(new java.io.File(this.fileName));
			var out = new java.io.OutputStreamWriter(fout, "UTF-8");
			var s = new java.lang.String(src || "");	  
			var encoded = new java.lang.String((s).getBytes(), encoding || "UTF-8");
			out.write(encoded, 0, encoded.length());
			out.flush();
			out.close();
		},
		dir: function() {
			return this.fileName.replace(/[^\/\\]+$/, '');
		},
		load: function() {
			load(this.fileName);
		}
	}
	
	
	var	src = '',
		app_dir = '';
	
	
	var args = function(func) {
		return function() {
			for (var i = 0; i < arguments.length; i++) {
				func(arguments[i]);
			}
		};
	};
	
	var include = function(path) {
		//include
		writeSrc(readFile(path));
	};
	
	var writeSrc = function(text) {
		src += text + "\n"
	};
	
	var includeArgs = function(func) {
		return args(function(arg) {
			var file = func(arg);
			include(file);
		});
	};
	
	var compress = function(file) {
		//can't use YUICompressor with Rhino
		print('Compress can\'t be done with YUI. It conflicts with Rhino');
		quit();
	};
	
	var pub = {
		start: function(path) {
			var config = new File(path);
			app_dir = config.dir();
			config.load();
			
			var packed = new File(config.dir() +'packed.js');
			packed.write(src);
			//compress(packed);
			print('Files packed into: '+packed.fileName);
		},
		core: function() {
			(includeArgs(function(p) {
				return 'src/core/'+p+'.js';
			}))('mootools-1.3-core-nc','mootools-1.3.0.1-more-nc','Core');
		},
		mvc: function() {
			(includeArgs(function(p) {
				return 'src/mvc/'+p+'.js';
			})).apply(global, ['GetClass','Element.Serialize','Model','Model.Fields','Controller','View'].concat(Array.prototype.slice.apply(arguments)));
		},
		app: function(func) {
			if(typeof func == 'function') func();
			include('src/mvc/Dispatcher.js');
		},
		lib: includeArgs(function(p) { return app_dir + 'lib/'+p+'.js' }),
		models: includeArgs(function(p) { return app_dir + 'models/'+p+'.js' }),
		controllers: includeArgs(function(p) { return app_dir + 'controllers/'+p+'Controller.js' }),
		view: function(p) {
			print('getting: ' + p);
			return readFile(app_dir + 'views/'+p+'.html');			
		},
		views: args(function(p) {
			//TODO -
			//process viewSrc into new Function()
			//write new Function().toString() to src.
			print('init.view('+p+')');
			var v = new View(p);
			print(v);
			view = {
				'path': p,
				'function': v.template.toString()
			};
			writeSrc("View.$cache['{path}'] = {function}; \n".substitute(view));
		})
	}
	return pub;
})();

init.start(configFile);