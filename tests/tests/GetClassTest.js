var GetClassTest = new TestCase({
	test_mixin: function() {
		this.assertEqual(this.get_class(), 'TestCase');
	},
	test_static_getName: function() {
		this.assertEqual(GetClass.getName(Model), 'Model');
		this.assertEqual(GetClass.getName(Controller), 'Controller');
		
	},
	test_static_getClass: function() {
		this.assertEqual(GetClass.get_class(this), 'TestCase');
	},
	test_in_namespaces: function() {
		this.assertEqual(GetClass.getName(Model.Ajax), 'Model.Ajax');
	},
	test_in_closures: function() {
		var Closed = { $name: 'Closed' };
		this.assertEqual(GetClass.getName(Closed), 'Closed');
	}
});