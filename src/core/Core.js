/*
	Core - Ties together core features of the MVC framework.
*/
var monstars = {
	version: '0.6.1'
};

/*
	Overwriting Extends mutator to copy static methods as well.
*/
(function() {
	
var _oldExtends = Class.Mutators.Extends;
Class.Mutators.Extends = function (parent){
	var dont_overwrite = ['$family','$class', 'implement', 'constructor', '$constructor'];
	for(var k in parent) {
		if(parent.hasOwnProperty(k) && dont_overwrite.indexOf(k) == -1)
			this[k] = parent[k];
	}
	
	_oldExtends.call(this, parent);
};

})();