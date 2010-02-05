var ModelAjaxTest = new TestCase({
	'findAll': function() {
		var that = this;
		this.wait();
		Test.findAll(function(models) {
			
			that.assertTrue(models, 'should instantiate all found results');
			that.resume();
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