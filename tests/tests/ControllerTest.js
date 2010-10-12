var ControllerTest = new TestCase({
	'instantiation': function() {
		var tc = new this.TestController();
		this.assertTrue($('Test'), 'should create an element from controller name');
		var tc2 = new this.TestController();
		this.assertEqual(tc, tc2, 'should always return the same instance');
	},
	'el.get("controller")': function() {
		var tc = new this.TestController();
		this.assertEqual($('Test').get('controller'), tc, 'should retrieve the singleton instance');
	},
	'view(view_name, data)': function() {
		var tc = new this.TestController();
		var view = tc.testViewWithName('test/simple', { echo: 'hello' });
		this.assertTrue(view instanceof View, 'should return a View instance');
		this.assertEqual(view.name, 'test/simple', 'should be the View requested');
		this.assertEqual($(view).get('text').trim(), 'hello', 'should have been passed the correct data');
	},
	'view() with no view_name': function() {
		var tc = new this.TestController();
		var view = tc.testView({ echo: 'hello' });
		this.assertEqual(view.name, 'test/testView', 'should have auto-guessed the name by controller/method');
	}
}, {
	onSetup: function() {
		this.TestController = new Class({
			Extends: Controller,
			$class: 'TestController',
			testViewWithName: function(name, data) {
				return this.view(name, data);
			},
			testView: function(data) {
				return this.view(data);
			}
		});
	},
	onTeardown: function() {
		/*var el = $('Test');
		if(el)
			el.dispose();*/
	}
});