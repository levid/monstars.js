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
		var instance = this.occlude(this.get_class(), element) || instance;
		return instance;
	},
	
	toElement: function() {
		return this.element ?
			this.element :
			this.element = this.render();
	}
    
});