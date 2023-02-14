const Effect = require("../effect");

class Strob extends Effect {
    
    static MIN_SPEED=500

    constructor(segments, fade=false) {
        super(segments)
        this.speed = Strob.MIN_SPEED
        this.timeouts = []
        this.fade = fade
    }

    run() {
        let strob_fc = () => {
            let refresh = this.speed
            if(this.fade) {
                refresh = this.speed / 3
            }

            this.segments.forEach(s => s.fill())

            let off_timeout = setTimeout(() => {
                let delay = this.speed

                if(this.fade) {
                    this.segments.forEach(s => s.decrease_brightness_by_color(0, 0.4))
                    delay += 100
                } else {
                    this.segments.forEach(s => s.off())
                }

                let on_timeout = setTimeout(strob_fc, this.speed)
                this.timeouts.push(on_timeout)
            }, refresh)

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