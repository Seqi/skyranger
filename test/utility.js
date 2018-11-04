let expect = require('chai').expect

let createTimestamp = require('../src/utility/timestamp')

describe('Utilities', () => {
	describe('Timestamp', () => {
		let months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		]

		it('should create a timestamp in MMM dd, yyyy - HH:mm tt format', () => {
			let date = new Date()
			let timestamp = createTimestamp()

			let timestampParts = timestamp.split(' ')

			expect(timestampParts).to.have.lengthOf(6)

			expect(months).to.contain(timestampParts[0])
			expect(timestampParts[1]).to.equal(`${date.getDate()},`)
			expect(timestampParts[2]).to.equal(`${date.getFullYear()}`)
			expect(timestampParts[3]).to.equal('-')

			expect(timestampParts[4]).to.have.lengthOf(5)
			let timeParts = timestampParts[4].split(':')
			expect(timeParts).to.have.lengthOf(2)
			expect(Number(timeParts[0])).to.be.greaterThan(-1)
			expect(Number(timeParts[0])).to.be.lessThan(13)
			expect(Number(timeParts[1])).to.be.lessThan(60)
			expect(Number(timeParts[1])).to.be.greaterThan(-1)

			expect(['AM', 'PM']).to.contain(timestampParts[5])
		})
	})
})
