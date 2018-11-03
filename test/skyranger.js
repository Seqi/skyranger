let expect = require('chai').expect

let skyranger = require('../src/index')
let xcomFileReader = require('./utils/file-reader')

describe('Skyranger', () => {
	it('should generate the file', () => {
		let soldiers = [
			{
				firstName: 'One',
				gender: 1
			},
			{
				firstName: 'Two',
				nickName: '2',
				lastName: 'Lastname',
				biography: 'A bio',
				gender: 2
			}
		]

		let file = skyranger(soldiers)

		let result = xcomFileReader(file).readFile()

		expect(result.SoldierCount).to.equal(2)
		expect(result.soldiers).to.have.lengthOf(2)

		let soldierTwo = result.soldiers[1]

		expect(soldierTwo.strFirstName.val).to.equal('Two')
		expect(soldierTwo.strNickName.val).to.equal('2')
		expect(soldierTwo.strLastName.val).to.equal('Lastname')
		expect(soldierTwo.BackgroundText.val).to.equal('A bio')
		expect(soldierTwo.iGender.val).to.equal(2)
	})
})
