let XcomPropertyWriter = require('./property-writer')
let generateSoldierProperties = require('./generate-soldier-props')

let headerProps = require('./properties/header')
let getAboutProps = require('./properties/about')
let getAppearenceProps = require('./properties/appearence')

// Builds up all properties in an array, including header and all soldiers
// and generate the final buffer for the file
function FileBuilder() {
	// Temp workaround - make this a function so the properties are reloaded each call
	let getSoldierPropOptions = () => [...getAboutProps(), ...getAppearenceProps()]
	let soldiersProperties = []

	let soldierCount = 0

	function buildHeader() {
		let header = headerProps

		// Populate the CharacterPool value with the soldier count
		header[0].val = soldierCount

		return header
	}

	this.addSoldier = soldier => {
		let soldierPropertyArray = generateSoldierProperties(soldier, getSoldierPropOptions())

		// We don't want an array of an array of properties, so spread the array elements
		soldiersProperties.push(...soldierPropertyArray)
		soldierCount++
	}

	this.build = () => {
		let allProperties = [...buildHeader(), ...soldiersProperties]

		let writer = new XcomPropertyWriter(soldierCount)
		allProperties.forEach(property => writer.write(property))

		return writer.result()
	}
}

module.exports = FileBuilder
