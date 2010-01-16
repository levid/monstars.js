var ViewTest = new TestCase({
	test_new_View: function() {
		var view = new View('simple');
		this.assertTrue(view instanceof View);
		this.assertTrue(view.template.length);
	},
	test_render: function() {
		var view = new View('simple');
		
		var echo_test = 'test view';
		
		var html = view.render({ echo: echo_test });
		this.assertTrue(html);
		
		var el = new Element('div', { html: html }).getFirst();
		this.assertTrue(el.hasClass('simple'));
		this.assertEqual(el.get('text').trim(), echo_test);
	},
	test_subview: function() {
		
	}
}, {
	onSetup: function() {
		
	},
	onTeardown: function() {
		
	}
});