const Effect = require("../effect");

class Strob extends Effect {
    
    static MIN_SPEED=500

    constructor(segments) {
        super(segments)
        this.speed = Strob.MIN_SPEED
        this.timeouts = []
    }

    run() {
        let strob_fc = () => {
            this.segments.forEach(s => s.fill())

            let off_timeout = setTimeout(() => {
                this.segments.forEach(s => s.off())
                let on_timeout = setTimeout(strob_fc, this.speed)
                this.timeouts.push(on_timeout)
            }, this.speed)

            this.timeouts.push(off_timeout)
        }


        strob_fc()
    }

    stop() {
        this.timeouts.forEach(timeout => {
            clearTimeout(timeout)
        });

        this.segments.forEach(s => s.fill())
    }

    speed_calc(value) {
        return Strob.MIN_SPEED - (value * Strob.MIN_SPEED / 127)
    }
}

module.exports = Strob