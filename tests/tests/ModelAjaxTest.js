var ModelAjaxTest = new TestCase({
	'findAll': function() {
		var that = this;
		this.wait();
		AjaxTest.findAll(function(models) {
			that.resume();
			that.assertTrue(models instanceof Array, 'should give an array to callback');
			that.assertTrue(models[0] instanceof AjaxTest, 'each item in array should be an instance of model');
		});
	}
}, {
	onSetup: function() {
		
	},
	onTeardown: function() {

	}
});

var AjaxTest = new Class({
	Extends: Model.Ajax,
	fields: {
		id: Model.Fields.AutoField(),
		title: Model.Fields.TextField(),
		description: Model.Fields.TextField()
	},
	useFixtures: true
});