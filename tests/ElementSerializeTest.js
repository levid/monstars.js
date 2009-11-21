var ElementSerializeTest = new TestCase({
	test_text: function() {
		var form = new Element('form', { html: '<fieldset><input type="text" name="first_name" value="Sean" /><input type="text" name="last_name" value="McArthur" /><input type="text" name="title" /></fieldset>' });
		
		var data = form.serialize();
		this.assertEquals(data.first_name, 'Sean');
		this.assertEquals(data.last_name, 'McArthur');
		this.assertFalse(data.title);
	},
	test_checkbox: function() {
		var form = new Element('form', { html: '\
			<fieldset>\
				<input type="checkbox" name="topic" checked="checked" value="Javascript" />\
				<input type="checkbox" name="topic" value="PHP" />\
			</fieldset>\
			<fieldset>\
				<input type="checkbox" name="candy" checked="checked"  value="Twix" />\
				<input type="checkbox" name="candy" checked="checked"  value="Snickers" />\
			</fieldset>\
			<fieldset>\
				<input type="checkbox" name="sleepy" value="true" checked="checked" />\
			</fieldset>\
		'});
		
		var data = form.serialize();
		
		this.assertEquals(data.topic, 'Javascript');
		this.assertTrue(data.sleepy);
		this.assertEquals(data.candy, ['Twix', 'Snickers']);
	},
	test_textArea: function() {
		var form = new Element('form', { html: '<fieldset><textarea name="t">La dee da.</textarea></fieldset>' });
		
		var data = form.serialize();
		this.assertEquals(data.t, 'La dee da.');
		this.assertFalse(data.nonExistant);
	},
	test_select: function() {
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
		
		this.assertEquals(data.job, 'Programmer');
		this.assertEquals(data.food, 'tbell');
		this.assertFalse(data.carls);
	},
	test_radio: function() {
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
		
		this.assertEquals(data.job, 'Programmer');
		this.assertFalse(data.food);
		this.assertFalse(data.carls);
	}
});