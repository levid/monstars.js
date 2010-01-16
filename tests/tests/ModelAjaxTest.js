var ModelAjaxTest = new TestCase({
	test_findAll: function() {
		//Test.findAll(function(models) {
		//	console.log(models);
		//});
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