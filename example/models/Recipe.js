var Recipe = new Class({
	
	Extends: Model.Ajax,
	
	data: {
		id: null,
		title: null
	}
	
});

Recipe.$urls = {
	'controller_name':'recipes',
	'update': 'save',
	'insert': 'new',
	'find': 'all',
	'delete': 'kill'
};

//TODO: find way to automagically do this?
//Recipe.get = Model.Ajax.get;
//Recipe.find = Model.Ajax.find;
Recipe.extend(Model.Ajax)
//$extend(Recipe, );
Recipe.findAll = function(callback) {
    console.log('hijacked Recipe.findAll');
	var list = [];
	list[0] = new Recipe({id:1, title: 'Pancakes' });
	list[1] = new Recipe({id:2, title: 'Hot Chocolate'});
	
	if($type(callback) == 'function') {
		callback(list);
	}
};
//Recipe.findAll = Model.Ajax.findAll;