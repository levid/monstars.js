var configFile = arguments[0];
if(!configFile) {
	print('No path supplied.');
	quit();
}

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
		src += readFile(path) + "\n";
	}
	
	var includeArgs = function(func) {
		return args(function(arg) {
			var file = func(arg);
			include(file);
		});
	};
	
	var compress = function(file) {
		if(com.yahoo.platform.yui.compressor.JavaScriptCompressor) {
			//importClass(com.yahoo.platform.yui.compressor.JavaScriptCompressor);
			var URLClassLoader = Packages.java.net.URLClassLoader;
			var URL = java.net.URL;
			
			var yuiC = new java.io.File("bin\yui-compressor-2.4.2.jar");
			var yuiC_url = yuiC.toURL();
			var urls = java.lang.reflect.Array.newInstance(URL,1);
			urls[0] = new URL(yuiC_url);
			var loader = new URLClassLoader(urls);

			var JavaScriptCompressor = loader.loadClass("com.yahoo.platform.yui.compressor.JavaScriptCompressor")
			
			print('compressor');
			var reader = new java.io.InputStreamReader(new java.io.FileInputStream(file.fileName),'UTF-8');
			var compressor = new JavaScriptCompressor(reader, new org.mozilla.javascript.ErrorReporter({
				warning: function() {
					
				},
				error: function() {
					
				},
				runtimeError: function() {
					
				}
			}));
			var out = file.dir() + 'compressed.js',
				munge = true,
				verbose = false,
				preserveAllSemiColons = true,
				disableOptimization = false;
			
			
			comopressor.compress(out, 4096, munge, verbose,
                            preserveAllSemiColons, disableOptimizations);
		}
	};
	
	var pub = {
		start: function(path) {
			var config = new File(path);
			app_dir = config.dir();
			config.load();
			
			var packed = new File(config.dir() +'packed.js');
			packed.write(src);
			//compress(packed);
			//print(src);
			print('Files packed into: '+packed.fileName);
		},
		core: function() {
			(includeArgs(function(p) {
				return 'src/core/'+p+'.js';
			}))('mootools-1.2.4-core-nc','mootools-1.2.4.2-more-nc','Core');
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
		models: includeArgs(function(p) { return app_dir + 'models/'+p+'.js' }),
		controllers: includeArgs(function(p) { return app_dir + 'controllers/'+p+'Controller.js' }),
		views: function() {}
	}
	return pub;
})();

init.start(configFile);