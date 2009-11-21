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
			var ev = prop.replace(/^on/,'');
			if(prop != 'load' && $type(events[prop]) == 'function') {
				this.element.addEvent(ev, events[prop].bind(this), true);
			} else if (prop == 'load') {
				window.addEvent('domready', events[prop].bind(this));
			}
		}
	}.protect(),
	
	_controller_prefix: function() {
		return this.get_class().replace(/Controller/gi,'');
	}.protect(),
	
	toElement: function() {
		return this.element;
	}
    
});