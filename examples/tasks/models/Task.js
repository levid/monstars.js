var Task = new Class({
	
	Extends: Model.Browser,
	
	fields: {
		id: Model.Fields.AutoField(),
		title: Model.Fields.TextField(),
		created_at: Model.Fields.DateField(),
		is_done: Model.Fields.BooleanField()
	}
	
});