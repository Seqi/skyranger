let expect = require('chai').expect

let xcomKeys = require('./data/xcom-object-keys')
let generateSoldierProps = require('../src/builder/generate-soldier-props')

describe('Creating a soldier configuration', () => {
	let soldierPropOptions

	beforeEach(() => {
		let aboutProps = require('../src/builder/properties/about')
		let appearenceProps = require('../src/builder/properties/appearence')

		soldierPropOptions = [...aboutProps, ...appearenceProps]
	})

	it('should create all properties for a soldier', () => {
		let soldierConfig = {
			strFirstName: 'Test',
			strNickName: '\'Nickname\'',
			strLastName: 'Soldier',
			BackgroundText: 'A Bio',
			iGender: 1
		}

		let soldierProps = generateSoldierProps(soldierConfig, soldierPropOptions)

		let propNames = soldierProps.map(prop => prop.name)

		expect(propNames).to.include.all.members(xcomKeys.soldierKeys)

		soldierProps.filter(prop => prop.name !== 'None').forEach(prop => {
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

		let soldierProps1 = generateSoldierProps(soldierConfig1, soldierPropOptions)
		let soldierProps2 = generateSoldierProps(soldierConfig2, soldierPropOptions)

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

	it('should use soldier config for about values', () => {
		let props = [
			{
				name: 'strFirstName',
				type: 'NameProperty'
			},
			{
				name: 'iGender',
				type: 'IntProperty'
			}
		]

		let soldierConfig = {
			strFirstName: 'Test',
			strNickName: '\'Nickname\'',
			strLastName: 'Soldier',
			BackgroundText: 'A Bio',
			iGender: 1
		}

		let result = generateSoldierProps(soldierConfig, props)

		let name = result.find(prop => prop.name === 'strFirstName')
		expect(name).to.not.be.null
		expect(name.val).to.not.be.undefined
		expect(name.val).to.equal('Test')

		let gender = result.find(prop => prop.name === 'iGender')
		expect(gender).to.not.be.null
		expect(gender.val).to.not.be.undefined
		expect(gender.val).to.equal(1)
	})

	it('should pick valid race options', () => {
		let props = [
			{
				name: 'iRace',
				type: 'IntProperty',
				vals: [
					0, // Caucasian
					1, // African
					2, // Asian
					3 // Latino
				]
			},
			{
				name: 'nmHead',
				type: 'NameProperty',
				isGenderSpecific: true,
				maleVals: [
					'CaucMale_A',
					'CaucMale_B',
					'CaucMale_C',
					'CaucMale_D',
					'CaucMale_E',
					'CaucMale_F',
					'AfrMale_A',
					'AfrMale_B',
					'AfrMale_C',
					'AfrMale_D',
					'AfrMale_E',
					'AfrMale_F',
					'AsnMale_A',
					'AsnMale_B',
					'AsnMale_C',
					'AsnMale_D',
					'AsnMale_E',
					'AsnMale_F',
					'LatMale_A',
					'LatMale_B',
					'LatMale_C',
					'LatMale_D',
					'LatMale_E',
					'LatMale_F'
				],
				femaleVals: [
					'CaucFem_A',
					'CaucFem_B',
					'CaucFem_C',
					'CaucFem_D',
					'CaucFem_E',
					'CaucFem_F',
					'AfrFem_A',
					'AfrFem_B',
					'AfrFem_C',
					'AfrFem_D',
					'AfrFem_E',
					'AfrFem_F',
					'AsnFem_A',
					'AsnFem_B',
					'AsnFem_C',
					'AsnFem_D',
					'AsnFem_E',
					'AsnFem_F',
					'LatFem_A',
					'LatFem_B',
					'LatFem_C',
					'LatFem_D',
					'LatFem_E',
					'LatFem_F'
				]
			}
		]

		let soldierConfig = {
			strFirstName: 'Test',
			strNickName: '\'Nickname\'',
			strLastName: 'Soldier',
			BackgroundText: 'A Bio'
		}

		// Run through 10 times, just to be sure ;)
		for (let i = 0; i < 10; i++) {
			// Ensure an even split of genders
			soldierConfig.iGender = (i % 2 === 0) + 1

			let result = generateSoldierProps(soldierConfig, props)

			let race = result.find(prop => prop.name === 'iRace')
			let head = result.find(prop => prop.name === 'nmHead')

			expect(race).to.not.be.undefined
			expect(head).to.not.be.undefined

			let raceIdx = race.val

			let faceIdx
			if (soldierConfig.iGender === 1) {
				faceIdx = props[1].maleVals.indexOf(head.val)
			} else {
				faceIdx = props[1].femaleVals.indexOf(head.val)
			}

			// Ensure that the face value is a valid match
			let isValidCombo = Math.floor(faceIdx / 6) === raceIdx

			expect(isValidCombo).to.be.true
		}
	})

	it('should not modify the provided properties', () => {
		let props = [
			{
				name: 'prop1',
				type: 'NameProperty',
				vals: ['Value 1', 'Value 2', 'Value 3']
			},
			{
				name: 'prop2',
				type: 'IntProperty',
				isGenderSpecific: true,
				maleVals: [1, 2, 3],
				femaleVals: [4, 5]
			}
		]

		let soldierConfig = {
			strFirstName: 'Test',
			strNickName: '\'Nickname\'',
			strLastName: 'Soldier',
			BackgroundText: 'A Bio',
			iGender: 1
		}

		generateSoldierProps(soldierConfig, props)

		expect(props).to.have.lengthOf(2)

		expect(props[0]).to.have.any.keys('vals')
		expect(props[0].vals).to.have.lengthOf(3)
		expect(props[0]).to.not.have.any.keys('val')

		expect(props[1]).to.not.have.any.keys('val')
		expect(props[1]).to.not.have.any.keys('vals')
		expect(props[1]).to.have.any.keys('maleVals')
		expect(props[1]).to.have.any.keys('femaleVals')
		expect(props[1]).to.have.any.keys('isGenderSpecific')
		expect(props[1].maleVals).to.have.lengthOf(3)
		expect(props[1].femaleVals).to.have.lengthOf(2)
	})
})
