var GetClassTest = new TestCase({
	'using Implement': function() {
		this.assertEqual(this.get_class(), 'TestCase', 'an instance that implements GetClass should return the name of the Class');
	},
	'getName on Class objects': function() {
		this.assertEqual(GetClass.getName(Model), 'Model', 'should return the name of the object');
		this.assertEqual(GetClass.getName(Controller), 'Controller', 'should return the name of the object');
		
	},
	'get_class from a generic call': function() {
		this.assertEqual(GetClass.get_class(this), 'TestCase', 'should behave like using the Mixin');
	},
	test_in_namespaces: function() {
		this.assertEqual(GetClass.getName(Model.Ajax), 'Model.Ajax');
	},
	'object can have a $name or $class manually set': function() {
		var Closed = { $name: 'Closed' };
		this.assertEqual(GetClass.getName(Closed), 'Closed', 'getName should check $name property before searching');
	}
});