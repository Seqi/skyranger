const createBufferFor = require('./buffer-converter')

function PropertyWriter(soldierCount) {
	// Initialise with the XCOM expected header
	let buffer = [Buffer.from([255, 255, 255, 255])]
	let isWritingHeader = true

	this.write = prop => {
		writeString(prop.name)
		writeTab()

		// TODO: Move 'None' handler elsewhere. As we are writing straight
		// to the buffer, it may not be possible to do it nicely.
		// If the 'None' is end of header, write the number of soldiers to buffer.
		if (prop.name === 'None') {
			if (isWritingHeader) {
				writeInt(soldierCount)
				isWritingHeader = false
			}
			return
		}

		writeString(prop.type)
		writeTab()

		switch (prop.type) {
		case 'StrProperty':
			writeInt(prop.val.length + 5)
			writeTab()
			writeString(prop.val)
			break

		case 'ArrayProperty':
		case 'IntProperty':
			writeInt(4)
			writeTab()
			writeInt(prop.val)
			break

		case 'BoolProperty':
			writeInt(0)
			writeTab()
			writeBool(prop.val)
			break

		case 'NameProperty':
			writeInt(prop.val.length + 9)
			writeTab()
			writeString(prop.val)
			// Workaround for the weird magic int that appears after
			// some NamePropertys
			writeInt(prop.magic || 0)
			break

		case 'StructProperty':
			// TODO: Replace this with the struct length somehow
			// XCOM 2 doesn't seem to care what value is here however
			writeInt(0)
			writeTab()
			writeString(prop.val)
			writeTab()
			break
		}
	}

	function writeString(val) {
		let bin = createBufferFor.string(val)
		buffer.push(bin)
	}

	function writeInt(val) {
		let bin = createBufferFor.int(val)
		buffer.push(bin)
	}

	function writeBool(val) {
		let bin = createBufferFor.bool(val)
		buffer.push(bin)
	}

	function writeTab() {
		let bin = createBufferFor.tab()
		buffer.push(bin)
	}

	this.result = () => {
		return Buffer.concat(buffer)
	}
}

module.exports = PropertyWriter
