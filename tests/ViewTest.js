var ViewTest = new TestCase({
	test_noContent: function() {
		var v = new this.TV();
		this.assertFalse(v.content);
	},
	test_update: function() {
		var v = new this.TV();
		v.update({not_model: 'woot'});
		this.assertEquals(v.content.not_model, 'woot');
	},
	test_model: function() {
		
		
		var m = new this.TM({id: 3, title:'Test Model'});
		var v = new this.TV(m);
		this.assertEquals(m.data, v.content);
		
	}
}, {
	onSetup: function() {
		this.TM = new Class({
			Extends: Model,
			data: { id:null, title:null }
		});
		this.TV = new Class({
			Extends: View
		});
	},
	onTeardown: function() {
		delete this.TM;
		delete this.TV;
	}
});