module.exports = function (self) {
	self.setActionDefinitions({
		query: {
			name: 'Execute SQL Query',
			options: [
				{
					id: 'dummy',
					type: 'static-text',
					label: 'Please note:',
					value: 'Variables are not escaped. You need to quote strings where needed.',
				},
				{
					id: 'query',
					type: 'textinput',
					label: 'SQL Query',
					useVariables: true,
				},
			],
			callback: async (event) => {
				var query = await self.parseVariablesInString(event.options.query)
				console.log(query)
				try {
					const [results, fields] = await self.connection.query(query)
					console.log("== RESULTS ==")
					console.log(results)
					console.log("== FIELDS ==")
					console.log(fields)
				} catch (err) {
					self.log("error", String(err))
				}
			},
		},
	})
}
