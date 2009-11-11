var RecipesController = new Class({
	
	Extends: Controller,
	
	
	listRecipe: function(recipe, list) {
		($(list) || $(this).getElement('#RecipeList')).grab(new RecipeView(recipe))
	},
	
	listRecipes: function(recipes) {
		var list_view = $(this).getElement('#RecipeList') || new RecipeListView();
		
		// TODO: should be in View
		recipes.each(function(r) {
			this.listRecipe(r, list_view);
		}.bind(this));
		$(this).grab(list_view);
		
	},
	
	events: {
		
		load: function() {
			Recipe.findAll(this.listRecipes.bind(this));
			$(this).grab(new RecipeFormView());
		},
		
		
		'onclick:relay(a.delete)': function(e) {
			e.stop();
			var recipe_el = $(e.target).getParent();
			var view = new RecipeView(recipe_el);
			view.model().destroy(function() {
				$(view).destroy();
			});
		},
		
		'onsubmit:relay(#AddRecipe)': function(e) {
			e.stop();
			var form = $(e.target);
			var values = form.serialize();
			form.reset();
			var recipe = new Recipe(values);
			//recipe.save(this.listRecipe.bind(this));
			this.listRecipe(recipe);
		},
		
		'click:relay(.title)': function(e) {
			e.stop();
			var listItem = $(e.target).getParent('li');
			
			var recipe = new RecipeView(listItem).model();
			$(new RecipeEditView(recipe)).replaces(listItem);			
			
		},
		
		'submit:relay(.recipe form)': function(e) {
			e.stop();
			var form = $(e.target);
			var values = form.serialize();
			var view = new RecipeEditView(form.getParent('.recipe'));
			var recipe = view.model();
			recipe.set(values);
			$(new RecipeView(recipe)).replaces(view);
		}
		
	}
	
});

Core.register_controller(RecipesController);