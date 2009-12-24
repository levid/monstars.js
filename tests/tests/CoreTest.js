var CoreTest = new TestCase({
	test_registerControllers: function() {
		Core.register_controller(this.CoreController);
		var Cs = Core.retrieve_controllers();
		this.assertEquals(this.CoreController, Cs[0]);
	}
}, {
	onSetup: function() {
		this.CoreController = new Class({
			Extends: Controller
		});
	},
	onTeardown: function() {
		delete this.CoreController;
		Core.$controllers = [];
	}
});