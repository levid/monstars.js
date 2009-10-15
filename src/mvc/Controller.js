var Controller = new Class({
    
    Implements: [Events, GetClass],
	
	element: null,
    
    initialize: function() {
		var el = this.element || this._controller_prefix();
		this.element = $(el) || document.body; // or throw Error?
		this.bindEvents();
    },
	
	bindEvents: function() {
		for(var prop in this) {			
			if($type(this[prop]) == 'function' && prop.substring(0,2) == 'on') {
				console.log('binding %s', prop);
				this.element.addEvent(prop.substring(2), this[prop].bind(this), true);
			}
		}
	}.protect(),
	
	grab: function(el, where) {
		this.element.grab(el, where);
	},
	
	_controller_prefix: function() {
		var className = this.get_class();
		return className.replace(/Controller/gi,'');
	}.protect()
    
});