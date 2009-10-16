/*
	Model. - Models
	Dependencies: monstar/GetClass.js
*/
var Model = new Class({
    
    Implements: [GetClass],
    
    data: {},
    
    initialize: function(data) {
        if(data && ($type(data) == 'object' || $type(data) == 'hash' )){
            for(var prop in this.data) {
                if(data.hasOwnProperty(prop) && data[prop]) {
                    this.data[prop] = data[prop];
                }
            }
        }
        
    },
    
    set: function(prop, value) {
    	this.data[prop] = value;
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