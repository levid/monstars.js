monstars.js
===========

A Javascript MVC framework, using [MooTools](http://mootools.net) as the Core. [Documentation](http://seanmonstar.github.com/monstars.js), a [demo](http://seanmonstar.github.com/monstars.js/demo/), and [blog posts](http://seanmonstar.com/tagged/monstars.js).

How to use
----------

[Models](http://seanmonstar.com/post/1009142033/mvc-in-mootools-models) take care of all storage types, such as SQL, Ajax, File, Storage, etc.

		var Recipe = new Class({		
				Extends: Model.Ajax,
				fields: {
						id: Model.Fields.AutoField(),
						title: Model.Fields.TextField({ length: 64, required: true}),
						ingredients: Model.Fields.TextField()
				}
		});
		
[Views](http://seanmonstar.com/post/1053909313/mvc-in-mootools-views) are HTML written in ASP-like sytnax, that allows the execution of Javascript.

		<ul id="RecipesList">
				<% recipes.each(function(r) { %>
				<li class="recipe <%=r.identity()%>">
						<h3><%=r.get('title')%></h3>
						<%= view('recipes/ingredients', r.get('ingredients')); %>
						<a href="#" class="delete">Delete</a>
				</li>
				<% }); %>
		</ul>


[Controllers](http://seanmonstar.com/post/1349631987/mvc-in-mootools-controllers) handle all View events to make changes to the Model, and then re-render the view. Controllers either specify an element, or use the name of the Controller to own an element. The controller then observes events delegated from within this container.

		var RecipesController = new Class({
				list: function(recipes) {
						$(this).set('html', this.view({ recipes: recipes }));
				}
				
				events: {
						load: function() {
								Recipe.findAll(this.list.bind(this));
						},
						'click:relay(.recipe .delete)': function(e) {
							e.preventDefault();
							var recipeView = $(e.target).getParent('.recipe');
							recipeView.get('model').destroy(function() {
								recipeView.destroy();
							});
						}
				}
		});


License
-------

MIT License. Copyright 2009-2010 [Sean McArthur](http://seanmonstar.com).