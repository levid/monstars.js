var ControllerTest = new TestCase({
	'instantiation': function() {
		var tc = new this.TestController();
		this.assertTrue($('Test'), 'should create an element from controller name');
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