let XcomFileBuilder = require('./builder/file-builder')
let validateSoldiers = require('./validator')

function convert(soldiers) {
	const defaultOptions = {
		lastName: '',
		nickName: '',
		biography: ''
	}

	// Set defaults if necessary and map to XCOM naming convention
	return soldiers.map(soldierOptions => Object.assign({}, defaultOptions, soldierOptions)).map(soldierOptions => {
		return {
			strFirstName: soldierOptions.firstName,
			strLastName: soldierOptions.lastName,
			strNickName: soldierOptions.nickName,
			iGender: soldierOptions.gender,
			BackgroundText: soldierOptions.biography
		}
	})
}

function build(soldiers) {
	let error = validateSoldiers(soldiers)

	if (error) {
		throw new Error(error)
	}

	let xcomSoldiers = convert(soldiers)

	const fileBuilder = new XcomFileBuilder(xcomSoldiers.length)
	xcomSoldiers.forEach(s => fileBuilder.addSoldier(s))

	return fileBuilder.build()
}

module.exports = build
