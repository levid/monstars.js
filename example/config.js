init.core();
init.mvc('Model.Ajax','View.HTML');
//init.config();
init.app(function() {
	init.models('Recipe');
	init.controllers('Recipes');
	init.views('Recipe','RecipeEdit','RecipeForm','RecipeList');
});