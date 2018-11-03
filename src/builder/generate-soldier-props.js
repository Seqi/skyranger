let generateTimestamp = require('../utility/timestamp')

function GenerateSoldierProperties(soldier, props) {
	return (function create() {
		if (!props) {
			throw new Error('A property bag is required')
		}

		soldier.PoolTimestamp = generateTimestamp()

		// Populate any gender specific values with the right gender
		props.filter(prop => prop.isGenderSpecific)
			.map(prop => {
				prop.vals = soldier.iGender === 2 ? prop.femaleVals : prop.maleVals

				delete prop.isGenderSpecific
				delete prop.femaleVals
				delete prop.maleVals
			})

		setRaceSpecificVals(props)

		// Add the user-defined properties (i.e. name) as the only available vals
		for (let xcomProp in soldier) {
			addPropertyOption(xcomProp, soldier[xcomProp], props)
		}

		// Pick out one property from the potential values for each property
		props.forEach(setRandomPropertyVal)

		return props
	})()

	function setRaceSpecificVals(props) {
		// Get the race of the person and a matching head index
		let raceIndex = getRandomNumber(4)

		// Multiply by 6 to index through each set of possible heads for each race
		// (5 in total). Then random 5 to get which head of this race to use
		let headIndex = raceIndex * 6 + getRandomNumber(5)

		// Manually find the properties and set the value
		// Is there a better way to find the correct property that isnt O(n)?
		props.forEach(function setRaceVals(prop) {
			if (prop.name === 'nmHead') {
				prop.val = prop.vals[headIndex]
				delete prop.vals
			} else if (prop.name === 'iRace') {
				prop.val = prop.vals[raceIndex]
				delete prop.vals
			}
		})
	}

	// Adds a value to all available values of a property
	function addPropertyOption(key, value, props) {
		props.forEach(function setPropertyIfMatching(prop) {
			if (prop.name === key) {
				prop.vals.push(value)
			}
		})
	}

	function setRandomPropertyVal(prop) {
		// "None" properties have no value
		// Only set properties with available values where one hasn't been set
		if (prop.name != 'None' && prop.val == null) {
			prop.val = getRandomPropertyVal(prop)

			// Clean up the value choices
			delete prop.vals
		}
	}

	// Returns a random value of a property
	function getRandomPropertyVal(prop) {
		if (prop.vals) {
			let index = getRandomNumber(prop.vals.length)
			return prop.vals[index]
		}
	}

	function getRandomNumber(max) {
		return Math.floor(Math.random() * max)
	}
}

module.exports = GenerateSoldierProperties
