(function() {
	
var sessionStorage, localStorage;
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
			if(data[key] == null) {
				this.length++;
				keys.push(key);
			}
			data[key] = value+""; // force to string
			
			window.top.name = JSON.encode(data);
			
		},
		removeItem: function (key) {
			delete data[key];
			//todo - remove from keys[]
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

try {
	localStorage = this.localStorage;
} catch(e) {
	//accessing localStorage might blow up Chrome?
}

localStorage = localStorage || (function() {
	//use Cookies
	try {
		document.cookie;
	} catch(e) {
		//DOM Exception 18?
		return {};
	}
	
	
	var store = new Cookie('store'),
		data = JSON.decode(store.read()),
		keys = [];
	return {
		setItem: function(key, value) {
			if(data[key] == null) {
				this.length++;
				keys.push(key);
			}
			data[key] = value;
			store.write(JSON.encode(data));
		},
		removeItem: function(key) {
			delete data[key];
			this.length--;
			store.write(JSON.encode(data));
		},
		getItem: function(key) {
			return data[key] || null;
		},
		key: function(index) {
			return keys[index];
		},
		clear: function() {
			data = {};
			keys = [];
			store.dispose();
			this.length = 0;
		}
	}
})();

var userData = Browser.ie && (function() {
	var driver = new Element('span'),
		PATH = 'mvc_storage_data',
		NAME = 'data',
		data = {},
		keys = [];
		
	driver.addBehavior('#default#userData');
	
	window.addEvent('domready', function() {
		driver.inject(document.body);
		driver.load(PATH);
		try {
			data = JSON.decode(driver.getAttribute(NAME)) || {};
		} catch(ex) {
			data = {};
		}
	});
	
	var _save = function() {
		try {
			driver.setAttribute(NAME, JSON.encode(data));
			driver.save(PATH);
		} catch(ex) {
			//storage full error
		}
	}
	
	return {
		setItem: function(key, value) {
			if(data[key] == null) {
				this.length++;
				keys.push(key);
			}
			data[key] = value;
			_save();
		},
		removeItem: function(key) {
			delete data[key];
			this.length--;
			_save();
		},
		getItem: function(key) {
			return data[key];
		},
		key: function(index) {
			return keys[index];
		},
		clear: function() {
			data = {};
			this.length = 0;
			keys = [];
			_save();
		}
	}
})();


var instances = {};

this.Store = new Class({
	
	initialize: function(type) {
		type = type || 'local';
		if(Browser.ie/* && Browser.Engine.version <= 5*/) {
			type = 'userData';
		}
		switch(type) {
			case 'userData':
				this.store = userData;
				break;
			case 'session':
				this.store = sessionStorage;
				break;
			case 'local':
				//falls through
			default:
				this.store = localStorage;
				break;
		}
		return instances[type] ? instances[type] : instances[type] = this;
	},
	
	getItem: function(key) {
		return JSON.decode(this.store.getItem(key));
	},
	
	setItem: function(key, value) {
		if(key == 'key') throw new Error('Key cannot be "key"');
		this.store.setItem(key, JSON.encode(value));
		return this;
	},
	
	removeItem: function(key) {
		this.store.removeItem(key);
		return this;
	},
	
	key: function(index) {
		return this.store.key(index);
	},
	
	clear: function() {
		this.store.clear();
		return this;
	},
	
	length: function() {
		return this.store.length;
	}
	
});

}())