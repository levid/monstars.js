/*
	GetClass - a class to implement into other classes that provides get_class
	function. Returns classname of the instance. Uses Hash.findKey
*/
var GetClass = new Class({
	get_class: function() {
		return $H(window).keyOf(this.constructor);
	}
});
GetClass.get = function(obj) {
	return $H(window).keyOf(obj);
}