/*
	Model. - Model, and Model.Fields
	Dependencies: monstar/GetClass.js
*/
var Model = new Class({
    
    Implements: [GetClass],
    
    $data: {}, //private object to hold data
	
	fields: {}, //declares the types and other options of what can be in $data
    
    initialize: function(data) {
        this.set(data);        
    },

    set: function(prop, value) {
		if(prop) {
			if(typeof value !== 'undefined') {
				var key = prop;
				prop = {};
				prop[key] = value;
			}
			this._set(prop);
		}
    },
	
	_set: function(obj) {
		for(var key in this.fields) {
			if(obj.hasOwnProperty(key) && obj[key]) {
				this.$data[key] = this.fields[key].screen($unlink(obj[key]));
			}
		}
	},
    
    get: function(prop) {
    	return this.$data[prop];
    },
	
	identity: function() {
		return this.get_class().replace(/\./g, '_') + '_' + this.get('id');
	},
    
    save: function() {
        throw { message: this.get_class() + ' has not implemented save'};
    },
    
    destroy: function() {
        throw { message: this.get_class() + ' has not implemented destroy'};
    }
    
});

Model.get = function() {
	throw { message: GetClass.get(this) + ' has not implemented get'};
}

Model.find = function() {
    throw { message: GetClass.get(this) + ' has not implemented find'};
};

Model.findAll = function() {
    throw { message: GetClass.get(this) + ' has not implemented findAll'};
};

Element.implement('model', function() {
	var places_to_check = '',
		id = this.get('id');
	if(id) {
		places_to_check += id + ' ';
	}
	places_to_check += this.className;
	
	var reg = RegExp('([a-zA-Z_]+?)_([^\\s]+)', 'g'),
		match;
		
	while(match = reg.exec(places_to_check)) {
		var klass = window[match[1].replace('_', '.')];
		if(klass) {
			return klass;
		}
	}	
});