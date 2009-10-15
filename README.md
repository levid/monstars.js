Monstar Lab MVC
===========

A Javascript framework, using [MooTools](http://mootools.net) as the Core. Built for [Monstar Lab](http://monstarlab.com).

How to use
----------

Models take care of all storage types, such as SQL, Ajax, XML, File, etc.

Controllers handle all View events to make changes to the Model, and then re-render the view. Controllers either specify an element, or use the name of the Controller to own an element. The controller then observes events delegated from within this container. All HTML inside the container should be a View.

Views contain a template property, and additional logic in an onRender property. Views can be HTML, XML, RSS, JSON, Markdown, etc.
	

License
-------

MIT License. Copyright 2009 [Sean McArthur](http://monstarlab.com).