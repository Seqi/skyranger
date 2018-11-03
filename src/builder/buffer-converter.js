const nullTerminator = Buffer.from([0])

module.exports = {
	string: val => {
		// Get the length prefix (+1 for null terminator)
		let lengthBuffer = Buffer.alloc(4)
		lengthBuffer.writeUInt32LE(val.length + 1)

		// Get a binary representation of the text
		let valBuffer = Buffer.from(val, 'utf8')

		// Concat with a null terminator
		let bufferLength = val.length + 5
		let bufferArray = [lengthBuffer, valBuffer, nullTerminator]
		return Buffer.concat(bufferArray, bufferLength)
	},

	int: val => {
		let intBuffer = Buffer.alloc(4)
		intBuffer.writeUInt32LE(val)

		return intBuffer
	},

	bool: val => {
		return Buffer.from(val ? [1] : [0])
	},

	tab: () => {
		return Buffer.from([0, 0, 0, 0])
	}
}
