/*
	Model. - Models
	Dependencies: monstar/GetClass.js
*/
var Model = new Class({
    
    Implements: [GetClass],
    
    data: {},
    
    initialize: function(data) {
        this.set(data);        
    },
	
	
    
    set: function(prop, value) {
    	if(prop && ($type(prop) == 'object' || $type(prop) == 'hash')) {
			for(var key in this.data) {
                if(prop.hasOwnProperty(key) && prop[key]) {
                    this.data[key] = prop[key];
                }
            }
		} else {
			this.data[prop] = value;
		}	
    },
    
    get: function(prop) {
    	return this.data[prop];
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