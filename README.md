# Skyranger

A Node.JS library for generating the relevant binary file for mass-importing custom soldier names into XCOM 2.

## Getting Started

Install Skyranger in your project: 

```
 npm i -S skyranger
```

and import:

```
let skyranger = require('skyranger')
```

## Usage

Skyranger exposes a single function, which takes in an **array** of soldier configurations, and returns a `Buffer`. These configurations are structured as so:

``` 
{
	firstName: string,
	nickName: string
	lastName: string,
	gender: number,
	biography: string
}
```


Both **firstName** and **gender** are required fields. **gender** must be either *1 (male)* or *2 (female)*. If any of these rules fail for any soldier in the array, an error will be thrown.

 ### Example

 To generate two soldiers and save the file to disk:

```
let fs = require('fs')
let skyranger = require('skyranger')

let soldiers = [{
	firstName: 'John,
	nickName: 'Central Officer'
	lastName: 'Bradford',
	gender: 1,
	biography: 'Central Officer John Bradford is the Executive Officer attached to XCOM during XCOM: Enemy Unknown and XCOM 2. He reports to the Commanding Officer (the player) and often confers with Dr. Shen and Dr. Vahlen. Bradford is frequently referred to by, and answers to, the callsign "Central".'
}, {	
	firstName: 'Mrs',
	lastName: 'Sectoid,
	gender: 2,
}]

let soldiersBuffer = skyranger(soldiers)

fs.writeFile('MyCustomSoldiers.bin', soldiersBuffer, (err) => {
	if (err) return console.log('Error')
	console.log('File saved')
})
```

 ### Installation

 To use the generated binary file, you will need to drag the file into the game's Character Pool directory, and then import the soldiers for use in game. To do this:

- Place the downloaded file into your XCOM Character Pool directory (usually %userprofile%\Documents\My Games\XCOM2\XComGame\CharacterPool)
- Navigate to the 'Character Pool' menu in XCOM 2
- Click 'Import Character'
- Select 'Custom'
- Click 'IMPORT ENTIRE POOL'
- Consider ensuring that "Use Character Pool Only" is selected if you wish only your custom soldiers to be selected in-game