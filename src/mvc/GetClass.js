/*
	GetClass - a class to implement into other classes that provides get_class
	function. Returns classname of the instance. Uses Hash.findKey
*/
(function() {
var searched = {}; //to prevent circular lookups
Hash.implement({
    findKey: function(key) {  
        var val = this.keyOf(key);
        if(val && val != 'constructor') return val;
        for(var prop in this) {   
            if(this.hasOwnProperty(prop) && typeof this[prop] == 'object') {
				val = $H(this[prop]).findKey(key);
                if(val) {
					return this.findKey(this[prop]) + '.' + val;
                }
            }
        }
		return '';
    }   
});
})();
var GetClass = new Class({
	get_class: function() {
		return this.$class ?
			this.$class :
			this.$class = $H(window).keyOf(this.constructor);//.findKey(this.constructor);
	}
});

GetClass.get = function(obj) {
	//console.log(obj);
	return $H(window).keyOf(obj);//.findKey(obj);
}