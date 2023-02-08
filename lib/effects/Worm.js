const Effect = require("../effect");

class Worm extends Effect {
    
    static MIN_SPEED=50
    static MIN_SEG_LENGTH=1
    static MAX_SEG_LENGTH=20
    static MAX_DELTA = 5

    constructor(segments) {
        super(segments)
        this.speed = Worm.MIN_SPEED
        this.timeouts = []
        this.worm_length = 3
        this.delta = 2
    }

    run() {
        let current_start_at = 0
        this.segments.forEach(s => { s.off() })
        let max_seg_length = Math.max(...this.segments.map(s => s.seg_length))

        let strob_fc = () => {
            this.segments.forEach(s => {
                let end_worm_at = current_start_at + this.worm_length

                if(end_worm_at > s.seg_end) {
                    end_worm_at = (s.seg_length-1)
                }

                s.on_between(current_start_at, end_worm_at)
            })

            let change_timeout = setTimeout(() => {
                if(current_start_at > max_seg_length) {
                    current_start_at = 0
                } else {
                    current_start_at += this.delta
                }
                strob_fc()
            }, this.speed)

            this.timeouts.push(change_timeout)
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
        return Worm.MIN_SPEED - (value * Worm.MIN_SPEED / 127)
    }

    seg_length_calc(value) {
        return ((Worm.MAX_SEG_LENGTH - Worm.MIN_SEG_LENGTH) / 127) * value + Worm.MIN_SEG_LENGTH
    }

    delta_calc(value) {
        return ((Worm.MAX_DELTA - 1) / 127) * value + 1
    }
}

module.exports = Worm