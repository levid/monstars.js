var RecipesController = new Class({
	
	Extends: Controller,
	
	/*onclick: function(e) {
		var r = new Recipe({title: 'Tea'});
		r.save(this.listRecipe.bind(this));
	},*/
	
	listRecipe: function(recipe) {
		this.grab(new RecipeView(recipe));
	},
	
	'onclick:relay(a)': function(e) {
		//var recipe = e.element.getParent().model();
		//recipe.destroy();
		console.log(e);
		e.stop();
	}
	
});

Core.register_controller(RecipesController);