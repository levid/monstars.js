/*
	View.HTML - HTML representation of a Model.
	
	Dependencies: mvc/View.js, core/Class.Occlude.js
*/
View.HTML = new Class({
    
    Extends: View,
	
	Implements: Class.Occlude,
	
	initialize: function(content) {
		if($type(content) == 'element') {
			return this.fromElement(content);
		} else {
			this.parent(content);
		}
			
		return this;
	},
    
    render: function() {
		var template = this.template.substitute(this.content);//this.substitute(this.content);
        this.element = new Element('div',{html: template}).getFirst();
		this.occlude(this.get_class());
		this.parent();
		return this.element;
    },
	
	/*substitute: function(object) {
		var that = this;
		return this.template.replace(/\\?\{([^{}]+)\}/g, function(match, name){
			if (match.charAt(0) == '\\') return match.slice(1);
			return (object[name] != undefined) ?
				(($type(object[name]) == 'object' || $type(object[name]) == 'hash') ? 'ssss' : object[name]) :
				'';
		});
	}.protect(),
	
	subview: function(prop, models) {
		return 'poop';
	}.protect(),*/
	
	fromElement: function(element) {
		var instance = this.occlude(this.get_class(), element) || this;
		this.element = element;
		return instance;
	},
	
	toElement: function() {
		return this.element ?
			this.element :
			this.element = this.render();
	}
});