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
	},
	onTeardown: function() {
		delete this.TestModel;
		delete this.SimpleView;
		$$('.test-view').dispose();
	}
});