(function() {

var sessionInstance,
	localInstance;


var sessionStorage = this.sessionStorage || (function() {
	//use window.name
	var data = window.top.name ? JSON.decode(window.top.name) : {};
	return {
		setItem: function (key, value) {
			data[key] = value+""; // force to string
			window.top.name = JSON.encode(data);
		},
		removeItem: function (key) {
			delete data[key];
			window.top.name = JSON.encode(data);
		},
		getItem: function (key) {
			return data[key] || null;
		},
		key: function(index) {
			
		},
		clear: function () {
			data = {};
			window.top.name = '';
		}
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
				return localInstance ? localInstance : localInstance = this;
			case 'session':
				this.store = sessionStorage;
				return sessionInstance ? sessionInstance : sessionInstance = this;
			default:
				break;
		}
		return this;
	},
	
	getItem: function(key) {
		return this.store.getItem(key);
	},
	
	setItem: function(key, value) {
		if(key == 'key') throw new Error('Key cannot be "key"');
		this.store.setItem(key, JSON.encode(value));
	},
	
	removeItem: function(key) {
		this.store.removeItem(key)
	},
	
	key: function(index) {
		this.store.key(index);
	},
	
	clear: function() {
		this.store.clear();
	}
	
});

}())