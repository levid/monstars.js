/*
	Core - Ties together core features of the MVC framework.
*/
var Core = {
	
	version: '0.6.0',
	
	$controllers: [],
	
	register_controller: function(controller) {
		if(this.$controllers.indexOf(controller) == -1)
			this.$controllers.push(controller);
	},
	
	retrieve_controllers: function() {
		return this.$controllers;
	},
	
	reset_controllers: function() {
		this.$controllers = [];
	}
	
};

/*
	Overwriting Extends mutator to copy static methods as well.
*/
(function() {
var _oldExtends = Class.Mutators.Extends;
Class.Mutators.Extends = function (parent){
	var dont_overwrite = ['$family','$class', 'implement', 'constructor'];
	for(var k in parent) {
		if(parent.hasOwnProperty(k) && dont_overwrite.indexOf(k) == -1)
			this[k] = parent[k];
	}
	
	_oldExtends.call(this, parent);
};

})();