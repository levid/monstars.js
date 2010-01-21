var Expense = new Class({
	
	Extends: Model.Ajax,
	
	fields: {
		id: Model.Fields.AutoField(),
		title: Model.Fields.TextField(),
		description: Model.Fields.TextField(),
		price: Model.Fields.NumberField()
	},
	
	useFixtures: true
	
});