// Quick Interface to be able
// to access input and output of
// a MIDI device
const midi = require('midi');
const { midi_codes: mc } = require("../config/midi_codes")
const midihelper = require('./helpers/midihelper');

class Device {
    constructor(device_name, auto_init=true) {
        this.device_name = device_name
        this.input_index_device = undefined
        this.output_index_device = undefined
        this.input = new midi.input();
        this.output = new midi.output();

        if (auto_init) {
            this.init()
        }
    }

    // Find the index of device by name for
    // input and output, 
    init() {
        this.input_index_device = midihelper.findIndexByName(this.input, this.device_name)
        this.output_index_device = midihelper.findIndexByName(this.output, this.device_name)

        // open the ports
        if(this.input_index_device != undefined) {
            this.input.openPort(this.input_index_device)
        }

        if(this.output_index_device != undefined) {
            this.output.openPort(this.output_index_device)
        }
    }

    activateInControl() {
        this.output.send([mc.note_on, mc.incontrol, 127])
    }
    
    closeAllPorts() {
        this.input.closePort()
        this.output.closePort()
    }
}

module.exports = Device