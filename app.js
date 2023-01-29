const patterns = require('./config/patterns')
const { midi_codes: mc } = require('./config/midi_codes')
const colors = require('./config/colors')
const Device = require('./lib/device')
const Launchkey = require('./lib/launckey')

// Config and initialization process
const device_name = 'Launchkey Mini LK Mini MIDI'
const device_name_2 = 'Launchkey Mini LK Mini InControl'

console.info("Initializing keyboard and pads devices by finding and opening ports...")

const keyboard = new Device(device_name)
const pads = new Device(device_name_2)

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

// touch and keep mode
lc.state.pad_8['mode'] = 'keep'
lc.state.pad_8['color'] = 113
lc.light_on_pad(8)

lc.on('pad_input', (data) => {
    if(['1', '2', '9', '10'].includes(data.id)) {
        console.log(`Segment LED control pressed on ${data.id}, should send turn ${data.state.light} to WLED`)
        // Send to WLED a turn off or on according to the segment
    }

    if(data.id == 8) {
        if(!lc.state.pad_8.light) {
            lc.state.pad_1['mode'] = 'touch'
            lc.state.pad_2['mode'] = 'touch'
            lc.state.pad_9['mode'] = 'touch'
            lc.state.pad_10['mode'] = 'touch'

            lc.light_off_pad(1)
            lc.light_off_pad(2)
            lc.light_off_pad(9)
            lc.light_off_pad(10)

            console.log('Turn on Touch mode for effects')
        } else {
            lc.state.pad_1['mode'] = 'keep'
            lc.state.pad_2['mode'] = 'keep'
            lc.state.pad_9['mode'] = 'keep'
            lc.state.pad_10['mode'] = 'keep'

            lc.light_on_pad(1)
            lc.light_on_pad(2)
            lc.light_on_pad(9)
            lc.light_on_pad(10)

            console.log('Turn off Touch mode for effects')
        }
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
        console.log(`Received a pad_selected event assigned to pattern "${pattern.name}"`)
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

// Colors (no need for complex class as for the pads... for now)

keyboard.input.on('message', (deltaTime, message) => {
    const [code_event, id, value] = message
    if(code_event == mc.note_on && colors[id]) {
        console.log(`Change the color palette of WLED with ${colors[id]}`);
    }
})