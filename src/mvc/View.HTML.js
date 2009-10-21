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
        var template = this.template.substitute(this.content);
        this.element = new Element('div',{html: template}).getFirst();
		this.occlude(this.get_class());
		this.parent();
		return this.element;
    },
	
	fromElement: function(element) {
		var instance = this.occlude(this.get_class(), element) || this;
		this.element = element;
		return instance;
	},
	
	toElement: function() {
		return this.element ?
			this.element :
			this.element = this.render();
	},
	
	model: function(model) {
		var $model = this.parent(model);
		if(!$model) {
			var match = this.element.className.match(/\b([a-zA-Z]+)_(\d+)\b/);
			var className = match[1],
				id = match[2];
			
			var klass = window[className.capitalize()];
			if(klass && klass instanceof Model) {
				//$model = klass.get(id);
			}
			
		}
		return $model;
	}
    
});