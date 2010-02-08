var ElementSerializeTest = new TestCase({
	'text inputs': function() {
		var form = new Element('form', { html: '<fieldset><input type="text" name="first_name" value="Sean" /><input type="text" name="last_name" value="McArthur" /><input type="text" name="title" /></fieldset>' });
		
		var data = form.serialize();
		this.assertEqual(data.first_name, 'Sean');
		this.assertEqual(data.last_name, 'McArthur');
		this.assertFalse(data.title, 'should not have any property not found in the form');
	},
	'checkboxes': function() {
		var form = new Element('form', { html: '\
			<fieldset>\
				<input type="checkbox" name="topic[]" checked="checked" value="Javascript" />\
				<input type="checkbox" name="topic[]" value="PHP" />\
			</fieldset>\
			<fieldset>\
				<input type="checkbox" name="candy[]" checked="checked"  value="Twix" />\
				<input type="checkbox" name="candy[]" checked="checked"  value="Snickers" />\
			</fieldset>\
			<fieldset>\
				<input type="checkbox" name="sleepy" value="true" checked="checked" />\
			</fieldset>\
		'});
		
		var data = form.serialize();
		
		this.assertEqual(data.topic, 'Javascript', 'array-like name with only 1 value should not be array');
		this.assertTrue(data.sleepy, 'without array-like name');
		this.assertEqual(data.candy, ['Twix', 'Snickers'], 'with array-like name should return array if multiple are checked');
	},
	'textareas': function() {
		var form = new Element('form', { html: '<fieldset><textarea name="t">La dee da.</textarea></fieldset>' });
		
		var data = form.serialize();
		this.assertEqual(data.t, 'La dee da.', 'textareas should pull value from the nodeValue');
		this.assertFalse(data.nonExistant, 'and still not have any extra values');
	},
	'select boxes': function() {
		var form = new Element('form', { html: '\
			<fieldset>\
				<select name="job">\
					<option selected="selected">Programmer</option>\
					<option>Designer</option>\
				</select>\
				<select name="food">\
					<option value="carls">Carls Jr</option>\
					<option value="tbell" selected="selected">Taco Bell</option>\
				</select>\
			</fieldset>\
		'});
		
		var data = form.serialize();
		
		this.assertEqual(data.job, 'Programmer', 'should contain the nodeValue if value isn\'t set');
		this.assertEqual(data.food, 'tbell', 'should contain the value if a value is set');
		this.assertFalse(data.carls, 'should not contain a value that isn\'t selected');
	},
	'radio buttons': function() {
		var form = new Element('form', { html: '\
			<fieldset>\
				<input type="radio" checked="checked" value="Programmer" name="job" />\
				<input type="radio" value="Designer" name="job" />\
			</fieldset>\
			<fieldset>\
				<input type="radio" value="carls" name="food" />\
				<input type="radio" value="tbell" name="food" />\
			</fieldset>\
		'});
		
		var data = form.serialize();
		
		this.assertEqual(data.job, 'Programmer', 'should have value of checked input');
		this.assertFalse(data.food, 'should not contain a value if no button is selected');
		this.assertFalse(data.carls, 'should not contain a value with the name from the value attribute');
	}
});