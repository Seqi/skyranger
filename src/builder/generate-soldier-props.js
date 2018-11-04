let generateTimestamp = require('../utility/timestamp')

function GenerateSoldierProperties(soldier, props) {
	if (!props) {
		throw new Error('A property bag is required')
	}

	let raceSpecificProperties = []
	function setRaceSpecificVals() {
		// Randomise the race of the person (4 races)
		let raceIndex = getRandomNumber(4)

		// Multiply by 6 to index through each set of possible heads for each race
		// (6 in total). Then random 5 to get which head of this race to use
		let headIndex = raceIndex * 6 + getRandomNumber(5)

		let raceProperty = props.find(prop => prop.name === 'iRace')
		let headProperty = props.find(prop => prop.name === 'nmHead')

		if (headProperty && raceProperty) {
			raceSpecificProperties.push({
				name: raceProperty.name,
				type: raceProperty.type,
				val: raceProperty.vals[raceIndex]
			})

			// Head is also gender specific
			let headVals = soldier.iGender === 1 ? headProperty.maleVals : headProperty.femaleVals
			raceSpecificProperties.push({
				name: headProperty.name,
				type: headProperty.type,
				val: headVals[headIndex]
			})
		}
	}

	function getRandomNumber(max) {
		return Math.floor(Math.random() * max)
	}

	setRaceSpecificVals()

	soldier.PoolTimestamp = generateTimestamp()
	let soldierProps = props.map(prop => {
		if (prop.name === 'None') {
			return { name: 'None' }
		}

		// Race specific handler
		let raceProperty = raceSpecificProperties.find(p => p.name === prop.name)
		if (raceProperty) {
			return raceProperty
		}

		let availableVals

		if (prop.isGenderSpecific) {
			availableVals = soldier.iGender === 1 ? prop.maleVals : prop.femaleVals
		} else if (Object.keys(soldier).find(key => key === prop.name)) {
			availableVals = [soldier[prop.name]]
		} else {
			availableVals = prop.vals
		}

		return {
			name: prop.name,
			type: prop.type,
			val: availableVals ? availableVals[getRandomNumber(availableVals.length)] : '',
			magic: prop.magic // Just in case..
		}
	})

	return soldierProps
}

module.exports = GenerateSoldierProperties
