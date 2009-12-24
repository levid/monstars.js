var DispatchController;
var DispatcherTest = new TestCase({
	test_createControllers: function() {
		//var dispatch = new Dispatcher();
		//dispatch.create_controllers();
		//this.assertTrue($('Dispatch'));
	}
}, {
	onSetup: function() {
		DispatchController = new Class({
			Extends: Controller
		});
		Core.register_controller(DispatchController);
	},
	onTeardown: function() {
		$('Dispatch') && $('Dispatch').dispose();
		DispatchController = null;
		Core.$controllers = [];
	}
});