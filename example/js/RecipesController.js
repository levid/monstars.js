var RecipesController = new Class({
	
	Extends: Controller,
	
	
	listRecipe: function(recipe, list) {
		($(list) || $(this).getElement('#RecipeList')).grab(new RecipeView(recipe))
	},
	
	listRecipes: function(recipes) {
		list_view = $(this).getElement('#RecipeList') || new RecipeListView();
		
		// TODO: should be in View
		recipes.each(function(r) {
			this.listRecipe(r, list_view);
		}.bind(this));
		this.grab(list_view);
		
	},
	
	events: {
		
		load: function() {
			Recipe.findAll(this.listRecipes.bind(this));
			this.grab(new RecipeFormView());
		},
		
		
		'onclick:relay(a.delete)': function(e) {
			//var recipe = e.element.getParent().model();
			//recipe.destroy();
			e.stop();
			var recipe_el = $(e.target).getParent();
			var view = recipe_el.view(); // OR var view = new RecipeView(recipe_el);
		},
		
		'onsubmit:relay(form)': function(e) {
			e.stop();
			var form = $(e.target);
			var values = form.serialize();
			form.reset();
			var recipe = new Recipe(values);
			recipe.save(this.listRecipe.bind(this));
		}
		
	}
	
});

Core.register_controller(RecipesController);