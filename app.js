const Device = require('./lib/device')

// Config
const device_name = 'Launchkey Mini LK Mini MIDI'
const device_name_2 = 'Launchkey Mini LK Mini InControl'

const keyboard = new Device(device_name, false)
const pads = new Device(device_name_2, false)

// Show messages received
keyboard.input.on('message', (deltaTime, message) => { console.log(message) })
pads.input.on('message', (deltaTime, message) => { console.log(message) })

keyboard.init()
pads.init()