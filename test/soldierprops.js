let expect = require('chai').expect

let xcomKeys = require('./data/xcom-object-keys')
let generateSoldierProps = require('../src/builder/generate-soldier-props')

describe('Creating a soldier configuration', () => {
	let generateSoldierPropOptions

	beforeEach(() => {
		let getAboutProps = require('../src/builder/properties/about')
		let getAppearenceProps = require('../src/builder/properties/appearence')

		generateSoldierPropOptions = () => [...getAboutProps(), ...getAppearenceProps()]
	})

	it('should create all properties for a soldier', () => {
		let soldierConfig = {
			strFirstName: 'Test',
			strNickName: '\'Nickname\'',
			strLastName: 'Soldier',
			BackgroundText: 'A Bio',
			iGender: 1
		}

		let soldierProps = generateSoldierProps(soldierConfig, generateSoldierPropOptions())

		let propNames = soldierProps.map(prop => prop.name)

		expect(propNames).to.include.all.members(xcomKeys.soldierKeys)

		soldierProps.filter(prop => prop.name !== 'None')
			.forEach(prop => {
				expect(prop).to.include.all.keys(['name', 'type', 'val'])
				expect(prop.val).to.not.be.null
				expect(prop.val).to.not.be.undefined
			})
	})

	it('should use different properties for each soldier', () => {
		let soldierConfig1 = {
			strFirstName: 'Test',
			strNickName: '\'Nickname\'',
			strLastName: 'Soldier',
			BackgroundText: 'A Bio',
			iGender: 1
		}

		let soldierConfig2 = {
			strFirstName: 'Another',
			strLastName: 'Guy',
			BackgroundText: 'Another Bio',
			iGender: 2
		}

		let soldierProps1 = generateSoldierProps(soldierConfig1, generateSoldierPropOptions())
		let soldierProps2 = generateSoldierProps(soldierConfig2, generateSoldierPropOptions())

		expect(soldierProps1).to.not.deep.equal(soldierProps2)
	})

	it('should throw an error if no properties were provided', () => {
		let soldierConfig = {
			strFirstName: 'Test',
			strNickName: '\'Nickname\'',
			strLastName: 'Soldier',
			BackgroundText: 'A Bio',
			iGender: 1
		}

		expect(() => generateSoldierProps(soldierConfig)).to.throw('A property bag is required')
	})
})
