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
				try {
					const [results, fields] = await self.pool.query(query)
				} catch (err) {
					self.log("error", String(err))
				}
			},
		},
	})
}
