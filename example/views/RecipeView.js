var RecipeView = new Class({
	
	Extends: View.HTML,
	
	template: '<li class="recipe recipe_{id}"><span class="title">{title}</span><a href="#" class="delete">Delete</a></li>'
	
});