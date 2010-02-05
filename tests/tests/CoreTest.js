var CoreTest = new TestCase({
	'register_controllers': function() {
		Core.register_controller(this.CoreController);
		var Cs = Core.retrieve_controllers();
		this.assertEqual(this.CoreController, Cs[0], 'should keep track of controller');
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