var Recipe = new Class({
	
	Extends: Model.Ajax,
	
	data: {
		id: null,
		title: null
	}
	
});

//TODO: find way to automagically do this?
Recipe.find = function(condition, options, callback) {
    //TODO: replace Model.Ajax with Recipe.parent?
    return Model.Ajax.find(this,condition,options, callback);
};

Recipe.findAll = function(callback) {
    console.log('hijacked this method');
	var list = [];
	list[0] = new Recipe({title: 'Pancakes'});
	list[1] = new Recipe({title: 'Hot Chocolate'});
	
	if($type(callback) == 'function') {
		callback(list);
	}
	//return Model.Ajax.findAll(this, callback);
};