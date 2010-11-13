var Method = new Class({
	
	Extends: Model.Ajax,
	
	fields: {
		id: Model.Fields.AutoField(),
		title: Model.Fields.TextField(),
		description: Model.Fields.TextField(),
		klass: Model.Fields.ForeignKey('Klass')
	}
	
});