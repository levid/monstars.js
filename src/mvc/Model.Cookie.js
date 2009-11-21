/*
	Model.Cookie - Cookie Model to store data in the browser
	Dependencies: mvc/GetClass.js, mvc/Model.js
*/
Model.Cookie = new Class({
   
    Extends: Model,
	
	$class: 'Model.Cookie',
    
    initialize: function(data) {
        this.parent(data);
		this._cookie = new Cookie()
    },
    
    save: function(callback) {
        if(this.data.id) {
		
		} else {
		
		}
        return this;
    },
    
    destroy: function() {
       
        return this;
    },
    
    tableize: function() {
        return this.get_class().toLowerCase() + 's';
    }
    
});
//TODO: consider how new models are supposed to integrate find
Model.Cookie.find = function(condition, options, callback) {
	
	return null;
};

Model.Cookie.findAll = function(type, callback) {
    return this.find(null, null, callback);
};