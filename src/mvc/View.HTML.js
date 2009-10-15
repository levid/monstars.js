View.HTML = new Class({
    
    Extends: View,
    
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