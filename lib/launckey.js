// Main interface to interact with Launchkey
// Must be binded with a device to send output.

const { reverted_codes: rc } = require("../config/midi_codes")
const { midi_codes: mc } = require("../config/midi_codes")
const EventEmitter = require('events');

//
class Launchkey extends EventEmitter {

    constructor(device) {
        super()
        this.device = device
        this.selected_pattern_pad = null

        // Keep an 'image' of the pads to know
        // if they're turned on or not. Put the ID for
        // easier id finding, filter...
        this.state = {
            pad_1: { id: 1, light: false, is_blinking: false, mode: 'touch', color: 17 },
            pad_2: { id: 2, light: false, is_blinking: false, mode: 'touch', color: 17 },
            pad_3: { id: 3, light: false, is_blinking: false, mode: 'touch', color: 17 },
            pad_4: { id: 4,light: false, is_blinking: false, mode: 'touch', color: 17 },
            pad_5: { id: 5, light: false, is_blinking: false, mode: 'touch', color: 17 },
            pad_6: { id: 6, light: false, is_blinking: false, mode: 'touch', color: 17 },
            pad_7: { id: 7, light: false, is_blinking: false, mode: 'touch', color: 17 },
            pad_8: { id: 8, light: false, is_blinking: false, mode: 'touch', color: 17 },
            pad_9: { id: 9, light: false, is_blinking: false, mode: 'touch', color: 17 },
            pad_10: { id: 10, light: false, is_blinking: false, mode: 'touch', color: 17 },
            pad_11: { id: 11, light: false, is_blinking: false, mode: 'touch', color: 17 },
            pad_12: { id: 12, light: false, is_blinking: false, mode: 'touch', color: 17 },
            pad_13: { id: 13, light: false, is_blinking: false, mode: 'touch', color: 17 },
            pad_14: { id: 14, light: false, is_blinking: false, mode: 'touch', color: 17 },
            pad_15: { id: 15, light: false, is_blinking: false, mode: 'touch', color: 17 },
            pad_16: { id: 16, light: false, is_blinking: false, mode: 'touch', color: 17 },
            pod_1: 0,
            pod_2: 0,
            pod_3: 0,
            pod_4: 0,
            pod_5: 0,
            pod_6: 0,
            pod_7: 0,
            pod_8: 0
        }

        // Input Manager
        this.device.input.on('message', (_dt, message) => {
            const [code_event, id, value] = message
            const associated_event = rc[id]

            if(associated_event) {
                const [name, control_id] = associated_event.split('_')

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
        } else if(pad_state['mode'] == 'pattern') {
            if(code_event == mc.note_on) {
                this.trigger_pattern_selection(pad_id)
            }
        }

        if(code_event == mc.note_on) {
            this.emit('pad_input', {
                id: pad_id,
                code_event: code_event,
                state: pad_state
            })
        } else if(code_event == mc.note_off) {
            this.emit('pad_release', {
                id: pad_id,
                code_event: code_event,
                state: pad_state
            })
        }
    }

    on_pot_input(code_event, pot_id, value) {
        this.state[`pot_${pot_id}`] = value

        this.emit('pot_input', {
            id: pot_id,
            code_event: code_event,
            state: this.state[`pot_${pot_id}`]
        })
    }

    trigger_pad_light(pad_id) {
        !this.state[`pad_${pad_id}`]['light'] ? this.light_on_pad(pad_id, this.state[`pad_${pad_id}`]['color']) : this.light_off_pad(pad_id)
    }

    light_on_pad(pad_id) {
        this.device.output.send([mc.note_on, mc[`pad_${pad_id}`], this.state[`pad_${pad_id}`]['color']])
        this.state[`pad_${pad_id}`]['light'] = true
    }

    light_off_pad(pad_id) {
        this.device.output.send([mc.note_off, mc[`pad_${pad_id}`], 0])
        this.state[`pad_${pad_id}`]['light'] = false
    }

    light_blink(pad_id, interval=400) {
        this.stop_blink()

        // First trigger to have directly a response
        // on pad
        this.light_off_pad(pad_id)
        setTimeout(() => {
            this.light_on_pad(pad_id)
        }, interval/2)

        this.blink_interval = setInterval(() => {
            this.light_off_pad(pad_id)
            setTimeout(() => {
                this.light_on_pad(pad_id)
            }, interval/2)
        }, interval)
    }

    stop_blink() {
        clearInterval(this.blink_interval)
    }

    change_pad_color(pad_id, new_color) {
        this.state[`pad_${pad_id}`]['color'] = new_color
        if(!this.state[`pad_${pad_id}`]['light']) {
            this.light_on_pad(pad_id)
        }
    }

    setup_for_pattern(pad_id, color) {
        this.change_pad_color(pad_id, color)
        this.light_on_pad(pad_id, this.state[`pad_${pad_id}`]['color'])
        this.state[`pad_${pad_id}`]['mode'] = 'pattern'
        this.state[`pad_${pad_id}`]['is_selected'] = false
    }

    trigger_pattern_selection(pad_id) {
        let current_selected_pad = this.current_selected_pad()

        if(current_selected_pad == null) {
            this.select_pattern_pad(pad_id)
        } else if(current_selected_pad.id == pad_id) {
            this.deselect_pattern_pad(current_selected_pad.id)
        } else {
            this.deselect_pattern_pad(current_selected_pad.id)
            this.select_pattern_pad(pad_id)
        }
    }

    select_pattern_pad(pad_id) {
        if(this.current_selected_pad() == null) {
            this.light_blink(pad_id)
            this.state[`pad_${pad_id}`]['is_selected'] = true
            this.selected_pattern_pad = pad_id
            this.emit('pad_selected', {
                pad_id: pad_id,
                state: this.state[`pad_${pad_id}`]
            })
        }
    }

    deselect_pattern_pad(pad_id) {
        this.stop_blink()
        this.state[`pad_${pad_id}`]['is_selected'] = false
        this.light_on_pad(pad_id)
        this.selected_pattern_pad = null
        this.emit('pad_deselected', {
            pad_id: pad_id,
            state: this.state[`pad_${pad_id}`]
        })
    }

    current_selected_pad() {
        let selected_pad_arr = Object.entries(this.state).filter(([key, _obj]) => key.startsWith('pad')).find(([key, p]) => p.mode == 'pattern' && p.is_selected)
        return selected_pad_arr ? selected_pad_arr[1] : undefined
    }
}

module.exports = Launchkey