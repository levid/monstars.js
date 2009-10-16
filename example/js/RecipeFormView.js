var RecipeFormView = new Class({
	
	Extends: View.HTML,
	
	template: '\
		<form action="#" method="post">\
			<fieldset>\
				<label>\
					Title\
					<input type="text" name="title" />\
				</label>\
				<button type="submit">Create Recipe</button>\
			</fieldset>\
		</form>\
	'
	
});