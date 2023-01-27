const patterns = require('./config/patterns')
const Device = require('./lib/device')
const Launchkey = require('./lib/launckey')

// Config and initialization process
const device_name = 'Launchkey Mini LK Mini MIDI'
const device_name_2 = 'Launchkey Mini LK Mini InControl'

console.info("Initializing keyboard and pads devices by finding and opening ports...")


const keyboard = new Device(device_name)
const pads = new Device(device_name_2)


// keyboard.input.on('message', (deltaTime, message) => { console.log(message) })
// pads.input.on('message', (deltaTime, message) => { console.log(message) })

console.info("Keyboard and Pads are initialized, activate InControl for pads")

pads.activateInControl()
lc = new Launchkey(pads)

// Setup the 4 control LED area

lc.state.pad_1['mode'] = 'keep'
lc.state.pad_2['mode'] = 'keep'
lc.state.pad_9['mode'] = 'keep'
lc.state.pad_10['mode'] = 'keep'

lc.light_on_pad(1)
lc.light_on_pad(2)
lc.light_on_pad(9)
lc.light_on_pad(10)

lc.on('pad_input', (data) => {
    if(['1', '2', '9', '10'].includes(data.id)) {
        console.log(`Segment LED control pressed on ${data.id}, should send turn ${data.state.light} to WLED`)
        // Send to WLED a turn off or on according to the segment
    }
})

// Patterns setup

let setup_patterns = []
patterns.forEach(pattern => {
    lc.setup_for_pattern(pattern.pad_id, pattern.color)
    setup_patterns.push(pattern)
})

lc.on('pad_selected', (data) => {
    let pattern = setup_patterns.find(p => p.pad_id == data.pad_id )

    if(pattern) {
        console.log(`Received a pad_selected event assigned to pattern : ${pattern}`)
        // should activate pattern and manage with WLED
        // Use trigger function ?
    }
})

// Pot Management

lc.on('pot_input', (data) => {
    if(lc.selected_pattern_pad) {
        let pattern = setup_patterns.find(p => p.pad_id == lc.selected_pattern_pad )
        
        if(pattern && pattern.controls[`pod_${data.id}`]) {
            console.log(`Pod ${data.id} changed, a pattern is selected and this control is assigned to effect ${pattern.controls[`pod_${data.id}`]}`)
            // if so, update and send informations on WLED    
        }
    }
})