const Effect = require("../effect");

class Worm extends Effect {
    
    constructor(segments, manager) {
        super(segments)
        this.timeouts = []
        this.manager = manager
    }

    run() {
        let current_start_at = 0
        this.segments.forEach(s => { s.off() })
        let max_seg_length = Math.min(...this.segments.map(s => s.seg_length))

        let strob_fc = () => {
            let end_worm_at = current_start_at + this.manager.worm_length

            this.segments.forEach(s => {
                s.on_between(current_start_at, end_worm_at)
            })

            let change_timeout = setTimeout(() => {
                if(current_start_at > max_seg_length) {
                    current_start_at = 0
                } else {
                    current_start_at += this.manager.delta
                }
                strob_fc()
            }, this.manager.speed)

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