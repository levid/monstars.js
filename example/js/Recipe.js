var Recipe = new Class({
	
	Extends: Model.Ajax,
	
	data: {
		id: null,
		title: null
	},
	
	save: function(callback) {
		this.parent(callback);
	}
	
});

//TODO: find way to automagically do this?
Recipe.find = function(condition, options, callback) {
    //TODO: replace Model.SQL with Recipe.parent?
    Model.Ajax.find(this,condition,options, callback);
};

Recipe.findAll = function(callback) {
    Model.Ajax.findAll(this, callback);
};