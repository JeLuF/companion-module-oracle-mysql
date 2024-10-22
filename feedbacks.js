const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		SQLQuery: {
			type: 'advanced',
			name: 'Update variable via SQL query',
			description: 'Execute an SQL query and use its result to set the value of a variable. Variables can be used on any button.',
			options: [ {
				type: 'textinput',
				label: 'SQL query',
				id: 'query',
				useVariables: true,
			}, {
				type: 'textinput',
				label: 'Variable',
				id: 'variable',
				regex: '/^[a-zA-Z0-9_]+$/',
				default: '',
			} ],
			callback: () => {
				// Nothing to do, as this feeds a variable
				return {}
			},
			subscribe: (feedback) => {
				console.log("SUBSCRIBE")
				self.subscriptions.set(feedback.id, {
					variableName: feedback.options.variable,
					sqlQuery: feedback.options.query,
					value: null
				})
				if (self.isInitialized) {
					self.updateVariables(feedback.id)
				}
				console.log("initialized", self.isInitialized)
			},
			unsubscribe: (feedback) => {
				this.subscriptions.delete(feedback.id)
			}
		},
	})

	if (self.pollInterval != undefined) {
		clearInterval(pollInterval)
	}
	self.pollInterval = setInterval( async () => {
		self.subscriptions.forEach( async (subscription) => { 
			console.log(subscription)
			var query = await self.parseVariablesInString(subscription.sqlQuery)
			console.log(query)
			try {
				const [results, fields] = await self.connection.query(query)
				console.log("== RESULTS ==")
				console.log(results)
				if (results[0] != undefined) {
					var value = results[0][Object.keys(results[0])[0]]
					if (subscription.value != value) {
						subscription.value = value
						self.setVariableValues({ [subscription.variableName]: value })
					}
				}
			} catch (err) {
				self.log("error", String(err))
			}

		})
	}, self.config.pollinterval)
}
