const Effect = require("../effect");

class WormReactive extends Effect {
    
    static MIN_SPEED=50
    
    constructor(segments) {
        super(segments)
        this.timeouts = []
    }

    run() {
        this.segments.forEach(s => {
            s.shift_color = 0x000000
            s.off() 
        })

        let shift_fc = () => {
            let shift_timeout = setTimeout(() => {
                this.segments.forEach(s => s.shift_leds(s.reverted))
                shift_fc()
            }, this.speed)
    
            this.timeouts.push(shift_timeout)
        }

        shift_fc()
    }

    stop() {
        this.timeouts.forEach(timeout => {
            clearTimeout(timeout)
        });

        this.segments.forEach(s => s.fill())
    }

    speed_calc(value) {
        return WormReactive.MIN_SPEED - (value * WormReactive.MIN_SPEED / 127)
    }
}

module.exports = WormReactive