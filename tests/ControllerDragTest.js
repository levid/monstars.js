// well crap, how am i supposed to write Tests for interaction?

var ControllerDragTest = new TestCase({
	
	test_onStart: function() {
		
	}
	
}, {
	onSetup: function() {
		this.DraggyController = new Class({
			Extends: Controller.Drag,
			$class: 'DraggyController'
		});
	},
	onTeardown: function() {
		delete this.DraggyController;
	}
});