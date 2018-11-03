let expect = require('chai').expect

let xcomFileReader = require('./utils/file-reader')
let xcomKeys = require('./data/xcom-object-keys')

let XcomFileBuilder = require('../src/builder/file-builder')

describe('File builder', () => {
	it('should generate the file buffer for one soldier', () => {
		// Arrange
		let fileBuilder = new XcomFileBuilder()
		let soldiers = createSoldiers(1)
		soldiers.forEach(soldier => fileBuilder.addSoldier(soldier))

		// Act
		let result = fileBuilder.build()

		// Assert
		let file = xcomFileReader(result).readFile()

		expect(file).to.have.all.keys(xcomKeys.headerKeys.concat('soldiers'))
		expect(file.SoldierCount).to.equal(1)
		expect(file.soldiers).to.have.lengthOf(1)

		expect(file.soldiers[0]).to.have.all.keys(xcomKeys.soldierKeys)

		// Check all our configs applied
		Object.keys(soldiers[0]).forEach(key => {
			expect(file.soldiers[0][key].val).to.equal(soldiers[0][key])
		})
	})

	it('should generate the file buffer for multiple soldiers', () => {
		// Arrange
		let fileBuilder = new XcomFileBuilder()
		let soldiers = createSoldiers(5)
		soldiers.forEach(soldier => fileBuilder.addSoldier(soldier))

		// Act
		let result = fileBuilder.build()

		// Assert
		let file = xcomFileReader(result).readFile()

		expect(file).to.have.all.keys(xcomKeys.headerKeys.concat('soldiers'))
		expect(file.SoldierCount).to.equal(5)
		expect(file.soldiers).to.have.lengthOf(5)

		file.soldiers.forEach(soldier => expect(soldier).to.have.all.keys(xcomKeys.soldierKeys))
	})

	function createSoldiers(count) {
		return Array(count).fill({
			strFirstName: 'FirstName',
			strNickName: 'NickName',
			strLastName: 'LastName',
			iGender: 1,
			BackgroundText: 'Bio'
		})
	}
})
