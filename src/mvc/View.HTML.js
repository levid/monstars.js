/*
	View.HTML - HTML representation of a Model.
	
	Dependencies: mvc/View.js
*/
View.HTML = new Class({
    
    Extends: View,
	
	Implements: Class.Occlude,
	
	initialize: function(content) {
		if($type(content) == 'element') {
			this.element = content;
			if(this.occlude('View.HTML', this.element))
				return this.occluded;
		} else {
			this.parent(content);
			this.element = this.render();
			if(this.occlude('View.HTML', this.element))
				return this.occluded;
		}		
			
		return this;
	},
    
    render: function() {
        var template = this.template.substitute(this.content);
        this.element = new Element('div',{html: template}).getFirst();		
		this.parent();
		return this.element;
    },
	
	toElement: function() {
		return this.element ?
			this.element :
			this.element = this.render();
	}
    
});