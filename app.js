const Device = require('./lib/device')
const Launchkey = require('./lib/launckey')

// Config and initialization process
const device_name = 'Launchkey Mini LK Mini MIDI'
const device_name_2 = 'Launchkey Mini LK Mini InControl'

console.info("Initializing keyboard and pads devices by finding and opening ports...")

const keyboard = new Device(device_name)
const pads = new Device(device_name_2)

keyboard.input.on('message', (deltaTime, message) => { console.log(message) })
pads.input.on('message', (deltaTime, message) => { console.log(message) })

console.info("Keyboard and Pads are initialized, activate InControl for pads")

pads.activateInControl()
lc = new Launchkey(pads)