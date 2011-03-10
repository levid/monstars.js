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
		this.assertEqual(view, html, 'should return the instance');
		html = html.output;
		
		var el = new Element('div', { html: html }).getFirst();
		this.assertTrue(el.hasClass('simple'), 'the element should have the class from the template file');
		this.assertEqual(el.get('text').trim(), echo_test, 'the values passed to render should be used in the template');
	},
	'render : operator': function() {
		var view = new View('complex');
		
		var html = view.render({ echo: 'd', escape: '<script type="javascript">alert("woops")</script>' });
		
		this.assertEqual($(view).getElement('span').getChildren().length, 0, 'should escape the html so its just a text node');
	},
	'render ? operator ': function() {
		var view = new View('suppress');
		
		var html = view.render({ echo: 'hello' });
		
		this.assertTrue($(view), 'should not error if variable is not defined')
		this.assertEqual($(view).get('text').trim(), 'hello', 'should print variables that are defined');
	},
	'to Element': function() {
		var view = new View('simple');
		var echo_test = 'test view';
		view.render({ echo: echo_test });

		this.assertEqual(typeOf($(view)), 'element', 'should return an element');
		var el = new Element('div');
		el.grab(view);
		this.assertTrue(el.getElement('.simple'), 'view instance can be used in element methods like grab, replaces, etc');
		
		el.grab(view);
		this.assertEqual(el.getElements('.simple').length, 2, 'should return a new element each time.');
		
	},
	'to String': function() {
		var view = new View('simple');
		var echo_test = 'test view';
		var res = view.render({ echo: echo_test });

		var el = new Element('div', { html: view });
		this.assertTrue(el.getElement('.simple'), 'text version should use html from template file');
		this.assertEqual(el.get('text').trim(), echo_test, 'should use values passed to render');
	},
	'subview': function() {
		var view = new View('complex');
		var echo_test = 'complex test view';
		
		var html = view.render({ echo: echo_test, escape: '' });
		this.assertTrue(html, 'should return a string');
		
		var el = $(view);
		this.assertTrue(el.hasClass('complex'), 'should use template markup');
		this.assertTrue(el.getElement('div'), 'should have markup from subview');
		this.assertTrue(el.getElement('.test').hasClass('simple'), 'should use classnames from subview');
		this.assertEqual(el.getElement('.test').get('text').trim(), echo_test, 'should use data in subview');
	}/*,
	'bind model properties': function() {
		var BindModel = new Class({
			Extends: Model,
			fields: {
				title: Model.Fields.TextField(),
				num: Model.Fields.NumberField()
			}
		});
		
		var view = new View('bind'),
			model = new BindModel({ title: 'Example', num: 5 });
		
		view.render({ model: model, attr: 'num', content: 'title' });
		
		var el = $(view);
		this.assertTrue(el.hasClass(model.get('num')), 'should insert the current value into attributes on toElement');
		this.assertEqual(el.get('text').trim(), el.get('title').trim(), 'should insert the current value into attributes on toElement');
	}*/
}, {
	onSetup: function() {
		
	},
	onTeardown: function() {
		
	}
});