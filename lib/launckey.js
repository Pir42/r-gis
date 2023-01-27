// Main interface to interact with Launchkey
// Must be binded with a device to send output.

const { reverted_codes: rc } = require("../config/midi_codes")
const { midi_codes: mc } = require("../config/midi_codes")
const EventEmitter = require('events');

//
class Launchkey extends EventEmitter {

    constructor(device) {
        this.device = device

        // Keep an 'image' of the pads to know
        // if they're turned on or not
        this.state = {
            pad_1: { light: false, is_blinking: false, mode: 'touch' },
            pad_2: { light: false, is_blinking: false, mode: 'touch' },
            pad_3: { light: false, is_blinking: false, mode: 'touch' },
            pad_4: { light: false, is_blinking: false, mode: 'touch' },
            pad_5: { light: false, is_blinking: false, mode: 'touch' },
            pad_6: { light: false, is_blinking: false, mode: 'touch' },
            pad_7: { light: false, is_blinking: false, mode: 'touch' },
            pad_8: { light: false, is_blinking: false, mode: 'touch' },
            pad_9: { light: false, is_blinking: false, mode: 'touch' },
            pad_10: { light: false, is_blinking: false, mode: 'touch' },
            pad_11: { light: false, is_blinking: false, mode: 'touch' },
            pad_12: { light: false, is_blinking: false, mode: 'touch' },
            pad_13: { light: false, is_blinking: false, mode: 'touch' },
            pad_14: { light: false, is_blinking: false, mode: 'touch' },
            pad_15: { light: false, is_blinking: false, mode: 'touch' },
            pad_16: { light: false, is_blinking: false, mode: 'touch' },
            pot_1: 0,
            pot_2: 0,
            pot_3: 0,
            pot_4: 0,
            pot_5: 0,
            pot_6: 0,
            pot_7: 0,
            pot_8: 0,
        }

        // Input Manager
        this.device.input.on('message', (_dt, message) => {
            const [code_event, id, value] = message
            const [name, control_id] = rc[id].split('_')

            switch (name) {
                case 'pad':
                    this.on_pad_input(code_event, control_id)
                    break;
            
                case 'pot':
                    this.on_pot_input(code_event, control_id, value)
                    break;

                default:
                    break;
            }

        })
    }

    on_pad_input(code_event, pad_id) {
        let pad_state = this.state[`pad_${pad_id}`]
        if(pad_state['mode'] == 'keep' && code_event == mc.note_on) {
            this.trigger_pad_light(pad_id)
        } else if(pad_state['mode'] == 'touch') {
            if(code_event == mc.note_on) {
                this.light_on_pad(pad_id)
            } else if(code_event == mc.note_off) {
                this.light_off_pad(pad_id)
            }
        }

        this.emit('pad_input', {
            id: pad_id,
            event: code_event,
            state: pad_state
        })
    }

    on_pot_input(code_event, pot_id, value) {
        this.state[`pot_${pot_id}`] = value

        this.emit('pot_input', {
            id: pot_id,
            event: code_event,
            state: this.state[`pot_${pot_id}`]
        })
    }

    trigger_pad_light(pad_id, color=17) {
        !this.state[`pad_${pad_id}`]['light'] ? this.light_on_pad(pad_id, color) : this.light_off_pad(pad_id)
    }

    light_on_pad(pad_id, color=17) {
        this.device.output.send([mc.note_on, mc[`pad_${pad_id}`], color])
        this.state[`pad_${pad_id}`]['light'] = true
    }

    light_off_pad(pad_id) {
        this.device.output.send([mc.note_off, mc[`pad_${pad_id}`], 0])
        this.state[`pad_${pad_id}`]['light'] = false
    }
}

module.exports = Launchkey