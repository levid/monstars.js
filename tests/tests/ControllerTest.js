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
	}
}, {
	onSetup: function() {
		this.TestController = new Class({
			Extends: Controller,
			$class: 'TestController'
		});
	},
	onTeardown: function() {
		/*var el = $('Test');
		if(el)
			el.dispose();*/
	}
});