var ModelAjaxTest = new TestCase({
	'findAll': function() {
		var that = this;
		this.wait();
		Test.findAll(function(models) {
			that.resume();
			that.assertTrue(models instanceof Array, 'should give an array to callback');
			that.assertTrue(models[0] instanceof Test, 'each item in array should be an instance of model');
		});
	}
}, {
	onSetup: function() {
		window.Test = new Class({
			Extends: Model.Ajax,
			fields: {
				id: Model.Fields.AutoField(),
				title: Model.Fields.TextField(),
				description: Model.Fields.TextField()
			},
			useFixtures: true
		});
	},
	onTeardown: function() {
		delete window.Test;
	}
});