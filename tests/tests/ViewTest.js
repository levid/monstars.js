var ViewTest = new TestCase({
	'instantiation': function() {
		var view = new View('simple');
		this.assertTrue(view instanceof View, 'should return an instance of View');
		this.assertTrue(view.template instanceof Function, 'should retrieve a template and process it');
	},
	'render': function() {
		var view = new View('simple');
		
		var echo_test = 'test view';
		
		var html = view.render({ echo: echo_test });
		this.assertTrue(html, 'should return a value');
		
		var el = new Element('div', { html: html }).getFirst();
		this.assertTrue(el.hasClass('simple'), 'the element should have the class from the template file');
		this.assertEqual(el.get('text').trim(), echo_test, 'the values passed to render should be used in the template');
	},
	'toElement': function() {
		var view = new View('simple');
		var echo_test = 'test view';
		view.render({ echo: echo_test });

		this.assertEqual($type($(view)), 'element', 'should return an element');
		var el = new Element('div');
		el.grab(view);
		this.assertTrue(el.getElement('.simple'), 'view instance can be used in element methods like grab, replaces, etc');
		
	},
	'toString': function() {
		var view = new View('simple');
		var echo_test = 'test view';
		var res = view.render({ echo: echo_test });
		
		this.assertEqual(view + '', res, 'render by default will return the String version of the template');
		var el = new Element('div', { html: view });
		this.assertTrue(el.getElement('.simple'), 'text version should use html from template file');
		this.assertEqual(el.get('text').trim(), echo_test, 'should use values passed to render');
	},
	'subview': function() {
		var view = new View('complex');
		var echo_test = 'complex test view';
		
		var html = view.render({ echo: echo_test });
		this.assertTrue(html, 'should return a string');
		
		var el = $(view);
		this.assertTrue(el.hasClass('complex'), 'should use template markup');
		this.assertTrue(el.getElement('div'), 'should have markup from subview');
		this.assertTrue(el.getElement('.test').hasClass('simple'), 'should use classnames from subview');
		this.assertEqual(el.getElement('.test').get('text').trim(), echo_test, 'should use data in subview');
	}
}, {
	onSetup: function() {
		
	},
	onTeardown: function() {
		
	}
});