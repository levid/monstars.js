Element.implement('serialize', function() {
	var values = new Hash();
	this.getElements("input, select, textarea",true).each(function(el){
		if(!el.name || el.disabled || el.type=="submit" || el.type=="reset" || el.type=="file") return;
		var n = (el.get('tag') == 'select') ?
			Element.getSelected(el).map(function(o){ return o.value; }) :
			((el.type == 'radio' || el.type == 'checkbox') && !el.checked) ?
				null :
				(el.type == 'checkbox' ? el.value : el.value);
		$splat(n).each(function(val) {
			if ($type(val) != 'undefined') {
				values[el.name] = val;
			}
		});
	});
	return values;
});