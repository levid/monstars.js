var RecipeView = new Class({
	
	Extends: View.HTML,
	
	template: '<li class="recipe recipe_{id}"><span class="title">{title}</span><strong>{ingredients}</strong><a href="#" class="delete">Delete</a></li>'
	
});