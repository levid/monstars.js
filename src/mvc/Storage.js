(function() {

var sessionInstance,
	localInstance;

var sessionStorage;
try {
	sessionStorage = this.sessionStorage
} catch(e) {
	//accessing sessionStorage from a local file blows up Firefox
}

sessionStorage = sessionStorage || (function() {
	//use window.name
	var data = window.top.name ? JSON.decode(window.top.name) : {},
		keys = [];
	return {
		setItem: function (key, value) {
			if(!$defined(data[key])) {
				this.length++;
				keys.push(key);
			}
			data[key] = value+""; // force to string
			
			window.top.name = JSON.encode(data);
			
		},
		removeItem: function (key) {
			delete data[key];
			window.top.name = JSON.encode(data);
			this.length--;
		},
		getItem: function (key) {
			return data[key] || null;
		},
		key: function(index) {
			return keys[index];
		},
		clear: function () {
			data = {};
			window.top.name = '';
			this.length = 0;
		},
		length: 0
	}
})();

var localStorage = this.localStorage || (function() {
	//use Cookies
	var data = new Cookie();
	return {
		setItem: function(key, value) {
			
		},
		removeItem: function(key) {
			
		},
		getItem: function(key) {
			
		},
		key: function(index) {
			
		},
		clear: function() {
			
		}
	}
})();


this.Storage = new Class({
	
	initialize: function(type) {
		type = type || 'local';
		switch(type) {
			case 'local':
				this.store = localStorage;
				this.length = this.store.length;
				return localInstance ? localInstance : localInstance = this;
			case 'session':
				this.store = sessionStorage;
				this.length = this.store.length;
				return sessionInstance ? sessionInstance : sessionInstance = this;
			default:
				break;
		}
		return this;
	},
	
	getItem: function(key) {
		return JSON.decode(this.store.getItem(key));
	},
	
	setItem: function(key, value) {
		if(key == 'key') throw new Error('Key cannot be "key"');
		this.store.setItem(key, JSON.encode(value));
		this.length = this.store.length;
		return this;
	},
	
	removeItem: function(key) {
		this.store.removeItem(key);
		this.length = this.store.length;
		return this;
	},
	
	key: function(index) {
		return this.store.key(index);
	},
	
	clear: function() {
		this.store.clear();
		this.length = this.store.length;
		return this;
	}
	
});

}())