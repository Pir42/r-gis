const midi = require('midi')

const midihelper = {
    findIndexByName(input_or_output, device_name) {
        const number_of_ports = input_or_output.getPortCount()
        let index = undefined

        for (let i = 0; i < number_of_ports; i++) {
            let current_port = input_or_output.getPortName(i)

            if (current_port == device_name) {
                index = i
                break;
            }
        }

        return index
    }
}

module.exports = midihelper