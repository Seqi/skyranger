let expect = require('chai').expect

let validator = require('../src/validator')

describe('Soldier configuration validator', () => {
	it('should pass for valid soldier', () => {
		let soldierConfig = [
			{
				firstName: 'Test',
				gender: 1
			}
		]

		let result = validator(soldierConfig)

		expect(result).to.be.null
	})

	it('should pass for valid soldier with unused properties', () => {
		let soldierConfig = [
			{
				firstName: 'Test',
				gender: 1,
				garbage: true
			}
		]

		let result = validator(soldierConfig)

		expect(result).to.be.null
	})

	it('should fail if soldier configuration is not an array', () => {
		let soldierConfig = {
			firstName: 'Test',
			gender: 1
		}

		let result = validator(soldierConfig)

		expect(result).to.contain('array')
	})

	it('should fail for soldier with missing first name field', () => {
		let soldierConfig = [
			{
				gender: 1
			}
		]

		let result = validator(soldierConfig)

		expect(result).to.contain('first name')
	})

	it('should fail for soldier with missing gender field', () => {
		let soldierConfig = [
			{
				firstName: 'Test'
			}
		]

		let result = validator(soldierConfig)

		expect(result).to.contain('gender')
	})

	it('should fail for invalid gender value', () => {
		let soldierConfig = [
			{
				firstName: 'Test',
				gender: 0
			}
		]

		let result = validator(soldierConfig)

		expect(result).to.contain('Gender value should be')
	})
})
