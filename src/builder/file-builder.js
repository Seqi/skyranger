let XcomPropertyWriter = require('./property-writer')
let generateSoldierProperties = require('./generate-soldier-props')

let headerProps = require('./properties/header')
let aboutProps = require('./properties/about')
let appearenceProps = require('./properties/appearence')

// Builds up all properties in an array, including header and all soldiers
// and generate the final buffer for the file
function FileBuilder() {
	let soldierPropOptions = [...aboutProps, ...appearenceProps]
	let soldiersProperties = []

	let soldierCount = 0

	function buildHeader() {
		let header = headerProps

		// Populate the CharacterPool value with the soldier count
		header[0].val = soldierCount

		return header
	}

	this.addSoldier = soldier => {
		let soldierPropertyArray = generateSoldierProperties(soldier, soldierPropOptions)
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
