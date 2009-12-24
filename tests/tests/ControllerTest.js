var ControllerTest = new TestCase({
	test_init: function() {
		var tc = new this.TestController();
		this.assertTrue($('Test'));
	},
	test_events: function() {
		
	}
}, {
	onSetup: function() {
		this.TestController = new Class({
			Extends: Controller,
			$class: 'TestController'
		});
	},
	onTeardown: function() {
		var el = $('Test');
		if(el)
			el.dispose();
	}
});