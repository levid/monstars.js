Monstar Lab MVC
===========

A Javascript framework, using [MooTools](http://mootools.net) as the Core. Built for [Monstar Lab](http://monstarlab.com).

How to use
----------

Models take care of all storage types, such as SQL, Ajax, XML, File, Storage, etc.

		var Recipe = new Class({		
				Extends: Model.Ajax,
				fields: {
						id: Model.Fields.AutoField(),
						title: Model.Fields.TextField({ length: 64, required: true}),
						ingredients: Model.Fields.TextField()
				}
		});
		
Views are HTML written in ASP-like sytnax, that allows the execution of Javascript.

		<ul id="RecipesList">
				<% recipes.each(function(r) { %>
				<li class="recipe <%=r.identity()%>">
						<h3><%=r.get(title)%></h3>
						<%= view('recipes/ingredients', r.get('ingredients')); %>
						<a href="#" class="delete">Delete</a>
				</li>
				<% }); %>
		</ul>


Controllers handle all View events to make changes to the Model, and then re-render the view. Controllers either specify an element, or use the name of the Controller to own an element. The controller then observes events delegated from within this container. All HTML inside the container should be a View.

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
							recipeView.model().destroy(function() {
								recipeView.destroy();
							});
						}
				}
		});


License
-------

MIT License. Copyright 2009-2010 [Sean McArthur](http://monstarlab.com).