var ViewHTMLTest = new TestCase({
	test_simple_render: function() {
		var m = new this.TestModel({id:1, title: 'Moo Rules'});
		var v = new this.SimpleView(m);
		var el = v.render();
		this.assertTrue(el.hasClass('view_1'));
		this.assertEquals(el.get('text'), 'Moo Rules');
	},
	test_fromElement: function() {
		var m = new this.TestModel({id:1, title: 'Moo Rules'});
		var v = new this.SimpleView(m);
		var el = v.render();
		
		var w = new this.SimpleView(el);
		var wEl = $(w);
		this.assertEquals(el, wEl);
	},
	test_subview_with_array: function() {
		var v1 = new this.ComplexView({contents: ['Monstars', 1, 'Monkeys']});
		this.assertEquals($(v1).get('text'), 'Monstars, 1, Monkeys');
	},
	
	test_subview_with_object: function() {
		var v1 = new this.ComplexView({contents: { 'title': 'Moo' } });
		this.assertEquals($(v1).get('text'), '')
	},
	
	test_subview_with_models: function() {
		var m1 = new this.TestModel({id:1, title: 'Rawr!'}),
			m2 = new this.TestModel({id:2, title: 'Moo!'});
			
		var v1 = new this.ComplexView({contents: m1});
		this.assertEquals($(v1).get('html'), '<div class="text-view view_1">Rawr!</div>');
		
		var v2 = new this.ComplexView({contents: [m1, m2]});
		this.assertEquals($(v2).get('html'), '<div class="text-view view_1">Rawr!</div><div class="text-view view_2">Moo!</div>');
	}
}, {
	onSetup: function() {
		this.TestModel = new Class({
			Extends:Model,
			data: {id: null, title: null }
		});
		this.SimpleView = new Class({
			Extends:View.HTML,
			template: '<div class="test-view view_{id}">{title}</div>'
		});
		this.ComplexView = new Class({
			Extends:View.HTML,
			template: '<div class="test-view complex">{contents}</div>',
			TestModel: SimpleView
		});
	},
	onTeardown: function() {
		delete this.TestModel;
		delete this.SimpleView;
		delete this.ComplexView;
		$$('.test-view').dispose();
	}
});