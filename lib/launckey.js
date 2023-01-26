// Main interface to interact with Launchkey
// Must be binded with a device to send output.

const { reverted_codes: rc } = require("../config/midi_codes")
const { midi_codes: mc } = require("../config/midi_codes")

//
class Launchkey {
    constructor(device) {
        this.device = device

        // Keep an 'image' of the pads to know
        // if they're turned on or not
        this.state = {
            pad_1: false,
            pad_2: false,
            pad_3: false,
            pad_4: false,
            pad_5: false,
            pad_6: false,
            pad_7: false,
            pad_8: false,
            pad_9: false,
            pad_10: false,
            pad_11: false,
            pad_12: false,
            pad_13: false,
            pad_14: false,
            pad_15: false,
            pad_16: false
        }

        // If a pad is pressed then turn on or off the light
        // according to its state
        this.device.input.on('message', (_dt, message) => {
            const [event, id, value] = message
            const [name, pad_id] = rc[id].split('_')

            if(event == mc.note_on && name == 'pad') {
                !this.state[`pad_${pad_id}`] ? this.light_on_pad(pad_id) : this.light_off_pad(pad_id)
            }
        })
    }

    light_on_pad(pad_id, color=17) {
        this.device.output.send([mc.note_on, mc[`pad_${pad_id}`], color])
        this.state[`pad_${pad_id}`] = true
    }

    light_off_pad(pad_id) {
        this.device.output.send([mc.note_off, mc[`pad_${pad_id}`], 0])
        this.state[`pad_${pad_id}`] = false
    }
}

module.exports = Launchkey