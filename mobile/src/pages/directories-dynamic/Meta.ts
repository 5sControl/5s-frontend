enum DataTypes {
	number = "number",
	string = "string",
	timestamp = "timestamp"
}

type Translations = {
	[key: string]: string
  }
  

export type CollectionMeta = {
	collection: string
	url: string
	label: string
	displayTemplate: 'list'
	displayField: string
	translations?: Translations
	fields: Array<{
		field: string,
		dataType: DataTypes
		translations?: Translations
		label?: string
		required: boolean
		visible: boolean
		editable: boolean
	}>
}

export const directoriesMeta: CollectionMeta = {
	collection: "directories",
	url: 'api/erp-reference/references/',
	label: "Directories",
	displayTemplate: "list",
	displayField: "name",
	translations: {
		"en": "Directories",
		"pl": "Katalogi",
		"ru": "Каталоги"
	},
	fields: [
		{
			field: "id",
			dataType: DataTypes.number,
			visible: false,
			editable: false,
			required: false
		},
		{
			field: "name",
			dataType: DataTypes.string,
			translations: {
				"en": "Directory name",
				"pl": "Nazwa katalogu",
				"ru": "Название справочника"
			},
			label: "Name",
			visible: true,
			editable: true,
			required: true
		},
		{
			field: "createdAt",
			dataType: DataTypes.timestamp,
			visible: false,
			editable: false,
			required: false
		}
	]

}