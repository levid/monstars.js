var RecipesController = new Class({
	
	Extends: Controller,
	
	load: function() {
		Recipe.findAll(this.listRecipes.bind(this));
		this.grab(new RecipeFormView());
	},
	
	listRecipe: function(recipe, list) {
		($(list) || $(this).getElement('ul')).grab(new RecipeView(recipe))
	},
	
	listRecipes: function(recipes) {
		console.log('start');
		list_view = new RecipeListView();
		
		// TODO: should be in View
		recipes.each(function(r) {
			this.listRecipe(r, list_view);
		}.bind(this));
		this.grab(list_view);
		
	},
	
	'onclick:relay(a.delete)': function(e) {
		//var recipe = e.element.getParent().model();
		//recipe.destroy();
		console.log(e);
		e.stop();
	},
	
	'onsubmit:relay(form)': function(e) {
		e.stop();
		var form = $(e.target);
		var values = form.serialize();
		form.reset();
		var recipe = new Recipe(values);
		recipe.save(this.listRecipe.bind(this));
	}
	
});

Core.register_controller(RecipesController);