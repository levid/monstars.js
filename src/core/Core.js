/*
	Core - Ties together core features of the MVC framework.
*/
var Core = {
	
	version: '0.5.2',
	
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
	var dont_overwrite = ['$family', 'implement', 'constructor'];
	for(var k in parent) {
		if(parent.hasOwnProperty(k) && dont_overwrite.indexOf(k) == -1)
			this[k] = parent[k];
	}
	
	_oldExtends.call(this, parent);
};

})();

/*
	These properties on Mutators blow up class if you try to define a method
	on your class with the same name.
	
	Specifically, toString was gotcha'ing me.
	
	--Except, IE will never let me use this in a for..in block. Gaaaah!

	--Can remove as soon as MooTools 1.3 is stable enough, because it provides a fix
		in Class.js
*/
['toString', 'toLocaleString', 'valueOf', 'toSource', 'watch', 'unwatch', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable'].each(function(method){
	Class.Mutators[method] = $arguments(0);
});