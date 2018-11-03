function XcomFileReader(inBuffer) {
	let offset = 0
	let buffer = inBuffer
	let isReadingStruct = false

	function readFile() {
		// Using this "get next property" format as it lets me process the file
		// property by property for testing purposes.
		let props = readHeader()

		props.soldiers = []

		while (offset < buffer.length) {
			props.soldiers.push(readSoldier())
		}

		return props
	}

	function readHeader() {
		// Character pool bins all have an FF FF FF FF prefix
		// Skip over first 4 bytes, ensuring they match this value
		let headerBytes = Buffer.from([255, 255, 255, 255])
			.readUInt32LE()
		skipValue(headerBytes)

		let header = {}

		let prop = getNextProperty()

		while (prop.name != 'None') {
			header[prop.name] = prop
			prop = getNextProperty()
		}

		header['SoldierCount'] = readInt()

		return header
	}

	function readSoldier() {
		let soldier = {}

		let finishedReading = false

		while (!finishedReading) {
			let prop = getNextProperty()
			if (prop.name !== 'None') {
				soldier[prop.name] = prop
			} else {
				// If we are parsing a struct and hit 'None', we don't want to push a
				// new soldier and just ignore it.
				if (isReadingStruct) {
					isReadingStruct = false
				}

				// If we are parsing a character and not a struct, we want to push the
				// current soldier to the array
				else {
					finishedReading = true
				}
			}
		}

		return soldier
	}

	function getNextProperty() {
		let prop = {}

		prop.name = readString()
		skipValue()

		// "None" acts as a separator between header/soldier and each soldier
		if (prop.name === 'None') {
			return prop
		}

		prop.type = readString()
		skipValue()

		// TODO: Refactor
		switch (prop.type) {
		case 'StrProperty':
			prop.valSize = readInt()
			skipValue()
			prop.val = readString()
			break

		case 'IntProperty':
			prop.valSize = readInt()
			skipValue()
			prop.val = readInt()
			break

		case 'BoolProperty':
			prop.valSize = readInt()
			skipValue()
			prop.val = readBool()
			break

		case 'ArrayProperty':
			prop.valSize = readInt()
			skipValue()
			prop.val = readInt()
			break

		case 'NameProperty':
			prop.valSize = readInt()
			skipValue()
			prop.val = readString()

			// TODO: Find out why this int is at the name of every NameProperty
			// Other than one instance found so far, this num is 0
			readInt()
			break

		case 'StructProperty':
			prop.valSize = readInt()
			skipValue()
			prop.val = readString()
			skipValue()

			// Flag so that the next None doesn't get counted as 'end of soldier'
			isReadingStruct = true
			break
		}

		return prop
	}

	function readString() {
		let length = readInt()
		let strBuffer = buffer.slice(offset, offset + length - 1)
		skipBytes(length)
		return strBuffer.toString('utf8')
	}

	function readInt() {
		let length = buffer.readUInt32LE(offset)
		skipBytes()
		return length
	}

	function readBool() {
		let falseVal = Buffer.from([0])
		let trueVal = Buffer.from([1])

		let boolVal = buffer.slice(offset, offset + 1)
		skipBytes(1)

		if (boolVal.equals(trueVal)) {
			return true
		} else if (boolVal.equals(falseVal)) {
			return false
		} else throw new Error('Could not read bool value')
	}

	function skipValue(expectedVal = 0) {
		// Attempts to skip a 4 byte buffer, ensuring the value matches (default 0).
		let bufferVal = readInt()
		if (bufferVal !== expectedVal) {
			throw new Error('Value mismatch. Expected: ' + expectedVal + ' Got: ' + bufferVal)
		}
	}

	function skipBytes(count) {
		// If a value was not provided, shift by the standard 4 bytes
		offset += count >= 0 ? count : 4
	}

	return {
		readFile,
		readHeader,
		readSoldier
	}
}

module.exports = XcomFileReader
