const mc = require('./config/midi_codes')
const Device = require('./lib/device')

// Config and initialization process
const device_name = 'Launchkey Mini LK Mini MIDI'
const device_name_2 = 'Launchkey Mini LK Mini InControl'

const keyboard = new Device(device_name, false)
const pads = new Device(device_name_2, false)

keyboard.input.on('message', (deltaTime, message) => { console.log(message) })
pads.input.on('message', (deltaTime, message) => { console.log(message) })

console.info("Initializing keyboard and pads devices by finding and opening ports...")

keyboard.init()
pads.init()

console.info("Keyboard and Pads are initialized, activate InControl for pads")

pads.activateInControl()