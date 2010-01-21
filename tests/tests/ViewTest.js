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
	test_toElement: function() {
		var view = new View('simple');
		var echo_test = 'test view';
		view.render({ echo: echo_test });

		this.assertEqual($type($(view)), 'element');
		var el = new Element('div');
		el.grab(view);
		this.assertTrue(el.getElement('.simple'));
		
	},
	test_toString: function() {
		var view = new View('simple');
		var echo_test = 'test view';
		var res = view.render({ echo: echo_test });
		
		this.assertEqual(view + '', res);
		var el = new Element('div', { html: view });
		this.assertTrue(el.getElement('.simple'));
	},
	test_subview: function() {
		var view = new View('complex');
		var echo_test = 'complex test view';
		
		var html = view.render({ echo: echo_test });
		this.assertTrue(html);
		
		var el = $(view);
		this.assertTrue(el.hasClass('complex'));
		this.assertTrue(el.getElement('div'));
		this.assertTrue(el.getElement('.test').hasClass('simple'));
		this.assertEqual(el.getElement('.test').get('text').trim(), echo_test);
	}
}, {
	onSetup: function() {
		
	},
	onTeardown: function() {
		
	}
});