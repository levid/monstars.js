/*
	Model.Browser - Model to store data in the browser, using localStorage,
	sessionStorage, and Cookies.
	requires: mvc/GetClass, mvc/Model, mvc/Storage
*/
(function() {

var Store = new Storage();

Model.Browser = new Class({
   
    Extends: Model,
    
    initialize: function(data) {
        this.parent(data);
		
    },
    
    save: function(callback) {
        var modelStore = this.getTable();
		if(!this.$data.id) {
			//TODO - generate an ID
			var ids = Hash.getKeys(modelStore);
			if(ids.length) {
				ids.sort(function(a, b) {
					return a < b ? 1 : a > b ? -1 : 0;
				});
				this.$data.id = parseInt(ids[0], 10) + 1; //should be highest used ID + 1
			} else {
				this.$data.id = 1;
			}			
		}
		modelStore[this.$data.id] = this.$data;
		Store.setItem(this.tableize(), modelStore);
		callback(this);
        return this;
    },
    
    destroy: function(callback) {
		var modelStore = this.getTable();
		delete modelStore[this.$data.id];
		Store.setItem(this.tableize(), modelStore);
		callback(this);
        return this;
    },
	
	getTable: function() {
		return Store.getItem(this.tableize()) || {};
	}.protect(),
    
    tableize: function() {
        return this.get_class().toLowerCase() + 's';
    }
    
});

var get_table = function() {
	return Store.getItem(GetClass.get(this).toLowerCase()+'s') || {};
};

Model.Browser.get = function(id, callback) {
	var models = get_table.call(this);
	callback(models[id] && this.wrap(models[id])[0]);//new this(models[id])
	return this;
};

Model.Browser.find = function(conditions, options, callback) {
	callback = callback || options;
	conditions = conditions || {};
	options = options || {};
	
	var models = get_table.call(this);
	
	var match = [];
	//compare with condition
	$each(models, function(model, id) {
		var matches = true;
		for(var k in conditions) {
			if(conditions.hasOwnProperty(k)) {
				if(model[k] != conditions[k]) {
					matches = false;
					break;
				}
			}
		}
		if(matches) {
			match.push(model);//new this(model)
		}
	}, this);
	//order by, limit
	if(options.limit) {
		match = match.length > options.limit ? match.slice(0, options.limit + 1) : match;
	}
	//callback
	callback(this.wrap(match));
	return this;
};

Model.Browser.findAll = function(callback) {
    return this.find(null, null, callback);
};

})();