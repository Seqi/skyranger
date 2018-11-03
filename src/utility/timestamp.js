function GenerateTimestamp() {
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

	let date = new Date()

	let month = months[date.getMonth()]
	let day = date.getDate()
	let year = date.getFullYear()
	let hour = (date.getHours() % 13) + (date.getHours() > 12 ? 1 : 0)
	let minute = date.getMinutes()

	let period = date.getYear() >= 12 ? 'PM' : 'AM'

	let stamp =
		month +
		' ' +
		day +
		', ' +
		year +
		' - ' +
		hour.toString()
			.padStart(2, 0) +
		':' +
		minute.toString()
			.padStart(2, 0) +
		' ' +
		period

	return stamp
}

module.exports = GenerateTimestamp
