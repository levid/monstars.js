var Controller = new Class({
    
    Implements: [Events, GetClass],
	
	element: null,
    
    initialize: function() {
		var el = this.element || this._controller_prefix();
		if(el == 'Document') el = document.body;
		this.element = $(el) || new Element('div', { id: el}).inject(document.body); // or throw Error?
		this.bindEvents();
    },
	
	bindEvents: function() {
		var events = this.events;
		for(var prop in events) {			
			if(prop != 'load' && $type(events[prop]) == 'function') {
				this.element.addEvent(prop.replace(/^on/,''), events[prop].bind(this), true);
			} else if (prop == 'load') {
				window.addEvent('domready', events[prop].bind(this));
			}
		}
	}.protect(),
	
	grab: function(el, where) {
		this.element.grab(el, where);
	},
	
	_controller_prefix: function() {
		var className = this.get_class();
		return className.replace(/Controller/gi,'');
	}.protect(),
	
	toElement: function() {
		return this.element;
	}
    
});