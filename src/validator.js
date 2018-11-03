module.exports = soldierArray => {
	if (soldierArray.constructor !== [].constructor) {
		return 'Input must be an array'
	}

	// Check required properties exist on all soldier
	for (let i = 0; i < soldierArray.length; i++) {
		if (!soldierArray[i].firstName) {
			return `A first name is required on soldier ${i}`
		}

		if (soldierArray[i].gender === undefined) {
			return `A gender is required on soldier ${i}`
		}

		if (soldierArray[i].gender < 1 || soldierArray[i].gender > 2) {
			return `Gender value should be either 1 (male) or 2 (female) on soldier ${i}`
		}
	}

	return null
}
