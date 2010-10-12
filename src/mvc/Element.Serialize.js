Element.implement('serialize', function() {
	var values ={};
	this.getElements("input, select, textarea",true).each(function(el){
		if(!el.name || el.disabled || el.type=="submit" || el.type=="reset" || el.type=="file") return;
		var n = (el.tagName.toLowerCase() == 'select') ?
			Element.getSelected(el).map(function(o){ return o.value; }) :
			((el.type == 'radio' || el.type == 'checkbox') && !el.checked) ?
				null :
				el.value;
		Array.from(n).each(function(val) {
			if (typeOf(val) != 'undefined') {
				values[el.name] = val;
			}
		});
	});
	return values;
});