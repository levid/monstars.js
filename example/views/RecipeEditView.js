var RecipeEditView = new Class({
	
	Extends: View.HTML,
	
	template: '<li class="recipe recipe_{id}"><form action="#" method="post"><input type="text" name="title" value="{title}" /></form><a href="#" class="delete">Delete</a></li>'
	
});