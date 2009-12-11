Monstar Lab MVC
===========

A Javascript framework, using [MooTools](http://mootools.net) as the Core. Built for [Monstar Lab](http://monstarlab.com).

How to use
----------

Models take care of all storage types, such as SQL, Ajax, XML, File, Storage, etc.

		var Recipe = new Class({		
				Extends: Model.Ajax,
				data: {
						id: null,
						title: null,
						ingredients: null
				}
		});
		
Views are HTML written in ASP-like sytnax, that allows the execution of Javascript.

		<ul id="RecipesList">
				<% recipes.each(function(r) { %>
				<li class="recipe recipe_<%=r.get(id)%>">
						<h3><%=r.get(title)%></h3>
				</li>
				<% }); %>
		</ul>


Controllers handle all View events to make changes to the Model, and then re-render the view. Controllers either specify an element, or use the name of the Controller to own an element. The controller then observes events delegated from within this container. All HTML inside the container should be a View.

		var RecipesController = new Class({
				listRecipes: function(recipes) {
						$(this).set('html', this.view('recipes/list', { recipes: recipes }));
				}
				
				events: {
						load: function() {
								Recipe.findAll(this.listRecipes.bind(this));
						}
				}
		});


License
-------

MIT License. Copyright 2009 [Sean McArthur](http://monstarlab.com).