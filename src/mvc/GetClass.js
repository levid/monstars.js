/*
	GetClass - a class to implement into other classes that provides get_class
	function. Returns classname of the instance. Uses Hash.findKey
*/
// [object Object].get_class() == 'Model.Ajax'
/*Hash.implement({
	findKey: function(key) {  
        if(key === null || typeof key == 'undefined') return null;
		var val = this.keyOf(key);
        if(val && val != 'constructor') return val;
        for(var prop in this) {   
            if(this.hasOwnProperty(prop) && typeof this[prop] == 'object') {
				if($type(this[prop]) == 'window' || $type(this[prop]) == 'element' || $type(this[prop]) == 'document') continue; // HACK: prevents window.top circular loop, but no others.
				console.log('this: %o, prop: %o',this, prop);
				//alert(this+ ' ' + prop);
				
				val = $H(this[prop]).findKey(key);
                if(val) {
					return this.findKey(prop) + '.' + val;
                }
            }
        }
		return '';
    }   
});*/

var GetClass = new Class({
	get_class: function() {
		return this.$class ?
			this.$class :
			this.$class = GetClass.get_class(this);
	}
});

GetClass.get = (function() {
	var search = function(obj, keys) {
		context = keys || window;
		for(var key in context) {
			try {			
				if(window[key] === obj) return key
			} catch(e) { /*sessionStore*/ }
		}
		return null;
	}
	
	var keyOf = (Browser.ie) ? (function() {
		var xhr = function(path) {
			var request = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
			request.open('GET', path, false); //asynchronous = false
			try {
				request.send();
			} catch(e) { return null; }
			if ( request.status == 500 || request.status == 404 || request.status == 2 ||(request.status == 0 && request.responseText == '') ) return null;
			return request.responseText;
		}
		
		var cash = {};
		
		var ie_search = function(obj) {
			var key = search(obj) || search(obj, cash);
			if(!key) {
				//IE doesn't enumerate `var a = 'x';`, so we need to explicitly
				//declare those vars on the window object
				// credit: http://www.thomasfrank.se/downloadableJS/globalVars.js
				var scripts = document.scripts,
					src = '';
					
				for(var s = 0, len = scripts.length; s < len; s++) {
					if(!scripts[s]._lookedUp) {
						if(scripts[s].innerHTML) {
							src += scripts[s].innerHTML;
						} else if (scripts[s].src) {
							src += xhr(scripts[s].src);				
						}
						scripts[s]._lookedUp = true;
					}
				}
				var idents = src.replace(/\W/g, ' ').replace(/(function|if|for|while|true|false|null|typeof|var|new|try|catch|return|prototype|this)/g, '').split(' ');
				
				for(var i = 0; i < idents.length; i++) {
					var iden = idents[i].trim();
					cash[iden] = true;
					if(!key && (iden in window) && window[iden] == obj) {
						
						key = idents[i];
						//break;
					}
				}
			}
			return key;
		}
		
		
		return ie_search;
	})() : search;

	return keyOf;
})();

GetClass.getName = function(obj) {
	return obj.$name ?
		obj.$name :
		obj.$name = obj.prototype.$class || GetClass.get(obj)
};
GetClass.get_class = function(obj) {
	return obj.$class ?
		obj.$class :
		obj.$class = (obj.$constructor && GetClass.get(obj.$constructor));
}